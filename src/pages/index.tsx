import { GetServerSideProps } from "next"
import Head from "next/head"

import SubscribeButton from '../components/SubscribeButton'

import { stripe } from "../services/stripe"

import styles from './home.module.scss'

export interface HomeProps {
  product: {
    priceId: string
    productPrice: number
  }
}

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

export const getServerSideProps: GetServerSideProps = async () => {
  const price = await stripe.prices.retrieve('price_1LIFkbBZc4FZ4AorCGRiWV1D', {
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
    }
  }
}
