/// <reference types="next" />
/// <reference types="next/types/global" />

type Unwrap<T> = T extends Promise<infer U> ? U : T;

interface Tile {
  builtUtc: string;
  title: string;
  style: string;
  href: string;
  size: "large";
  data: TileContent[];
}

interface TileContent {
  name: string;
  body: string;
  image?: string;
  overlay: boolean;
  href?: string;
}

interface TileData {
  github: Tile;
  lastfm: Tile;
  twitter: Tile;
  blogs: Tile;
  [x: string]: Tile;
}

interface Post {
  title: string;
  slug: string;
  created_at: string;
  excerpt: string;
  date: string;
  author: {
    name: string;
    picture: string;
  }
  coverImage?: {
    url?: string;
  }
  content: string;
}
