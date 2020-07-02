/// <reference types="next" />
/// <reference types="next/types/global" />

type Unwrap<T> = T extends Promise<infer U> ? U : T;

interface Tile {
  builtUtc: Date;
  title: string;
  style: string;
  href: string;
  size: "large";
  data: TileContent[];
}

interface TileContent {
  name: string;
  body: string;
  image: string;
  overlay: boolean;
}

interface TileData {
  github: Tile;
  lastfm: Tile;
  twitter: Tile;
}
