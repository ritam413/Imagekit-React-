//---- CSS Imports ----
import './App.css'

//---- React Imports ----
import { Routes, Route } from "react-router-dom"
import { Toaster } from 'react-hot-toast';

//---- Pages Imports ----
import LoginPage from './Pages/LoginPage.jsx'
import SignupPage from './Pages/SignUpPage.jsx'
import ForgotPasswordPage from './Pages/ForgotPasswordPage.jsx'
import HeroPage from './Pages/HeroPage.jsx'
import UserDashboard from './Pages/DashBoard.jsx'
import { EditPage } from './Pages/EditPage.jsx'
import HttpsPoling from './Pages/HttpsPolling.jsx'
// ---------------------


function App() {
  return (
    <>
      {/* Declaring Toaster */}
      <Toaster position='top-center' />

      {/* ----- Routes ----- */}
      <Routes>
        <Route
          path='/poll'
          element={<HttpsPoling />}
        ></Route>
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
