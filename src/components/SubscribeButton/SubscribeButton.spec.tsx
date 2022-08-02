import {
  screen,
  render,
  fireEvent,
} from "@testing-library/react"
import { useSession, signIn } from "next-auth/react"
import SubscribeButton from "."

jest.mock("next-auth/react")

describe("SubscribeButton component", () => {
  it("renders correctly", () => {
    const useSessionMocked = jest.mocked(useSession)
    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: "unauthenticated",
    })

    const { container } = render(<SubscribeButton />)

    expect(container).toBeInTheDocument()
  })

  it("redirects user if he's unauthenticated", () => {
    const useSessionMocked = jest.mocked(useSession)
    const signInMocked = jest.mocked(signIn)

    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: "unauthenticated",
    })

    render(<SubscribeButton />)
    const subscribeButton =
      screen.getByText("Subscribe now")
    fireEvent.click(subscribeButton)

    expect(signInMocked).toHaveBeenCalled()
  })
})
