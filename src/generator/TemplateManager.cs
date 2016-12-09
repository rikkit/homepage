using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace generator
{
    public class TemplateManager
    {
        public Dictionary<string, string> Templates { get; private set; }

        public void LoadFromDirectory(string path)
        {
            var templates = Directory.EnumerateFiles(path)
                .Where(p => Path.GetExtension(p) == ".html")
                .ToDictionary(Path.GetFileNameWithoutExtension, File.ReadAllText);

            Templates = templates;
        }
    }
}