import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './Pages/SignUp'
import SignIn from './Pages/SignIn';
import PrivateRoute from './Components/PrivateRoute';
import DashBoard from './Pages/DashBoard';
import CreateCrowdRecord from './Pages/CreateCrowdRecord';
import AllStaff from './Pages/AllStaff';
import AddCategory from './Pages/AddCategory';
import AddPostScreen from './Pages/AddProduct';
import EditProduct from './Pages/EditProduct';

export default function App() {
  return (
    <BrowserRouter>
   
      <Routes>
        <Route path="/sign-up" element={<SignUp/>}/>
        <Route path="/" element={<SignIn/>}/>

        <Route element={<PrivateRoute/>}/>
          <Route path="/dashboard" element={<DashBoard/>}/> 
          <Route path="/addcategory" element={<AddCategory/>}/> 
          <Route path="/addproducts" element={<AddPostScreen/>}/>
          <Route path='/create-record-crowd' element={<CreateCrowdRecord/>}></Route>
          <Route path='/all-staff'element={<AllStaff/>}/>
          <Route path="/edit-product/:productId" element={<EditProduct/>} />
        <Route/>

       
      </Routes>

    </BrowserRouter>
  )
}
