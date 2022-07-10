import { query as q } from "faunadb"
import { fauna } from "../../../services/fauna"
import { stripe } from "../../../services/stripe"

export async function saveSubscription(
    subscriptionId: string,
    customerId: string,
    createAction = false
) {
    try {
        const userRef = await fauna.query(
            q.Select(
                "ref",
                q.Get(q.Match(q.Index("user_by_stripe_id"), customerId))
            )
        )

        const stripeSubscription = await stripe.subscriptions.retrieve(
            subscriptionId
        )

        const subscriptionData = {
            id: stripeSubscription.id,
            userId: userRef,
            status: stripeSubscription.status,
            priceId: stripeSubscription.items.data[0].price.id,
        }

        if (createAction) {
            await fauna.query(
                q.Create(q.Collection("subscriptions"), {
                    data: subscriptionData,
                })
            )
        } else {
            await fauna.query(
                q.Replace(
                    q.Select(
                        "ref",
                        q.Get(
                            q.Match(
                                q.Index("subscription_by_id"),
                                subscriptionId
                            )
                        )
                    ),
                    {
                        data: subscriptionData,
                    }
                )
            )
        }
    } catch (error: any) {
        console.log(error, error.message)
    }
}
