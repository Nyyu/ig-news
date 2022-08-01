import { render, screen } from "@testing-library/react"
import Header from "."

jest.mock("next/router", () => ({
  useRouter() {
    // useRouter: () => {} <- same thing
    return {
      asPath: "/",
    }
  },
}))

jest.mock("next-auth/react", () => ({
  useSession: () => {
    return [null, false]
  },
}))

// test("renders all the components in the DOM", () => {
//   // const { getByText } = render(<Header />)
//   render(<Header />)

//   expect(screen.getByText("Home")).toBeInTheDocument()
//   expect(screen.getByText("Posts")).toBeInTheDocument()
// })

describe("Header component", () => {
  it("renders all the components in the DOM", () => {
    render(<Header />)

    expect(screen.getByText("Home")).toBeInTheDocument()
    expect(screen.getByText("Posts")).toBeInTheDocument()
  })
})
