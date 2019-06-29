using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Visioner_Client
{
    public class Camera
    {
        private string _id = "";
        private string _camera_source = "";
        private string _key = "";
        private string _type = "";
        private bool _is_running = true;
        public Camera()
        {

        }
        public Camera(string id, string camera_source, string key, string type, bool status)
        {
            this._id = id;
            this._camera_source = camera_source;
            this._key = key;
            this._type = type;
            this._is_running = status;
        }

        public string id
        {
            get { return _id; }
            set { _id = value;  }    
        }

        public string camera_source
        {
            get { return _camera_source; }
            set { _camera_source  = value; }
        }

        public string key
        {
            get { return _key; }
            set { _key = value; }
        }

        public string type
        {
            get { return _type; }
            set { _type = value; }
        }

        public bool status
        {
            get { return _is_running; }
            set { _is_running = value; }
        }
    }
}
