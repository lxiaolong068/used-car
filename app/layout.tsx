import './globals.css'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import Providers from './Providers'

// import { getServerSession } from 'next-auth'
// import { AuthProvider } from '@/providers/AuthProvider'
// import { authOptions } from '@/lib/auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '二手车管理系统',
  description: '一个现代化的二手车管理系统',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // const session = await getServerSession(authOptions)

  return (
    <html lang="zh">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
