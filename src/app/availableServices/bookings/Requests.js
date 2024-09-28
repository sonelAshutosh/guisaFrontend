'use client'

import API from '@/axios'
import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'

function Requests() {
  const [bookingsRequests, setBookingsRequests] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const providerId = Cookies.get('userId')

    const fetchBookings = async () => {
      try {
        const res = await API.get(`/bookings/provider/${providerId}`)
        const { bookings } = res.data

        setBookingsRequests(bookings)
      } catch (err) {
        setError('Failed to fetch booking requests. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  if (loading) return <p>Loading booking requests...</p>
  if (error) return <p className="text-red-500">{error}</p>

  return (
    <div className="container px-4 mx-auto">
      {bookingsRequests.length === 0 ? (
        <p>No booking requests available.</p>
      ) : (
        <ul className="space-y-4">
          {bookingsRequests.map((booking) => (
            <li key={booking._id} className="p-4 border rounded shadow">
              <h3 className="text-lg font-semibold">{booking.service.name}</h3>
              <p className="text-sm text-gray-600">
                {booking.service.description}
              </p>
              <p className="mt-2 font-medium">
                Requested at: {new Date(booking.bookingTime).toLocaleString()}
              </p>
              <p className="font-medium">Price: ₹{booking.service.price}</p>
              <p className="font-medium">
                Location: {booking.service.location}
              </p>
              <p className="font-medium">Status: {booking.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Requests
