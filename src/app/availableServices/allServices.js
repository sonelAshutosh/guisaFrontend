'use client'

import React, { useEffect, useState } from 'react'
import API from '@/axios'
import { toast } from '@/hooks/use-toast'

function ServicesList() {
  const [services, setServices] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch all services from the API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await API.get('/services')
        setServices(res.data.services) // Assuming res.data is an array of services
      } catch (err) {
        setError(err.message)
        toast({
          title: 'Error',
          description: 'Failed to fetch services. Please try again.',
        })
      } finally {
        setLoading(false) // Stop loading state
      }
    }

    fetchServices()
  }, [])

  if (loading) return <p>Loading services...</p> // Loading state

  return (
    <div className="container mx-auto">
      {error && <p className="text-red-500">{error}</p>}

      {services.length === 0 ? (
        <p>No services available.</p>
      ) : (
        <ul className="px-4 space-y-4">
          {services.map((service) => (
            <li key={service.id} className="p-4 border rounded shadow">
              <h3 className="text-lg font-semibold">{service.name}</h3>
              <p className="text-sm text-gray-600">{service.description}</p>
              <p className="mt-2 font-medium">Type: {service.type}</p>
              <p className="font-medium">Price: ₹{service.price}</p>
              <p className="font-medium">Location: {service.location}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ServicesList
