'use client'

import React, { useState, useEffect } from 'react'
import API from '@/axios'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import Cookies from 'js-cookie'

function ServicesList() {
  const [userId, setUserId] = useState(null)
  const [services, setServices] = useState([])
  const [selectedService, setSelectedService] = useState(null)
  const [bookingTime, setBookingTime] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleBooking = (service) => {
    setSelectedService(service)
    setIsModalOpen(true)
  }

  const handleBookingSubmit = async () => {
    try {
      if (!bookingTime) {
        toast({
          title: 'Error',
          description: 'Please enter a booking time.',
        })
        return
      }

      const res = await API.post('/bookings', {
        user: userId,
        service: selectedService._id,
        bookingTime,
      })

      if (res.status !== 201) {
        toast({
          title: 'Error',
          description: 'Failed to create booking. Please try again.',
        })
      } else {
        toast({
          title: 'Success',
          description: 'Booking created successfully.',
        })
      }

      setIsModalOpen(false)
      setBookingTime('')
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to create booking. Please try again.',
      })
    }
  }

  useEffect(() => {
    setUserId(Cookies.get('userId'))

    const fetchServices = async () => {
      try {
        const res = await API.get('/services')
        const { services } = res.data
        setServices(services)
      } catch (err) {
        setError(err.message)
        toast({
          title: 'Error',
          description: 'Failed to fetch services. Please try again.',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  if (loading) return <p>Loading services...</p>

  return (
    <div className="container mx-auto">
      {error && <p className="text-red-500">{error}</p>}

      {services.length === 0 ? (
        <p>No services available.</p>
      ) : (
        <ul className="px-4 space-y-4">
          {services.map((service) => (
            <li
              key={service._id || service.name}
              className="p-4 border rounded shadow"
            >
              <h3 className="text-lg font-semibold">{service.name}</h3>
              <p className="text-sm text-gray-600">{service.description}</p>
              <p className="mt-2 font-medium">Type: {service.type}</p>
              <p className="font-medium">Price: ₹{service.price}</p>
              <p className="font-medium">Location: {service.location}</p>
              {service.providerId !== userId && (
                <Button className="mt-4" onClick={() => handleBooking(service)}>
                  Book Now
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Modal for booking details */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2 className="text-xl font-bold">Book {selectedService?.name}</h2>

          <div className="">
            <label htmlFor="bookingTime" className="block py-2 font-medium">
              Booking Time
            </label>
            <input
              type="datetime-local"
              id="bookingTime"
              value={bookingTime}
              onChange={(e) => setBookingTime(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter booking time (e.g., 14:00)"
            />
          </div>

          <Button className="mt-4" onClick={handleBookingSubmit}>
            Confirm Booking
          </Button>
        </Modal>
      )}
    </div>
  )
}

export default ServicesList
