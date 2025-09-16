import { useState } from 'react'
import Login from './components/Login'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import AdiminDashboard from './components/AdiminDashboard'
import TaskDetails from './components/TaskDetails'

function App() {


  return (
    <>
     <div>
        <Routes>
                
             <Route path="/" element={<Login/>}></Route>
             <Route path="/dashboard" element={<Dashboard/>}></Route>
             <Route path="/admindashboard" element={<AdiminDashboard/>}></Route>
             <Route path="/taskdetails/:id" element={<TaskDetails/>}></Route>
        </Routes>

      </div>
    </>
  )
}

export default App
