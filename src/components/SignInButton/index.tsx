import { useSession, signIn, signOut } from 'next-auth/react'

import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'

import styles from './styles.module.scss'

export default function SignInButton() {
    const { data: session } = useSession()

    return session ? (
        <button type="button" className={styles.signInButton} onClick={() => signOut()} >
            <FaGithub color="#04d361" />
            {session?.user?.name}
            <FiX className={styles.closeIcon} color="#737380" />
        </button>
    ) : (
        <button type="button" className={styles.signInButton} onClick={() => signIn('github')} >
            <FaGithub color="#eba410" />
            Sign in with Github
        </button>
    )
}
