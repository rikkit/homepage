import React, { useContext, createContext } from "react";

interface TilePosition {
  tile: Tile;
  style: React.CSSProperties & { [prop: string]: string };
  diameter: number;
  position: [number, number];
}

type Tiles = {
  [K in keyof TileData]: TilePosition | null;
}

const buildStyle = (diameter: number, [x, y]: [number, number]): TilePosition["style"] => ({
  // TODO this bit
  transform: `translate(${x}px, ${y}px)`,
  "--size": `${diameter}px`,
});

class Surface {
  public tiles: Tiles = {
    lastfm: null,
    blogs: null,
    github: null,
    twitter: null,
  };

  private addTile(tile: Tile, diameter: number, position: [number, number]) {
    this.tiles[tile.style] = {
      tile,
      diameter,
      position,
      style: buildStyle(diameter, position),
    };
  }

  public loadTiles(tiles: TileData) {
    if (!this.tiles.lastfm && tiles.lastfm) {
      this.addTile(tiles.lastfm, 420, [0, 0]);
    }

    if (!this.tiles.blogs && tiles.blogs) {
      this.addTile(tiles.blogs, 300, [0, 0]);
    }

    if (!this.tiles.github && tiles.github) {
      this.addTile(tiles.github, 150, [0, 0]);
    }


    if (!this.tiles.twitter && tiles.twitter) {
      this.addTile(tiles.twitter, 100, [0, 0]);
    }
  }
}

export const SurfaceContext = createContext(new Surface());

