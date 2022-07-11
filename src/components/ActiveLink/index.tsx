import Link, { LinkProps } from "next/link"
import { useRouter } from "next/router"
import React, { cloneElement, ReactElement } from 'react'

interface ActiveLinkProps extends LinkProps {
    activeClassName: string,
    children: ReactElement
}

function ActiveLink({ children, activeClassName, ...props }: ActiveLinkProps) {
    const { asPath } = useRouter()

    const className = asPath === props.href ? activeClassName : ''

    return (
        <Link {...props}>
            {cloneElement(children, {
                className
            })}
        </Link>
    )
}

export default ActiveLink