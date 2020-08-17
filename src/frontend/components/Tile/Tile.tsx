import classnames from "classnames";
import React, { useState, useCallback, useEffect } from "react";
import css from "./Tile.module.scss";

interface Props {
  tile: Tile;
  className: string;
  style?: React.CSSProperties;
}

export const Tile = ({ tile, className, style = {} }: Props) => {
  if (!tile) {
    return null;
  }

  const [index, setIndex] = useState(0);
  const [timer, setTimer] = useState<number>();

  useEffect(() => {
    const delay = 5000 + (Math.random() * 100) + (Math.random() * 1000);
    const timer = window.setTimeout(() => setIndex((index + 1) % (tile.data.length + 1)), delay);
    setTimer(timer);
  }, [index]);

  const onScroll = useCallback((e: React.WheelEvent) => {
    clearTimeout(timer);
    setIndex((e.deltaY > 0 ? Math.min(index + 1, tile.data.length) : Math.max(index - 1, 0)))
  }, [index]);

  return (
    <div className={classnames(css.tile, css[tile.size], css[tile.style], className)} onWheel={onScroll} style={style}>
      <a className={css.link} href={(tile.data?.[index - 1]?.href) ?? tile.href} />

      <div className={css.clip}>
        <div className={css.faces} style={{ transform: `translateY(calc(${-index} * var(--size)))` }}>
          <div className={classnames(css.face, css.front)} />

          {(tile.data ?? []).map((face, i) => (
            <div
              key={i}
              className={classnames(css.face, { "overlay": face.overlay })}
              style={{ backgroundImage: `url('${face.image}')` }}>
            </div>
          ))}
        </div>
      </div>

      <h2 className={css.title} style={{ transform: `translateY(${index ? "0" : "var(--size)"})` }}>
        {tile.title}
      </h2>

      {index > 0 && (
        <>
          <h3 className={css.label} style={{ transform: `translateY(${index ? "0" : "var(--size)"})` }}>
            {tile.data[index - 1].name}
          </h3>
          <div className={css.badge} />

          {tile.data[index - 1].body && (
            <p className={css.detail}>{tile.data[index - 1].body}</p>
          )}
        </>
      )}
    </div>
  )
};
