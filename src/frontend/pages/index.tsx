import Container from '@/components/container'
import Layout from '@/components/layout'
import { Tile } from "@/components/Tile/Tile"
import { getAllPostsForHome, getTileData } from '@/lib/api'
import Head from 'next/head'
import React, { useContext, useEffect } from "react"
import classnames from "classnames";
import css from "./index.module.scss";
import { SurfaceContext } from "../components/Surface/Surface"

type Props = Unwrap<ReturnType<typeof getStaticProps>>["props"]

export default function Index({ tiles, preview }: Props) {

  const surface = useContext(SurfaceContext);
  surface.loadTiles(tiles);

  return (
    <Layout preview={preview}>
      <Head>
        <title>Rikki Tooley</title>
      </Head>
      <Container>
        <span className="tagline">Full stack developer</span>
        <h1>Rikki Tooley</h1>

        <div className={classnames(css.tiles)}>
          {Object.entries(surface.tiles).map(([key, tileData]) => (
            <Tile
              key={key}
              className={classnames(css.tile, css[`${key}Tile`])}
              tile={tileData!.tile}
              style={tileData!.style}
            />
          ))}
        </div>
      </Container>
    </Layout>
  );
};

export const getStaticProps = async ({ preview = false }) => {
  const tiles = await getTileData(preview);
  return {
    props: { tiles, preview },
  }
};
