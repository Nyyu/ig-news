import { useSession, signIn } from "next-auth/react"
import stripeJs from "../../services/stripe-js"
import { api } from "../../services/api"

import { toast } from "react-toastify"
import styles from "./styles.module.scss"
import { useRouter } from "next/router"

export default function SubscribeButton() {
  const { data: session } = useSession()
  const router = useRouter()

  const handleSubscribe = async () => {
    if (!session) {
      signIn("github")
      return
    }

    if (session.activeSubscription) {
      router.push("/posts")
      return
    }

    try {
      const response = await api.post("/subscribe")
      const stripe = await stripeJs()

      const { sessionId } = response.data
      if (!sessionId)
        throw new Error("Session ID undefined")

      await stripe?.redirectToCheckout({ sessionId })
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message, { theme: "dark" })
    }
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  )
}
