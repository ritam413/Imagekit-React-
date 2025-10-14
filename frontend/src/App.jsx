import './App.css'
import LoginPage from './Pages/LoginPage.jsx'
import SignupPage from './Pages/SignUpPage.jsx'
import ForgotPasswordPage from './Pages/ForgotPasswordPage.jsx'
import { Routes,Route,Navigate } from "react-router-dom"
import { Toaster } from 'react-hot-toast';
import HeroPage from './Pages/HeroPage.jsx'
import UserDashboard from './Pages/DashBoard.jsx'
import Navbar from './components/Navbar.jsx'
import { EditPage } from './Pages/EditPage.jsx'

function App() {
  
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
