import Head from "next/head"

// Components
import SubscribeButton from '../components/SubscribeButton'

// Services
import { stripe } from "../services/stripe"

// Styles
import styles from './home.module.scss'

// Interfaces
import { GetStaticProps } from "next"
export interface HomeProps {
  product: {
    priceId: string
    productPrice: number
  }
}

/* 
 3 ways to render a website using NextJS

 - CSR -> Client-side Render (SPA Way)
 - SSR -> Server-side Render (Using the async getServerSideProps)
 - SSG -> Static-site generation (Using the async getStaticProps and setting the revalidate)
*/

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>ig.news</title>
      </Head>
      <main className={styles.contentContainer} >
        <section className={styles.hero}>
          <span>
            👏 Hey, welcome
          </span>
          <h1>News about the <span>React</span> world.</h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.productPrice} per month</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>

        <img src="/images/avatar.svg" alt="Girly girl coding" />
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve(process.env.STRIPE_ITEM_ID!, {
    expand: ['product']
  })

  const product = {
    priceId: price.id,
    productPrice: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format((price.unit_amount! / 100))
  }

  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24 // 24 hours
  }
}
