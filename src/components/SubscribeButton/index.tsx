import { useSession, signIn } from "next-auth/react"
import styles from './styles.module.scss'

interface SubscribeButtonProps {
    priceId: string
}

export default function SubscribeButton({ priceId }: SubscribeButtonProps) {
    const { data: session } = useSession()

    const handleSubscribe = async () => {
        if (!session) {
            signIn('github')
            return
        }


    }

    return (
        <button
            type="button"
            className={styles.subscribeButton}
            onClick={handleSubscribe}
        >Subscribe now</button>
    )
}
