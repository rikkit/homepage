async function fetchAPI(query: string, { variables }: any = {}) {
  const res = await fetch(`${process.env.API_URL}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  const json = await res.json()
  if (json.errors) {
    console.error(json.errors)
    throw new Error('Failed to fetch API')
  }

  return json.data
}

export async function getPreviewPostBySlug(slug: string | string[]) {
  const data = await fetchAPI(
    `
  query PostBySlug($where: JSON) {
    posts(where: $where) {
      slug
    }
  }
  `,
    {
      variables: {
        where: {
          slug,
        },
      },
    }
  )
  return data?.posts[0]
}

export async function getAllPostsWithSlug() {
  const data = await fetchAPI(`
    {
      posts {
        slug
      }
    }
  `)
  return data?.allPosts
}

export async function getTileData(preview: boolean): Promise<TileData> {
  const res = await fetch(`${process.env.WEB_URL}/tiles.json`);
  const staticData = await res.json() as Partial<TileData>;
  const blogs = await getAllPostsForHome(preview);

  return {
    ...staticData,
    blogs: {
      builtUtc: new Date().toISOString(),
      href: "",
      size: "large",
      style: "blogs",
      title: "Blogs",
      data: blogs.map(b => ({
        name: b.title,
        body: b.excerpt,
        image: b.coverImage?.url?.startsWith("/") ? `${process.env.API_URL}${b.coverImage.url}` : b.coverImage?.url ?? null,
        overlay: false,
        href: `${process.env.WEB_URL}/posts/${b.slug}`,
      }))
    }
  } as TileData;
}

export async function getAllPostsForHome(preview: boolean) {
  const data = await fetchAPI(
    `
    query Posts($where: JSON){
      posts(sort: "created_at:desc", where: $where) {
        title
        slug
        created_at
        excerpt
        coverImage {
          url
        }
      }
    }
  `,
    {
      variables: {
        where: {
          ...(preview ? {} : { status: 'published' }),
        },
      },
    }
  )
  return data?.posts as Post[];
}

export async function getPostAndMorePosts(slug: string|string[], preview: boolean) {
  const data = await fetchAPI(
    `
  query PostBySlug($where: JSON, $where_ne: JSON) {
    posts(where: $where) {
      title
      slug
      created_at
      excerpt
      content
      coverImage {
        url
      }
      author {
        username
        avatar {
          url
        }
      }
    }

    morePosts: posts(sort: "created_at:desc", limit: 2, where: $where_ne) {
      title
      slug
      excerpt
      created_at
      coverImage {
        url
      }
      author {
        username
        avatar {
          url
        }
      }
    }
  }
  `,
    {
      variables: {
        where: {
          slug,
          ...(preview ? {} : { status: 'published' }),
        },
        where_ne: {
          ...(preview ? {} : { status: 'published' }),
          slug_ne: slug,
        },
      },
    }
  )
  return data
}
