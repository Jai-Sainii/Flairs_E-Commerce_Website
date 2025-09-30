import React from 'react'

const Hero = () => {
  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gray-50">
      <div className="w-11/12 h-auto sm:h-[70vh] flex flex-col sm:flex-row overflow-hidden shadow-lg bg-white rounded-lg">

        <div className="w-full sm:w-1/2 flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-10 sm:py-0 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 leading-snug sm:leading-tight">
            Flaire is where trend meets timeless
          </h1>
          <p className="mt-4 text-gray-600 text-base sm:text-lg">
            Flaire is more than just fashion — it's a lifestyle. 
            We bring you the latest trends, timeless classics, 
            and statement pieces that let your style shine.
          </p>
        </div>

        <div className="w-full sm:w-1/2 relative h-64 sm:h-auto">
          <img
            src="https://media.istockphoto.com/id/1023612090/photo/interior-of-clothing-store.jpg?s=612x612&w=0&k=20&c=84NciWwU43Zyzmxph6bCVTG9WRO9rxDGUYtYnUqpTt8="
            alt="Hero Section"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  )
}

export default Hero
