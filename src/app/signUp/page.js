'use client'

import API from '@/axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

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

export default function LoginPage() {
  const { toast } = useToast()
  const { push } = useRouter()
  const [city, setCity] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    const name = formData.get('name')
    const email = formData.get('email')
    const password = formData.get('password')
    const phoneNumber = formData.get('phoneNumber')
    const address = city

    try {
      const res = await API.post('/users', {
        name,
        email,
        password,
        phoneNumber,
        address,
      })

      if (res.status === 201) {
        toast({
          title: 'User Created Successfully',
        })

        push('/login')
      }
    } catch (error) {
      console.log(error)
      toast({
        title: 'Login Failed',
        description: 'Invalid Credentials',
      })
    }
  }

  return (
    <div className="h-[100vh] w-full flex flex-col justify-center items-center dark:text-primary-base">
      <div className="border-2 border-primary-base/10 p-8 rounded-lg">
        <div className="flex justify-center py-4">
          <h1>Sign Up</h1>
        </div>
        <div className="">
          <form onSubmit={handleLogin} className="">
            <Input
              type="text"
              name="name"
              placeholder="Name"
              required
              className="my-2"
            />
            <Input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="my-2"
            />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="my-2"
            />
            <Input
              type="tel"
              name="phoneNumber"
              placeholder="Mobile Number"
              required
              className="my-2"
            />
            <Select
              onValueChange={(value) => {
                setCity(value) // Correctly sets the selected city in state
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

            <Button type="submit" className="my-2">
              Register
            </Button>
            <div>
              Already have an account?{' '}
              <Link className="text-blue-600" href="/login">
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
