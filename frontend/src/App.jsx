//---- CSS Imports ----
import './App.css'
//---- React Imports ----
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from 'react-hot-toast';
import { api } from "../src/utils/axiosInstance.js"
//---- Pages Imports ----
import LoginPage from './Pages/LoginPage.jsx'
import SignupPage from './Pages/SignUpPage.jsx'
import ForgotPasswordPage from './Pages/ForgotPasswordPage.jsx'
import HeroPage from './Pages/HeroPage.jsx'
import UserDashboard from './Pages/DashBoard.jsx'
import { EditPage } from './Pages/EditPage.jsx'
// ---------------------
function App() {

  // ---- States ----
  const [loading, setLoading] = useState(true)

  // ---- Check if backend is online ----
  const isBackendOnline = async () => {
    try {

      const res = await api.get("/isOnline")

      const data = res.data

      if (data) {
        setLoading(false)
        toast.success(data.message)
      }
    } catch (error) {
      setLoading(true)
    } finally {
      setLoading(false)
    }
  }

  console.log(api.defaults.baseURL)

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const status = await isBackendOnline(); // assuming this returns a Promise
        if (status === 200) {
          setLoading(false);
          clearInterval(interval);
        }
      } catch (err) {
        console.error(err);
      }
    }, 5000);

    return () => clearInterval(interval); // cleanup on unmount
  }, []); // runs once on moun

  // ------------------------------------

  return (
    <>
      {/* Declaring Toaster */}
      <Toaster position='top-center' />

      {/* ----- Routes ----- */}
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
      {/* ------------------ */}
    </>
  )
}

export default App
