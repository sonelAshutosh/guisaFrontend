'use client'

import API from '@/axios'
import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import Requests from './Requests'

function BookingsPage() {
  const [bookings, setBookings] = useState([])
  const [services, setServices] = useState([])
  const [isProvider, setIsProvider] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userId = Cookies.get('userId')

    const fetchBookings = async () => {
      try {
        const res = await API.get(`/bookings/user/${userId}`)
        const { bookings } = res.data
        setBookings(bookings)
      } catch (err) {
        setError('Failed to fetch bookings. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    const fetchServices = async () => {
      try {
        const res = await API.get('/services')
        const { services } = res.data
        setServices(services)
      } catch (err) {
        setError('Failed to fetch services. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    const checkIsProvider = async () => {
      try {
        const res = await API.get(`/users/${userId}`)
        const { user } = res.data
        setIsProvider(user.isProvider)
      } catch (err) {
        setError('Failed to determine provider status. Please try again.')
      }
    }

    fetchBookings()
    fetchServices()
    checkIsProvider()
  }, [])

  const findServiceById = (serviceId) => {
    return services.find((service) => service._id === serviceId)
  }

  if (loading) return <p>Loading bookings...</p>
  if (error) return <p className="text-red-500">{error}</p>

  return (
    <div className="container px-4 py-8 mx-auto">
      {isProvider ? (
        <div>
          <h1 className="mb-4 text-2xl font-bold">Booking Requests</h1>
          <Requests />
        </div>
      ) : (
        <>
          {bookings.length === 0 ? (
            <p>No bookings available.</p>
          ) : (
            <>
              <h1 className="mb-4 text-2xl font-bold">Pending Requests</h1>
              <ul className="space-y-4">
                {bookings.map((booking) => {
                  const service = findServiceById(booking.service)
                  return (
                    <li key={booking._id} className="p-4 border rounded shadow">
                      <h3 className="text-lg font-semibold">
                        {service ? service.name : 'Service Name Not Available'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {service
                          ? service.description
                          : 'Description Not Available'}
                      </p>
                      <p className="mt-2 font-medium">
                        Booking Time:{' '}
                        {new Date(booking.bookingTime).toLocaleString()}
                      </p>
                      <p className="font-medium">
                        Price: ₹{service ? service.price : 'N/A'}
                      </p>
                      <p className="font-medium">
                        Location: {service ? service.location : 'N/A'}
                      </p>
                      <p className="font-medium">Status: {booking.status}</p>
                    </li>
                  )
                })}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default BookingsPage
