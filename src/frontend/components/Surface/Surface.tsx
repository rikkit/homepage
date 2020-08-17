import React, { useContext, createContext } from "react";

interface TilePosition {
  tile: Tile;
  style: Pick<React.CSSProperties, "width" | "transform">;
  diameter: number;
  position: [number, number];
}

type Tiles = {
  [K in keyof TileData]: TilePosition | null;
}

const buildStyle = (diameter: number, [x, y]: [number, number]): TilePosition["style"] => ({
  // TODO this bit
  // width: `${diameter}px`,
  // transform: `translate(${x}px, ${y}px)`,
});

class Surface {
  public tiles: Tiles = {
    github: null,
    blogs: null,
    lastfm: null,
    twitter: null,
  };

  public loadTiles(tiles: TileData) {
    for (const key of Object.keys(tiles)) {
      if (tiles[key] != null) {
        const diameter = 100;
        const position: [number, number] = [500, 500];

        this.tiles[key] = {
          tile: tiles[key],
          diameter,
          position,
          style: buildStyle(diameter, position),
        };
      }
    }
  }
}

export const SurfaceContext = createContext(new Surface());

