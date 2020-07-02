import classnames from "classnames";
import React from "react";

interface Props {
  tile: Tile;
}

export const Tile = ({ tile }: Props) => {
  return (
    <div className={classnames("tile", tile.size, tile.style)}>
      <a className="tile-link" href={tile.href} />
      <div className="faces">
        <div className="front" />

        <div className="back">
          <ul className="tile-content">
            {tile.data.map((face, i) => (
              <li
                key={i}
                className={classnames("fill-template", "template-image", { "overlay": face.overlay })}
                style={{ backgroundImage: `url('${face.image}')` }}>
                <h3 className="template-lead">{face.name}</h3>
                {face.body && <p className="template-body">{face.body}</p>}
              </li>
            ))}
          </ul>
          <div className="tile-badge" />
        </div>
      </div>
      <p className="title">{tile.title}</p>
    </div>
  )
};
