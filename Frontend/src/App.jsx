import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './Pages/SignUp'
import Home from './Pages/Home'
import SignIn from './Pages/SignIn';

export default function App() {
  return (
    <BrowserRouter>
   
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/sign-up" element={<SignUp/>}/>
        <Route path="/sign-in" element={<SignIn/>}/>
      </Routes>

    </BrowserRouter>
  )
}
