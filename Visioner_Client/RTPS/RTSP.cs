using PluginFramework;
using System;
using System.Drawing;
using Emgu.CV;
using Emgu.CV.Structure;

namespace RTPS
{
    public class RTSP : ICameraType
    {
        public string Name
        {
            get { return "RTSP"; }
        }

        public byte[] Run(string source)
        {
            try
            {
                VideoCapture _video_capture = new VideoCapture(source);
                Image<Bgr, Byte> currentFrame = _video_capture.QueryFrame().ToImage<Bgr, Byte>();

                if (currentFrame != null)
                {
                    byte[] content = ImageToByte(currentFrame.ToBitmap());
                    return content;
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex) { return null; }
        }
        private byte[] ImageToByte(Bitmap img)
        {
            ImageConverter converter = new ImageConverter();
            return (byte[])converter.ConvertTo(img, typeof(byte[]));
        }
    }
}
