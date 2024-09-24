import { useState } from 'react'
import Link from 'next/link'

export default function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <nav className="p-4 bg-gray-800">
      <div className="container flex items-center justify-between mx-auto">
        <div className="text-xl font-bold text-white">GUISA</div>

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
                d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
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
          <li>
            <Link href="/" className="block px-4 py-2 hover:bg-gray-700">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className="block px-4 py-2 hover:bg-gray-700">
              About
            </Link>
          </li>
          <li>
            <Link
              href="/services"
              className="block px-4 py-2 hover:bg-gray-700"
            >
              Services
            </Link>
          </li>
          <li>
            <Link href="/contact" className="block px-4 py-2 hover:bg-gray-700">
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
