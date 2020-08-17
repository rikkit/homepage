import Container from '@/components/container'
import Layout from '@/components/layout'
import { Tile } from "@/components/Tile/Tile"
import { getAllPostsForHome, getTileData } from '@/lib/api'
import Head from 'next/head'
import React, { useContext, useEffect } from "react"
import classnames from "classnames";
import style from "./index.module.scss";
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

        <div className={classnames(style.tiles)}>
          {surface.tiles.lastfm &&
            <Tile
              className={style.lastfmTile}
              tile={surface.tiles.lastfm.tile}
              style={surface.tiles.lastfm.style}
            />
          }
          {surface.tiles.github &&
            <Tile
              className={style.githubTile}
              tile={surface.tiles.github.tile}
              style={surface.tiles.github.style}
            />
          }
          {surface.tiles.twitter &&
            <Tile
              className={style.twitterTile}
              tile={surface.tiles.twitter.tile}
              style={surface.tiles.twitter.style}
            />
          }
          {surface.tiles.blogs &&
            <Tile
              className={style.blogsTile}
              tile={surface.tiles.blogs.tile}
              style={surface.tiles.blogs.style}
            />
          }
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
