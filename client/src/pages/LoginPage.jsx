import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'

const LoginPage = () => {


  const [currState, setCurrState] = useState('Sign up')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [bio, setBio] = useState('')

  const [isDataSubmitted, setIsDataSubmitted] = useState(false)

  const { login, authUser } = useContext(AuthContext)


  const onSubmitHandler = (event) => {
    event.preventDefault()

    if (currState === 'Sign up' && !isDataSubmitted) {
      setIsDataSubmitted(true)
      return
    }

    login(currState === 'Sign up' ? 'signup' : 'login', {
      fullName,
      email,
      password,
      bio
    })
  }

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl '>
      <img src={assets.logo_big} alt="" className='w-[min(300vw,250px)]' />
      <div className='text-white'>
        {authUser ? (
          <div>User Found</div>
        ) :
          <div className='text-2xl font-semibold'>Welcome to the Login Page</div>
        }
      </div>
      <form onSubmit={onSubmitHandler} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>
        <h2 className='font-medium text-2xl flex justify-between items-center'>
          {currState}
          {
            isDataSubmitted && <img onClick={() => setIsDataSubmitted(false)} src={assets.arrow_icon} alt="" className='w-5 cursor-pointer' />
          }
        </h2>
        {
          currState === 'Sign up' && !isDataSubmitted && (
            <input
              onChange={(e) => setFullName(e.target.value)} value={fullName}
              type="text" className='p-2 border border-gray-500 rounded-md focus:outline-none' placeholder='Full Name' required />
          )
        }

        {
          !isDataSubmitted && (
            <>
              <input
                onChange={(e) => setEmail(e.target.value)} value={email}
                type="email" className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500' placeholder='Enter Email' required />
              <input
                onChange={(e) => setPassword(e.target.value)} value={password}
                type="password" className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500' placeholder='Password' required />
            </>
          )
        }
        {
          currState === 'Sign up' && isDataSubmitted && (
            <textarea
              onChange={(e) => setBio(e.target.value)} value={bio}
              placeholder='provide a short bio' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500'></textarea>
          )
        }

        <button type='submit' className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'>
          {
            currState === 'Sign up' ? 'Create Account' : 'Login Now'
          }
        </button>

        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <input type="checkbox" className='cursor-pointer' />
          <p>Agree to the terms of use & privecy policy</p>
        </div>

        <div className='flex flex-col gap-2'>
          {
            currState === 'Sign up' ? (
              <p className='text-sm text-gray-500'>
                Already have an account? <span
                  onClick={() => { setCurrState('Login'); setIsDataSubmitted(false) }}
                  className='font-medium text-violet-500 cursor-pointer'>Login Here</span>
              </p>
            ) : (
              <p className='text-sm text-gray-500'>
                Create an account <span
                  onClick={() => setCurrState('Sign up')}
                  className='font-medium text-violet-500 cursor-pointer'>Click Here</span>
              </p>
            )
          }
        </div>

      </form >
    </div >
  )
}

export default LoginPage