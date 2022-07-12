import * as Prismic from "@prismicio/client"

export function getPrismicCliente(req?: unknown) {
    const prismic = Prismic.createClient(process.env.PRISMIC_ENDPOINT!, {
        accessToken: process.env.PRISMIC_ACCESS_TOKEN!,
    })

    if (req) prismic.enableAutoPreviewsFromReq(req)

    return prismic
}
