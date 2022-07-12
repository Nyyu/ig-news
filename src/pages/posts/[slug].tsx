import React from 'react'
import Head from "next/head"
import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"

import { asHTML, asText } from '@prismicio/helpers'
import { getPrismicCliente } from "../../services/prismic"

import styles from './post.module.scss'

type Post = {
    slug: string
    title: string
    summary: string
    updatedAt: string
}

interface PostProps {
    post: Post
}

function Post({ post: { slug, summary, title, updatedAt } }: PostProps) {
    return (
        <>
            <Head>
                <title>{`${title} | Ig.news`}</title>
            </Head>

            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{title}</h1>
                    <time>{updatedAt}</time>
                    <div dangerouslySetInnerHTML={{ __html: summary }} className={styles.postContent} />
                </article>
            </main>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
    const { slug } = params!
    const prismic = getPrismicCliente(req)
    const session = await getSession({ req })

    if (!session?.activeSubscription) {
        return {
            redirect: {
                destination: `/posts/preview/${slug}`,
                permanent: false
            }
        }
    }

    const response = await prismic.getByUID("publication", String(slug))

    console.log(response)

    const post: Post = {
        slug: String(slug),
        title: asText(response.data.title)!,
        summary: asHTML(response.data.content)!,
        updatedAt: new Date(response.last_publication_date).toLocaleString('en-US', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    }

    return {
        props: {
            post
        }
    }
}

export default Post