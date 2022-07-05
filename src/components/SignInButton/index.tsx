import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'

import styles from './styles.module.scss'

export default function SignInButton() {
    const isUserLogged = false

    return isUserLogged ? (
        <button type="button" className={styles.signInButton} >
            <FaGithub color="#04d361" />
            NyuuSz
            <FiX className={styles.closeIcon} color="#737380" />
        </button>
    ) : (
        <button type="button" className={styles.signInButton} >
            <FaGithub color="#eba410" />
            Sign in with Github
        </button>
    )
}
