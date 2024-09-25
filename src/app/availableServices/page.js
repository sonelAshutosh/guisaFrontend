'use client'

import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import API from '@/axios'
import { toast } from '@/hooks/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import ServicesList from './allServices'

const cities = [
  'Jaipur',
  'Jodhpur',
  'Udaipur',
  'Ajmer',
  'Kota',
  'Bikaner',
  'Alwar',
  'Bhilwara',
  'Sikar',
  'Pali',
  'Bundi',
  'Chittorgarh',
  'Jaisalmer',
  'Tonk',
  'Barmer',
  'Nagaur',
  'Sawai Madhopur',
  'Banswara',
  'Sri Ganganagar',
  'Churu',
]

function AvailableServicesPage() {
  const [user, setUser] = useState({ isProvider: false })
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    price: '',
    location: '',
    providerId: '', // Added field for providerId
  })
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)

  // Fetch the user data to determine if they're a provider
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
        setFormData((prev) => ({ ...prev, providerId: userId })) // Set providerId in formData
      } catch (err) {
        setError(err.message)
      }
    }

    fetchUser()
  }, [])

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // Handle form submission to add a new service
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form fields
    if (
      !formData.name ||
      !formData.description ||
      !formData.type ||
      !formData.price ||
      !formData.location ||
      !formData.providerId // Ensure providerId is included
    ) {
      toast({
        title: 'Error',
        description: 'All fields are required.',
      })
      return
    }

    // Ensure price is a valid number
    if (isNaN(formData.price) || Number(formData.price) <= 0) {
      toast({
        title: 'Error',
        description: 'Price must be a positive number.',
      })
      return
    }

    try {
      const res = await API.post('/services', formData)
      if (res.status === 201) {
        toast({
          title: 'Success',
          description: 'Service created successfully!',
        })

        // Reset form after submission
        setFormData({
          name: '',
          description: '',
          type: '',
          price: '',
          location: '',
          providerId: '', // Reset providerId
        })

        setShowForm(false) // Close the form
      } else {
        toast({
          title: 'Error',
          description: 'Something went wrong.',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create the service. Please try again.',
      })
    }
  }

  return (
    <div className="container mx-auto">
      {error && <p className="text-red-500">{error}</p>}

      {/* If the user is a provider, show the Add Service button */}
      {user.isProvider && (
        <div className="mb-4">
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full p-2 text-white bg-blue-500 hover:bg-blue-600"
          >
            {showForm ? 'Close Form' : 'Add Service'}
          </button>
        </div>
      )}
      <h1 className="px-4 my-2 text-2xl font-bold">Available Services</h1>

      {/* Show the form if Add Service button is clicked */}
      {showForm && (
        <form onSubmit={handleSubmit} className="px-4 space-y-4">
          <div>
            <label className="block text-sm font-medium">Service Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Type</label>
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Location</label>
            <Select
              onValueChange={(value) => {
                setFormData({ ...formData, location: value }) // Set the selected city in state
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city, index) => (
                  <SelectItem key={index} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <button
            type="submit"
            className="w-full p-2 text-white bg-green-500 rounded hover:bg-green-600"
          >
            Submit Service
          </button>
        </form>
      )}

      {/* Display the list of available services (you'll need to fetch and display them) */}
      <div className="">
        {/* Here you would map over the available services and display them */}
        <ServicesList />
      </div>
    </div>
  )
}

export default AvailableServicesPage
