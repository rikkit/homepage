import Container from '@/components/container'
import Layout from '@/components/layout'
import { Tile } from "@/components/Tile/Tile"
import { getAllPostsForHome, getTileData } from '@/lib/api'
import Head from 'next/head'
import React from "react"
import classnames from "classnames";
import style from "./index.module.scss";
import { Draggable } from "../components/Draggable/Draggable"

type Props = Unwrap<ReturnType<typeof getStaticProps>>["props"]

export default function Index({ tiles, preview }: Props) {
  return (
    <Layout preview={preview}>
      <Head>
        <title>Rikki Tooley</title>
      </Head>
      <Container>
        <span className="tagline">Full stack developer</span>
        <Draggable>
          <h1>Rikki Tooley</h1>
        </Draggable>
        <div className={classnames(style.tiles)} onDragOver={e => { e.preventDefault() }}>
          <Draggable>
            <Tile className={style.lastfmTile} tile={tiles.lastfm} />
          </Draggable>
          <Draggable>
            <Tile className={style.githubTile} tile={tiles.github} />
          </Draggable>
          <Draggable>
            <Tile className={style.twitterTile} tile={tiles.twitter} />
          </Draggable>
          <Draggable>
            <Tile className={style.blogTile} tile={tiles.blogs} />
          </Draggable>
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
