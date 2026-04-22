'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import ApplyModal from './ApplyModal'

const COOKIE_KEY = 'gwewe_popup_shown'
const COOKIE_DAYS = 7

const EXCLUDED_PATHS = ['/checkout', '/order', '/admin', '/enter']

export default function NewsletterPopup() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (EXCLUDED_PATHS.some(p => pathname?.startsWith(p))) return

    const lastShown = localStorage.getItem(COOKIE_KEY)
    if (lastShown) {
      const daysSince = (Date.now() - parseInt(lastShown)) / (1000 * 60 * 60 * 24)
      if (daysSince < COOKIE_DAYS) return
    }

    let triggered = false

    function trigger() {
      if (triggered) return
      triggered = true
      setOpen(true)
      localStorage.setItem(COOKIE_KEY, Date.now().toString())
      clearTimeout(timer)
      document.removeEventListener('mouseleave', handleExitIntent)
      window.removeEventListener('scroll', handleScroll)
    }

    const timer = setTimeout(trigger, 25000)

    function handleExitIntent(e: MouseEvent) {
      if (e.clientY <= 0) trigger()
    }

    function handleScroll() {
      const scrolled = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight
      if (scrolled >= 0.6) trigger()
    }

    document.addEventListener('mouseleave', handleExitIntent)
    window.addEventListener('scroll', handleScroll)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mouseleave', handleExitIntent)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [pathname])

  return (
    <ApplyModal
      open={open}
      onClose={() => setOpen(false)}
      source="popup"
    />
  )
}
