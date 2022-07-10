import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"

import { stripe } from "../../../services/stripe"
import { fauna } from "../../../services/fauna"
import { query as q } from "faunadb"

interface User {
    data: {
        stripeId: string
    }
    ref: {
        id: string
    }
}

// eslint-disable-next-line
export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
        const session = await getSession({ req })

        if (!session?.user?.email)
            return res.status(401).json({ response: "Not logged in" })

        const user = await fauna.query<User>(
            q.Get(
                q.Match(
                    q.Index("user_by_email"),
                    q.Casefold(session.user.email)
                )
            )
        )

        let userStripeId = user.data.stripeId

        if (!userStripeId) {
            const stripeCustomer = await stripe.customers.create({
                email: session.user.email,
                // metadata
            })

            await fauna.query(
                q.Update(
                    q.Ref(q.Collection("users"), q.Casefold(user.ref.id)),
                    {
                        data: {
                            stripeId: stripeCustomer.id,
                        },
                    }
                )
            )

            userStripeId = stripeCustomer.id
        }

        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            customer: userStripeId,
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

        const { id } = stripeCheckoutSession

        return res.status(200).json({ sessionId: id })
    } else {
        return res
            .setHeader("allow", "POST")
            .status(405)
            .end("Method not allowed")
    }
}
