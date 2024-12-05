
// context/AppKit.tsx

'use client'
import { createAppKit } from '@reown/appkit/react'
import { Ethers5Adapter } from '@reown/appkit-adapter-ethers5'
import { mainnet, baseSepolia, base } from '@reown/appkit/networks'

// 1. Get projectId at https://cloud.reown.com
const projectId = process.env.NEXT_PUBLIC_APPKIT || ""

// 2. Create a metadata object
const metadata = {
  name: 'PotDotBid',
  description: 'AppKit Example',
  url: 'https://frontend-nine-xi-53.vercel.app', // origin must match your domain & subdomain
  icons: ['https://assets.reown.com/reown-profile-pic.png']
}

// 3. Create the AppKit instance
createAppKit({
  adapters: [new Ethers5Adapter()],
  metadata,
  networks: [baseSepolia],
  projectId,
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  }
})
interface AppKitProps {
    children: React.ReactNode;
  }

  export function AppKit({ children }: AppKitProps) {
    return <>{children}</>; // Render children
  }