import React, { useEffect } from 'react'
import Head from "next/head"
import { GetStaticProps } from "next"

import { asHTML, asText } from '@prismicio/helpers'
import { getPrismicCliente } from "../../../services/prismic"

import styles from '../post.module.scss'
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import Link from "next/link"

type Post = {
    slug: string
    title: string
    summary: string
    updatedAt: string
}

interface PreviewPostProps {
    post: Post
}

function PreviewPost({ post: { slug, summary, title, updatedAt } }: PreviewPostProps) {
    const { data: session } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (session?.activeSubscription) {
            router.push(`/posts/${slug}`)
        }
    }, [session, router, slug])


    return (
        <>
            <Head>
                <title>{`${title} | Ig.news`}</title>
            </Head>

            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{title}</h1>
                    <time>{updatedAt}</time>
                    <div dangerouslySetInnerHTML={{ __html: summary }} className={`${styles.postContent} ${styles.previewContent}`} />
                </article>

                <div className={styles.subscribeBtn}>
                    Wanna continue reading?
                    <Link href='/'>
                        <a>Subscribe now 🤗</a>
                    </Link>
                </div>
            </main>
        </>
    )
}

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { slug } = params!
    const prismic = getPrismicCliente()

    const response = await prismic.getByUID("publication", String(slug))

    const post: Post = {
        slug: String(slug),
        title: asText(response.data.title)!,
        summary: asHTML(response.data.content.splice(0, 2))!,
        updatedAt: new Date(response.last_publication_date).toLocaleString('en-US', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    }

    return {
        props: {
            post
        },
        revalidate: 60 * 30 // 0h30m
    }
}

export default PreviewPost