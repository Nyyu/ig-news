import type { AppProps } from 'next/app'
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'

import Header from "../components/Header"

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import '../styles/global.scss'

function MyApp({ Component, pageProps }: AppProps) {
  return <NextAuthSessionProvider session={pageProps.session}>
    <Header />
    <Component {...pageProps} />
    <ToastContainer />
  </NextAuthSessionProvider>
}

export default MyApp
