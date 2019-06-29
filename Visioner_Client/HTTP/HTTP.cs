using PluginFramework;
using System.Net;
using System;
namespace HTTP
{
    public class HTTP : ICameraType
    {
        public string Name
        {
            get { return "HTTP"; }
        }

        public byte[] Run(string source)
        {
            try
            {
                WebClient webclient = new WebClient();
                return webclient.DownloadData(source);
            } catch(Exception ex) {
                return null;
            }
            
        }
    }
}
