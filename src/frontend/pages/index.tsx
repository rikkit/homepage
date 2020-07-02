import Container from '@/components/container'
import Layout from '@/components/layout'
import { Tile } from "@/components/Tile/Tile"
import { getAllPostsForHome, getTileData } from '@/lib/api'
import Head from 'next/head'
import React from "react"

type Props = Unwrap<ReturnType<typeof getStaticProps>>["props"]

export default function Index({ allPosts, tiles, preview }: Props) {
  const heroPost = allPosts[0]
  const morePosts = allPosts.slice(1)
  return (
    <Layout preview={preview}>
      <Head>
        <title>Rikki Tooley</title>
      </Head>
      <Container>
        <span className="tagline">Full stack developer</span>
        <h1>Rikki Tooley</h1>

        <div className="tiles">
          <Tile tile={tiles.lastfm} />
        </div>
      </Container>
    </Layout>
  );
};

export const getStaticProps = async ({ preview = null }) => {
  const allPosts = (await getAllPostsForHome(preview)) || [];
  const tiles = await getTileData();

  return {
    props: { allPosts, tiles, preview },
  }
};
