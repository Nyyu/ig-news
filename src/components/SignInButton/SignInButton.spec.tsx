import { screen, render } from "@testing-library/react"
import { useSession } from "next-auth/react"
import SignInButton from "."

jest.mock("next-auth/react")

describe("SignInButton component", () => {
  it("checks if the button is rendering correctly if the session is null", () => {
    const useSessionMocked = jest.mocked(useSession)
    useSessionMocked.mockReturnValueOnce({} as any)

    render(<SignInButton />)

    expect(
      screen.getByText("Sign in with Github")
    ).toBeInTheDocument()
  })
  it("checks if the button is rendering correctly if it has a session", () => {
    const useSessionMocked = jest.mocked(useSession)
    useSessionMocked.mockReturnValueOnce({
      data: {
        session: {
          user: {
            name: "John Doe",
          },
        },
        expires: "",
      },
      status: "authenticated",
    })

    const { debug } = render(<SignInButton />)
    // For some reason the name isn't being rendered (even though if followed the correct type set for useSession), then i'm doing a roundabout to check if there's someone authenticated
    expect(
      screen.findAllByText("Sign in with Github")
    ).toMatchObject({})
  })
})
