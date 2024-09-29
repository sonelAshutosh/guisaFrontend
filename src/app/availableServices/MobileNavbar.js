'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import API from '@/axios'
import { toast } from '@/hooks/use-toast'

export default function MobileNavbar() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState({ username: '', isProvider: false })
  const [error, setError] = useState(null)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    const fetchUser = async () => {
      const userId = Cookies.get('userId')

      if (!userId) {
        setError('User ID not found in cookies')
        return
      }

      try {
        const res = await API.get(`/users/${userId}`)
        const { user } = res.data

        setUser(user)
      } catch (err) {
        setError(err.message)
      }
    }

    fetchUser()
  }, [])

  const handleLogout = () => {
    document.cookie = `userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    document.cookie = `accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`

    router.push('/login')
  }

  const handleBecomeProvider = async () => {
    const confirmation = prompt(
      'Are you sure you want to become a provider? (yes/no)'
    )

    if (confirmation === 'yes') {
      const res = await API.post('/users/becomeProvider', {
        userId: Cookies.get('userId'),
      })

      if (res.status === 200) {
        toast({
          title: 'Success',
          description: 'You are now a provider',
        })
        setUser({ ...user, isProvider: true })
      } else {
        toast({
          title: 'Error',
          description: 'Something went wrong',
        })
      }
    }
  }

  return (
    <nav className="p-4 bg-gray-800">
      <div className="container flex items-center justify-between mx-auto">
        <div className="text-xl font-bold text-white">GUISA</div>

        <div className="flex items-center space-x-4">
          <div className="text-white">
            {user.name ? `Hello, ${user.name}` : '...'}
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="text-gray-200 hover:text-white focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:hidden`}
      >
        <div className="p-4">
          <button
            onClick={toggleMenu}
            className="text-gray-400 hover:text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <ul className="flex flex-col p-4 space-y-4">
          <li className="px-4 py-2 bg-gray-800 rounded-lg">
            Location - {user.address}
          </li>
          <li>
            <Link
              href="/availableServices"
              className="block px-4 py-2 hover:bg-gray-700"
            >
              Available Services{' '}
            </Link>
          </li>
          <li>
            <Link
              href="/availableServices/bookings"
              className="block px-4 py-2 hover:bg-gray-700"
            >
              Bookings{' '}
            </Link>
          </li>

          {!user.isProvider && (
            <li>
              <div
                onClick={handleBecomeProvider}
                className="block px-4 py-2 cursor-pointer hover:bg-gray-700"
              >
                Become a Provider
              </div>
            </li>
          )}
          <li>
            <div
              onClick={handleLogout}
              className="block px-4 py-2 cursor-pointer hover:bg-gray-700"
            >
              Logout
            </div>
          </li>
        </ul>
      </div>
    </nav>
  )
}
