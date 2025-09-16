import { useState } from 'react'
import Login from './components/Login'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './components/Dashboard'

function App() {


  return (
    <>
     <div>
        <Routes>
          
         
             <Route path="/" element={<Login/>}></Route>
             <Route path="/dashboard" element={<Dashboard/>}></Route>
        </Routes>

      </div>
    </>
  )
}

export default App
