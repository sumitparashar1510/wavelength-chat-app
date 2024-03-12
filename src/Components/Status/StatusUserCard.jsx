import React from 'react'
import { useNavigate } from 'react-router-dom'

const StatusUserCard = () => {

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/status/{userId}`)
  }

  return (
    <div onClick={handleNavigate} className='flex items-center p-3 cursor-pointer'>
        <div>
            <img className='h-7 w-7 lg:h-10 lg:w-10 rounded-full object-cover' src="https://cdn.pixabay.com/photo/2019/04/06/06/44/astronaut-4106766_1280.jpg" alt="" />
        </div>
        <div className='ml-2 text-white'>
            <p>username</p>
        </div>
    </div>
  )
}

export default StatusUserCard