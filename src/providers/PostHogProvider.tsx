"use client"

import posthog from "posthog-js"
import { PostHogProvider as PHProvider } from "posthog-js/react"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: "/ingest",
      ui_host: "https://us.posthog.com",
      defaults: '2025-05-24',
      capture_exceptions: true, // Enable capturing exceptions via Error Tracking
      debug: process.env.NODE_ENV === "development",
    })
  }, [])

  useEffect(() => {
    posthog.set_config({
      disable_surveys_automatic_display:
        pathname === "/arcadeclawv1" || pathname.startsWith("/arcadeclawv1/"),
    })
  }, [pathname])

  return (
    <PHProvider client={posthog}>
      {children}
    </PHProvider>
  )
}
