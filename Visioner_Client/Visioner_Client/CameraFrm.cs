using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using PluginFramework;

namespace Visioner_Client
{
    public partial class CameraFrm : Form
    {
        private int _type = 0;
        private Camera _camera = null;
        private Dictionary<string, ICameraType> _camera_types;

        public Camera camera
        {
            get { return this._camera; }
        }
        private void ChangeBtnText()
        {
            if (this._type == Constant.EDIT_CAM)
                btnOK.Text = "Edit";
            else btnOK.Text = "Add";
        }

        private void LoadCameraType()
        {
            foreach (var camera_type in this._camera_types)
            {
                cbxType.Items.Add(camera_type.Key);
            }
        }
        public CameraFrm(int type, Camera camera, Dictionary<string, ICameraType> camera_types)
        {
            InitializeComponent();
            this._type = type;
            this._camera = camera;
            this._camera_types = camera_types;
            ChangeBtnText();
            LoadCameraType();
        }

        private void CameraFrm_Load(object sender, EventArgs e)
        {
            if (cbxType.Items.Count > 0)
                cbxType.SelectedIndex = 0;
            if (this._camera != null)
            {
                txtID.Text = this._camera.id;
                txtKey.Text = this._camera.key;
                txtSource.Text = this._camera.camera_source;

                if (cbxType.Items.IndexOf(this._camera.type) >= 0)
                    cbxType.SelectedIndex = cbxType.Items.IndexOf(this._camera.type);
            }
        }

        private void btnOK_Click(object sender, EventArgs e)
        {
            if (this._camera == null)
                this._camera = new Camera();
            if (txtID.Text != "" && txtKey.Text != "" && txtSource.Text != "")
            {
                this._camera.id = txtID.Text;
                this._camera.camera_source = txtSource.Text;
                this._camera.key = txtKey.Text;
                this._camera.type = cbxType.Text;
                this.DialogResult = DialogResult.OK;
                this.Close();
            }
        }

    }
}
