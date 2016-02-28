using System;
using System.Collections.Generic;
using System.Linq;
using Humanizer;

namespace homepage.Generator
{
    public class PageMeta
    {
        public const string MD_META_PREFIX = "--";

        public string Title { get; set; }
        public DateTimeOffset? Date { get; set; }

        public static PageMeta Parse(IEnumerable<string> lines)
        {
            var meta = new PageMeta();
            foreach (var line in lines.TakeWhile(line => line.StartsWith(MD_META_PREFIX)))
            {
                var metaType = new string(line.Skip(MD_META_PREFIX.Length).TakeWhile(c => c != ' ').ToArray());
                var content = new string(line.Skip(metaType.Length + 3).ToArray());

                switch (metaType)
                {
                    case "title":
                        meta.Title = content;
                        break;
                    case "date":
                        DateTimeOffset articleDate;
                        if (DateTimeOffset.TryParse(content, out articleDate))
                        {
                            meta.Date = articleDate;
                        }
                        break;
                }
            }

            return meta;
        }
    }
}