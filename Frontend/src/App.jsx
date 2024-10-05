import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './Pages/SignUp'
import SignIn from './Pages/SignIn';
import PrivateRoute from './Components/PrivateRoute';
import DashBoard from './Pages/DashBoard';
import CreateCrowdRecord from './Pages/CreateCrowdRecord';
import AllStaff from './Pages/AllStaff';
import AllTaskToStaff from './Pages/AllTaksToStaffMember';
import StaffSignUp from './Pages/StaffMemberSignUp';
import StaffSignIn from './Pages/StaffMemberSignIn';
import GetAllStaff from './Pages/AllTaksToStaffMember';
import StaffMemberDashSideBar from './Components/StaffMemberDashSideBar';

export default function App() {
  return (
    <BrowserRouter>
   
      <Routes>
        <Route path="/sign-up" element={<SignUp/>}/>
        <Route path="/" element={<div><SignIn/><StaffSignIn/></div>}/>

        <Route element={<PrivateRoute/>}/>
          <Route path="/dashboard" element={<DashBoard/>}/> 
        <Route/>

        <Route path='/create-record-crowd' element={<CreateCrowdRecord/>}></Route>
        <Route path='/all-staff'element={<AllStaff/>}/>
        <Route path='/all-task-to-staff'element={<AllTaskToStaff/>}/>
        <Route path='/staffSignUp'element={<StaffSignUp/>}/>
        <Route path='/staffSignIn'element={<StaffSignIn/>}/>
        <Route path='/staffMemberSideBar'element={<StaffMemberDashSideBar/>}/>
      </Routes>

    </BrowserRouter>
  )
}
