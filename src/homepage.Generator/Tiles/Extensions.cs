using System;

namespace homepage.Generator.Tiles
{
    public static class Extensions
    {
        public static DateTimeOffset UnixEpoch => new DateTimeOffset(1970, 1, 1, 0, 0, 0, TimeSpan.Zero);

        public static int AsUnixTime(this DateTimeOffset dt)
        {
            var d = (dt - UnixEpoch).TotalSeconds;

            return Convert.ToInt32(d);
        }

        public static DateTimeOffset FromUnixTime(this double stamp)
        {
            var d = UnixEpoch.AddSeconds(stamp);
            return d;
        }
    }
}