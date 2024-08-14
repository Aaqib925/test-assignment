'use client'
import '@/styles/tailwind.css'
import { ClerkProvider, SignedIn, SignedOut, SignIn, SignUp } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'

import { ApplicationLayout } from './application-layout'

export default function RootLayout({ children }) {
  const pathname = usePathname()

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
                {pathname === '/' && <SignIn routing="hash" signUpUrl="/sign-up" />}
                {pathname === '/sign-up' && <SignUp routing="hash" signInUrl="/" />}
              </div>
            </SignedOut>
            <SignedIn>
              <ApplicationLayout>{children}</ApplicationLayout>
            </SignedIn>
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}
