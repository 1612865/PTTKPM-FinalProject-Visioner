using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using System.Net;
using System.IO;
using System.Reflection;
using System.Xml;

using PluginFramework;

namespace Visioner_Client
{
    public partial class Form1 : Form
    {
        private Dictionary<string, ICameraType> _camera_types = new Dictionary<string, ICameraType>();
        private List<Camera> _cameras = new List<Camera>();
        private string _server = "http://demo.unicore.asia:9990/api/upload/";
        public Form1()
        {
            InitializeComponent();
            LoadCameraTypes(Application.StartupPath + "\\plugins\\");
            LoadCameras();
            ReloadCameraList();
        }

        public void UploadMultipart(byte[] file, string filename, string contentType, string url)
        {
            var webClient = new WebClient();
            string boundary = "------------------------" + DateTime.Now.Ticks.ToString("x");
            webClient.Headers.Add("Content-Type", "multipart/form-data; boundary=" + boundary);
            var fileData = webClient.Encoding.GetString(file);
            var package = string.Format("--{0}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"{1}\"\r\nContent-Type: {2}\r\n\r\n{3}\r\n--{0}--\r\n", boundary, filename, contentType, fileData);

            var nfile = webClient.Encoding.GetBytes(package);
            webClient.UploadDataAsync(new Uri(url), "POST", nfile);
        }
        private string GetCameraStatusText(bool status)
        {
            return status == true ? "Running" : "Stopped";
        }
        private void LoadCameras()
        {
            if (File.Exists("data.xml"))
            {
                XmlDocument xmlDoc = new XmlDocument();
                xmlDoc.Load("data.xml");
                foreach (XmlNode xmlNode in xmlDoc.ChildNodes[1].ChildNodes)
                {
                    string id = xmlNode.Attributes["id"].Value;
                    string key = xmlNode.Attributes["key"].Value;
                    string source = xmlNode.Attributes["source"].Value;
                    string type = xmlNode.Attributes["type"].Value;
                    bool status = xmlNode.Attributes["status"].Value == "True" ? true: false;
                    Camera cam = new Camera(id, source, key, type, status);
                    _cameras.Add(cam);
                }
            }
            if (File.Exists("server.txt"))
            {
                StreamReader sr = new StreamReader("server.txt");
                this._server = sr.ReadLine();
                sr.Close();
            }
            
        }
        private void LoadCameraTypes(string folder)
        {
            _camera_types.Clear();
            foreach (var dll in Directory.GetFiles(folder, "*.dll"))
            {
                try
                {
                    var asm = Assembly.LoadFrom(dll);
                    foreach (var type in asm.GetTypes())
                    {
                        if (type.GetInterface("ICameraType") == typeof(ICameraType))
                        {
                            var camera_type = Activator.CreateInstance(type) as ICameraType;
                            _camera_types[camera_type.Name] = camera_type;
                        }
                    }
                }
                catch (ConstraintException) { }
            }
        }
        private void ReloadCameraList()
        {
            lstCamera.Items.Clear();
            foreach (Camera cam in _cameras){
                string[] arr = new string[5];
                arr[0] = cam.id;
                arr[1] = cam.camera_source;
                arr[2] = cam.key;
                arr[3] = cam.type;
                arr[4] = GetCameraStatusText(cam.status);
                lstCamera.Items.Add(new ListViewItem(arr));
            }
        }
        private void ReloadRunner()
        {
        }
        private void newToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (_camera_types.Count == 0)
                MessageBox.Show("No camera type found!", "Error");
            else
            {
                CameraFrm camFrm = new CameraFrm(Constant.ADD_CAM, null, _camera_types);
                camFrm.ShowDialog();
                if (camFrm.DialogResult == DialogResult.OK)
                {
                    _cameras.Add(camFrm.camera);
                    ReloadCameraList();
                    ReloadRunner();
                }
            }
        }

        private void EditListViewItem()
        {
            if (lstCamera.SelectedIndices.Count > 0)
            {
                int index = lstCamera.SelectedIndices[0];
                ListViewItem item = lstCamera.Items[index];
                if (_camera_types.Count == 0)
                    MessageBox.Show("No camera type found!", "Error");
                else
                {
                    CameraFrm camFrm = new CameraFrm(Constant.EDIT_CAM, _cameras[index], _camera_types);
                    camFrm.ShowDialog();
                    if (camFrm.DialogResult == DialogResult.OK)
                    {
                        Camera tmp = camFrm.camera;
                        _cameras[index] = tmp;
                        ReloadCameraList();
                        ReloadRunner();
                    }
                }
            }
        }
        private void editToolStripMenuItem_Click(object sender, EventArgs e)
        {
            EditListViewItem();
        }

        private void stopToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (lstCamera.SelectedIndices.Count > 0)
            {
                int index = lstCamera.SelectedIndices[0];
                _cameras[index].status = !_cameras[index].status;
                lstCamera.Items[index].SubItems[4].Text = GetCameraStatusText(_cameras[index].status);
            }
        }

        private void lstCamera_DoubleClick(object sender, EventArgs e)
        {
            EditListViewItem();
        }

        private void timer1_Tick(object sender, EventArgs e)
        {
            if (_cameras.Count != 0)
            {
                foreach (Camera cam in _cameras)
                {
                    if (cam.status)
                    {
                        var plugin = _camera_types[cam.type];
                        try
                        {
                            byte[] content = plugin.Run(cam.camera_source);
                            if (content != null)
                            {
                                UploadMultipart(content, "image.jpg", "image/jpeg", _server + cam.key);
                                lblStatus.Text = DateTime.Now.ToString("yyyy-MM-dd hh:mm:sszzz") + " Run " + cam.id + " success!";
                            }
                            else
                            {
                                lblStatus.Text = DateTime.Now.ToString("yyyy-MM-dd hh:mm:sszzz") + " Run " + cam.id + " failed!";
                            }
                                
                        }
                        catch (Exception ex)
                        {
                            lblStatus.Text = DateTime.Now.ToString("yyyy-MM-dd hh:mm:sszzz") + " Run " + cam.id + " failed!";
                        }
                    }
                    
                }
            }
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            timer1.Start();
        }

        private void Form1_FormClosing(object sender, FormClosingEventArgs e)
        {
            XmlWriter xmlWriter = XmlWriter.Create("data.xml");
            xmlWriter.WriteStartDocument();
            xmlWriter.WriteStartElement("cameras");
            foreach (Camera cam in _cameras)
            {
                xmlWriter.WriteStartElement("camera");
                xmlWriter.WriteAttributeString("id", cam.id);
                xmlWriter.WriteAttributeString("key", cam.key);
                xmlWriter.WriteAttributeString("source", cam.camera_source);
                xmlWriter.WriteAttributeString("type", cam.type);
                xmlWriter.WriteAttributeString("status", cam.status.ToString());
                xmlWriter.WriteEndElement();
            }
            
            xmlWriter.WriteEndElement();
            xmlWriter.WriteEndDocument();
            xmlWriter.Close();
        }
    }
}
