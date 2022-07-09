import { NextApiRequest, NextApiResponse } from "next"

// Serverless on Next

// eslint-disable-next-line
export default (req: NextApiRequest, res: NextApiResponse) => {
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
