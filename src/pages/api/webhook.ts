import { NextApiRequest, NextApiResponse } from "next"
import { Readable } from "stream"
import Stripe from "stripe"
import { stripe } from "../../services/stripe"
import { saveSubscription } from "./_lib/manageSubscription"

export const config = {
    api: {
        bodyParser: false,
    },
}

async function buffer(readable: Readable) {
    const chunks = []

    for await (const chunk of readable)
        chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk)

    return Buffer.concat(chunks)
}

const relavantEvents = new Set([
    "checkout.session.completed",
    "customer.subscription.updated",
    "customer.subscription.deleted",
])

//eslint-disable-next-line
export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
        const myBuffer = await buffer(req)
        const secret = req.headers["stripe-signature"]
        let event: Stripe.Event

        try {
            event = stripe.webhooks.constructEvent(
                myBuffer,
                secret!,
                process.env.STRIPE_WEBHOOK_SECRET!
            )
        } catch (error: { message: string } | any) {
            console.log(error)
            return res.status(400).send(`Webhook error: ${error?.message}`)
        }

        const { type } = event

        if (relavantEvents.has(type)) {
            try {
                switch (type) {
                    case "customer.subscription.updated":
                    case "customer.subscription.deleted":
                        const subscriptionSession = event.data
                            .object as Stripe.Subscription

                        await saveSubscription(
                            subscriptionSession.id,
                            subscriptionSession.customer!.toString(),
                            false
                        )

                        break
                    case "checkout.session.completed":
                        const checkoutSession = event.data
                            .object as Stripe.Checkout.Session

                        await saveSubscription(
                            checkoutSession.subscription!.toString(),
                            checkoutSession.customer!.toString(),
                            true
                        )

                        break

                    default:
                        throw new Error("Unhandled event")
                }
            } catch (error: { message: string } | any) {
                // Not seding a error status, otherwise stripe's going to resend the hook over and over
                return res.json({
                    Error: "A error occurred while handling the webhooks",
                    ErrorMessage: error.message,
                })
            }
        }

        return res.status(200).json({ received: true })
    } else {
        res.setHeader("Allow", "POST")
        res.status(405).end("Method not allowed")
    }
}
