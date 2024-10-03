import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './Pages/SignUp'
import SignIn from './Pages/SignIn';
import PrivateRoute from './Components/PrivateRoute';
import DashBoard from './Pages/DashBoard';
import CreateCrowdRecord from './Pages/CreateCrowdRecord';

export default function App() {
  return (
    <BrowserRouter>
   
      <Routes>
        <Route path="/sign-up" element={<SignUp/>}/>
        <Route path="/" element={<SignIn/>}/>

        <Route element={<PrivateRoute/>}/>
          <Route path="/dashboard" element={<DashBoard/>}/> 
        <Route/>

        <Route path='/create-record-crowd' element={<CreateCrowdRecord/>}></Route>
        
      </Routes>

    </BrowserRouter>
  )
}
