'use client'

import API from '@/axios'
import { Button } from '@/components/ui/button'
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

  // Handle status change
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await API.post(`/bookings/${bookingId}/status`, { status: newStatus })

      // Optimistic update in UI
      setBookingsRequests((prevRequests) =>
        prevRequests.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: newStatus }
            : booking
        )
      )
    } catch (err) {
      setError('Failed to update booking status.')
    }
  }

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

              {/* Button to change status */}
              <div className="flex mt-4 space-x-2">
                {booking.status !== 'completed' && (
                  <Button
                    onClick={() => handleStatusChange(booking._id, 'completed')}
                    className="px-2 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                  >
                    Mark as Completed
                  </Button>
                )}
                {booking.status !== 'cancelled' ||
                  (booking.status !== 'completed' && (
                    <Button
                      onClick={() =>
                        handleStatusChange(booking._id, 'cancelled')
                      }
                      className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                    >
                      Cancel Booking
                    </Button>
                  ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Requests
