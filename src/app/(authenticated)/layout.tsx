import '../globals.css'
import { Inter } from 'next/font/google'
import Providers from '../provider'
import {redirect} from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default async function RootLayout({
  children, 
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect("/login")
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers session={session}>
          {children}
        </Providers>
      </body>
    </html>
  )
}