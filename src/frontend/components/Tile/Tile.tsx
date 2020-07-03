import classnames from "classnames";
import React, { useState, useCallback } from "react";
import style from "./Tile.module.scss";

interface Props {
  tile: Tile;
  className: string;
}

export const Tile = ({ tile, className }: Props) => {

  const [index, setIndex] = useState(0);

  const onScroll = useCallback((e: React.WheelEvent) => {
    setIndex((e.deltaY > 0 ? Math.min(index + 1, tile.data.length - 1) : Math.max(index - 1, 0)))
  }, [index])

  return (
    <div className={classnames(style.tile, style[tile.size], style[tile.style], className)} onWheel={onScroll}>
      <a className={style.link} href={tile.href} />

      <div className={style.clip}>
        <div className={style.faces} style={{ transform: `translateY(calc(${-index} * var(--size)))` }}>
          <div className={classnames(style.face, style.front)} />

          {(tile.data ?? []).map((face, i) => (
            <div
              key={i}
              className={classnames(style.face, { "overlay": face.overlay })}
              style={{ backgroundImage: `url('${face.image}')` }}>
            </div>
          ))}
        </div>
      </div>

      <h2 className={style.title} style={{ transform: `translateY(${index ? "0" : "var(--size)"})` }}>
        {tile.title}
      </h2>

      {index > 0 && (
        <>
          <h3 className={style.label} style={{ transform: `translateY(${index ? "0" : "var(--size)"})` }}>
            {tile.data[index - 1].name}
          </h3>
          <div className={style.badge} />
          {tile.data[index - 1].body && <p>{tile.data[index - 1].body}</p>}
        </>
      )}
    </div>
  )
};
