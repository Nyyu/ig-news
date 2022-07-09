import { Client } from "faunadb"

export const fauna = new Client({
    scheme: "https",
    domain: "db.fauna.com",
    secret: process.env.FAUNADB_KEY!,
})
