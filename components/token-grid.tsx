"use client"

import { TokenCard } from "@/components/token-card"
import { motion } from "framer-motion"


interface TokenGridProps {
  title: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tokens: any[]
  emptyMessage: string
  type: "bidding" | "completed"
}


export function TokenGrid({ title, tokens, emptyMessage, type }: TokenGridProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }


  // const handleImageUploadurl = async (file: any) => {
  //   const formData = new FormData();
  //   formData.append("file", file);
  
  //   try {
  //     const response = await axios.post("https://freeimage.host/api/1/upload", formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       }
  //     });
  
  //     if (response.data.success) {
  //       // The URL for the uploaded image
  //       const imageUrl = response.data.url;
  //       console.log('Image URL:', imageUrl);
  //       return imageUrl;
  
  //       // Now you can use the image URL for your backend or anywhere in your app
  //       // Example: send it to your backend with other form data
  //     }
  //   } catch (error) {
  //     console.error('Error uploading image:', error);
  //   }
  // };



  return (
    <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-green-400">{title}</h2>
      <span className="bg-green-900/50 text-green-400 text-xs px-2 py-1 rounded-full">{tokens.length} tokens</span>
    </div>

    {tokens.length > 0 ? (
      <motion.div className="grid gap-4 sm:grid-cols-2" variants={container} initial="hidden" animate="show">
        {tokens.map((token, index) => (
          <TokenCard key={index} token={token} type={type} index={index} />
        ))}
      </motion.div>
    ) : (
      <div className="bg-green-900/20 border border-green-800/50 rounded-lg p-8 text-center">
        <p className="text-green-400/70">{emptyMessage}</p>
      </div>
    )}
  </div>
  )
}
