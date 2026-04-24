import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@lotto/db', '@lotto/engine', '@lotto/ai'],
}

export default nextConfig
