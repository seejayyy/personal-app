import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    // Immediately move the user to /dashboard
    throw redirect({
      to: '/dashboard',
    })
  },
})