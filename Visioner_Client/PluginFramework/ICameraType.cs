namespace PluginFramework
{
    public interface ICameraType
    {
        string Name { get; }
        byte[] Run(string source);
    }
}
