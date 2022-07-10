import { loadStripe } from "@stripe/stripe-js"

//eslint-disable-next-line
export default async () =>
    await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_API_KEY!)
