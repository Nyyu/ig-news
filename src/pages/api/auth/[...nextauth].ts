import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

import { query as q } from "faunadb"
import { fauna } from "../../../services/fauna"

export default NextAuth({
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            const { email } = user

            // Filtering, just so TS can stop bothering me
            if (!email) throw new Error("Email undefined")

            try {
                await fauna.query(
                    q.If(
                        q.Not(
                            q.Exists(
                                q.Match(
                                    q.Index("user_by_email"),
                                    q.Casefold(email)
                                )
                            )
                        ),
                        q.Create(q.Collection("users"), { data: { email } }),
                        q.Get(
                            q.Match(q.Index("user_by_email"), q.Casefold(email))
                        )
                    )
                )

                return true
            } catch (error) {
                console.error(error)
                return false
            }
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
})
