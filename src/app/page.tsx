import Providers from "./provider"
import Web3ButtonClient from "@/components/Web3Button"

export default function Home() {
  return (
    <main className="">
      <Providers>
        <div>hi</div>

        <Web3ButtonClient />
      </Providers>
    </main>
  )
}
