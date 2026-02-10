import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Dashboard } from '@/components/Dashboard'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Agent Dashboard - 实时工作进度',
  description: '实时查看 AI Agent 工作状态和进度',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <Dashboard />
      </body>
    </html>
  )
}
