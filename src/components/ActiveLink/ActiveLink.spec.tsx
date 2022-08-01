import { render } from "@testing-library/react"
import ActiveLink from "."

jest.mock("next/router", () => {
  return {
    useRouter: () => ({
      asPath: "/",
    }),
  }
})

describe("ActiveLink component", () => {
  /**
   * you can use either "test()" or "it()" inside the describe()
   */

  // test("Renders an ActiveLink component", () => {
  //   const { getByText } = render(
  //     <ActiveLink activeClassName="active" href="/">
  //       <a>Home</a>
  //     </ActiveLink>
  //   )

  //   expect(getByText("Home")).toBeInTheDocument()
  // })

  it("Renders the component", () => {
    const { getByText } = render(
      <ActiveLink activeClassName="active" href="/">
        <a>Home</a>
      </ActiveLink>
    )

    expect(getByText("Home")).toBeInTheDocument()
  })

  it("receives 'active' class as an inline style", () => {
    const { getByText } = render(
      <ActiveLink activeClassName="active" href="/">
        <a>Home</a>
      </ActiveLink>
    )

    expect(getByText("Home")).toHaveClass("active")
  })

  it("isn't receiving 'active' class as an inline style if path differs from the component's link", () => {
    const { getByText } = render(
      <ActiveLink activeClassName="active" href="/contact">
        <a>Contact</a>
      </ActiveLink>
    )

    expect(
      getByText("Contact").classList.contains("active")
    ).toBe(false)
  })
})
