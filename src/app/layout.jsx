import { getEvents } from '@/data'
import '@/styles/tailwind.css'
import { ClerkProvider, SignedIn, SignedOut, SignIn } from '@clerk/nextjs'

import { ApplicationLayout } from './application-layout'

export const metadata = {
  title: {
    template: '%s - Catalyst',
    default: 'Catalyst',
  },
  description: '',
}

export default async function RootLayout({ children }) {
  let events = await getEvents()

  return (
    <ClerkProvider
    appearance={{
      variables: {
        colorText: 'white',
        colorBackground: '#18181B',
        colorNeutral: 'white',
        colorInputText: 'white',
        colorInputBackground: '#18181B',
        colorPrimary: '#FF0080',
      },
    }}
    >
      <html
        lang="en"
        className="text-zinc-950 antialiased lg:bg-zinc-100 dark:bg-zinc-900 dark:text-white dark:lg:bg-zinc-950"
      >
        <head>
          <link rel="preconnect" href="https://rsms.me/" />
          <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        </head>
        <body>
          <main>
            <SignedOut>
              <div className="flex min-h-screen items-center justify-center">
                <SignIn routing="hash" />
              </div>
            </SignedOut>
            <SignedIn>
              <ApplicationLayout events={events}>{children}</ApplicationLayout>
            </SignedIn>
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}
