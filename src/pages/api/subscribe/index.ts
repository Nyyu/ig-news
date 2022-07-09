import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import { stripe } from "../../../services/stripe"

// eslint-disable-next-line
export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
        const session = await getSession({ req })

        if (!session?.user?.email)
            return res.status(401).json({ response: "Not logged in" })

        const stripeCustomer = await stripe.customers.create({
            email: session.user.email,
            // metadata
        })

        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            customer: stripeCustomer.id,
            payment_method_types: ["card"],
            billing_address_collection: "required",
            line_items: [
                {
                    price: process.env.STRIPE_ITEM_ID!,
                    quantity: 1,
                },
            ],
            mode: "subscription",
            allow_promotion_codes: true,
            cancel_url: process.env.STRIPE_CANCEL_URL!,
            success_url: process.env.STRIPE_SUCCESS_URL!,
        })

        return res.status(200).json({ sessionId: stripeCheckoutSession.id })
    } else {
        return res
            .setHeader("allow", "POST")
            .status(405)
            .end("Method not allowed")
    }
}
