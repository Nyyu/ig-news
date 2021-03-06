import ActiveLink from "../ActiveLink"
import SignInButton from "../SignInButton"

import styles from "./styles.module.scss"

export default function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="ig.news" />
        <nav>
          <ActiveLink
            href="/"
            activeClassName={styles.active}
          >
            <a>Home</a>
          </ActiveLink>
          <ActiveLink
            href="/posts"
            /*prefetch <- to ... the page*/ activeClassName={
              styles.active
            }
          >
            <a>Posts</a>
          </ActiveLink>
        </nav>
        <SignInButton />
      </div>
    </header>
  )
}
