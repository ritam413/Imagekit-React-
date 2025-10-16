import './App.css'
import LoginPage from './Pages/LoginPage.jsx'
import SignupPage from './Pages/SignUpPage.jsx'
import ForgotPasswordPage from './Pages/ForgotPasswordPage.jsx'
import { Routes,Route,Navigate } from "react-router-dom"
import { Toaster } from 'react-hot-toast';
import HeroPage from './Pages/HeroPage.jsx'
import UserDashboard from './Pages/DashBoard.jsx'
import { EditPage } from './Pages/EditPage.jsx'
import toast from 'react-hot-toast'
import { useEffect, useState } from 'react'
function App() {

  const [loading, setLoading] = useState(true)
  const isBackendOnline = async()=>{
    try {
      
      const res = await fetch('http://localhost:8000/api/test',{
        method:'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      })
  
      const data = await res.json();
  
      if(data){
        setLoading(false)
        toast.success(data.message)
      }
    } catch (error) {
      setLoading(true)
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    isBackendOnline()
  },[])
  return (
    <>
      <Toaster position='top-center'/>
      
      <Routes>
         
        <Route
          path='/'
          element={<LoginPage />}
        ></Route>
        <Route
          path='/signup'
          element={<SignupPage />}
        ></Route>
        <Route
          path='/login'
          element={<LoginPage />}
        ></Route>
        <Route
          path='/forgot-password'
          element={<ForgotPasswordPage />}
        ></Route>
        <Route
          path='/app'
          element={<HeroPage />}
        ></Route>
        <Route
          path='/user'
          element={<UserDashboard />}
        ></Route>

        <Route
          path='/edit'
          element={<EditPage />}
        ></Route>
        <Route
          path='/edit/:url'
          element={<EditPage />}
        ></Route>
      </Routes>
    </>
  )
}

export default App
