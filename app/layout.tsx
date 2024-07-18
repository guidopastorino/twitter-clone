import { Metadata } from "next"
import App from "./_app"

export const metadata: Metadata = {
  title: "Twitter",
  description: "Twitter clone using NextJS, TailwindCSS, NextAuth, and more...!!"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body>
        <App>
          {children}
        </App>
      </body>
    </html>
  )
}
