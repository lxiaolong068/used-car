'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // 重定向到登录页面
    router.push('/login')
  }, [router])

  return null // 或者返回一个加载指示器
}
