import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Card from './components/boxes.jsx/boxes'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    
    <h1 className="text-3xl font-bold px-3 py-3"> View Attendance Report</h1>
      <h4 className='px-5 py-0'>Admin can check attendance report of all users</h4>
      <btn className=' bg-yellow-500 border-0 py-2 px-3 mt-4'>SHOW AND GO</btn>
     
      <h3 className=' text-3xl font-bold py-4 px-7'>Search By</h3>


      <div className=' flex space-x-4 px-7 '>
      <btn className='bg-sky-500 text-white py-2 px-3 rounded-lg'>By Employee</btn>
      <btn className='bg-sky-500 text-white py-2 px-3 rounded-lg'>By Date</btn>
      </div>

      <div>
        <h1 className='text-4xl font-bold py-7 px-7'>Today's Statistics</h1>
      </div>

      <div className='box-content h-28 w-96 p-10 border-4 bg-green-500'></div>
      <div className='box-content h-28 w-96 p-10 border-4 bg-red-500 '></div>

      <h4 className="text-4xl font-bold px-4 py-7 ">Last Week</h4>
      <Card/>
      <h6 className='text-center'>Number of employees present each day</h6>

      <h4 className="text-4xl font-bold px-4 py-7 ">This Week</h4>
      <Card/>
      <h6 className='text-center'>Number of employees present each day</h6>

      </>
  )
}

export default App
