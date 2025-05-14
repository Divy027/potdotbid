"use client"

import { useState, useEffect } from "react"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface CountdownTimerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  endTime: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  migrated: boolean
}

export function CountdownTimer({ endTime, migrated }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const difference = endTime - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [endTime])

  if (migrated) {
    return <div className="text-green-400">Selling window is open!</div>
  }

  return (
    <div className="flex justify-center items-center space-x-3">
      <div className="flex flex-col items-center">
        <div className="text-2xl font-bold text-green-400">{timeLeft.days}</div>
        <div className="text-xs text-gray-400">Days</div>
      </div>
      <div className="text-green-400 text-2xl">:</div>
      <div className="flex flex-col items-center">
        <div className="text-2xl font-bold text-green-400">{timeLeft.hours.toString().padStart(2, "0")}</div>
        <div className="text-xs text-gray-400">Hours</div>
      </div>
      <div className="text-green-400 text-2xl">:</div>
      <div className="flex flex-col items-center">
        <div className="text-2xl font-bold text-green-400">{timeLeft.minutes.toString().padStart(2, "0")}</div>
        <div className="text-xs text-gray-400">Minutes</div>
      </div>
      <div className="text-green-400 text-2xl">:</div>
      <div className="flex flex-col items-center">
        <div className="text-2xl font-bold text-green-400">{timeLeft.seconds.toString().padStart(2, "0")}</div>
        <div className="text-xs text-gray-400">Seconds</div>
      </div>
    </div>
  )
}
