import Head from "next/head"
import { GetStaticProps } from "next"

import Prismic from '@prismicio/client'
import { asText } from '@prismicio/helpers'
import { getPrismicCliente } from "../../services/prismic"

import styles from './styles.module.scss'
import Link from "next/link"

interface Post {
    slug: string
    title: { text: string }[]
    summary: { text: string }[]
    updatedAt: string
}

interface PostsProps {
    posts: Post[]
}

function Posts({ posts }: PostsProps) {
    console.log(JSON.stringify(posts, null, 2))
    return (
        <>
            <Head>
                <title>Posts | Ig.news</title>
            </Head>

            <main className={styles.container}>
                <div className={styles.posts}>
                    {
                        posts.map(post => (
                            <Link href={`/posts/${post.slug}`} key={post.slug}>
                                <a>
                                    <time>{post.updatedAt}</time>
                                    <strong>{post.title.map((item) => {
                                        return item.text
                                    })}</strong>
                                    <p>{post.summary.map((item) => {
                                        return item.text.substring(0, 20)
                                    })}</p>
                                </a>
                            </Link>
                        ))
                    }
                </div>
            </main>
        </>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const prismic = getPrismicCliente()

    const response = await prismic.getAllByType('publication', {
        fetch: ['publication.title', 'publication.content'],
        pageSize: 100
    })

    const posts: Post[] = []

    response.map(post => posts.push({
        slug: post.uid!,
        title: post.data.title,
        summary: post.data.content,
        updatedAt: new Date(post.last_publication_date).toLocaleDateString(
            'en-US',
            {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            }
        )
    }))

    return {
        props: {
            posts
        }
    }
}

export default Posts
