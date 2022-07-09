import { NextApiRequest, NextApiResponse } from "next"

// Serverless on Next

// eslint-disable-next-line
export default (req: NextApiRequest, res: NextApiResponse) => {
    // To obtain the ID param you can use -> req.query

    // And to fetch a bunch of params after the API route you can create a file named [...params].ts and use the same command to read those params, it returns a array with all the params used.

    const users = [
        {
            id: 1,
            name: "jaum",
        },
        {
            id: 2,
            name: "pe",
        },
        {
            id: 3,
            name: "a",
        },
    ]

    res.statusCode = 200
    return res.json(users)
}
