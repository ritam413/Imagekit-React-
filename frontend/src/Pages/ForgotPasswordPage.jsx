// --- React Imports ---
import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// ---------------------

// --- Zustand Imports ---
import useUserStore from '../zustand/user.store';
// ---------------------

// --- Toast Imports ---
import toast from 'react-hot-toast';
// ---------------------

// --- React Icons ---
import { GiBleedingEye } from "react-icons/gi";
import { LuEyeClosed } from "react-icons/lu";
import { api } from '../utils/axiosInstance';
// ---------------------

const SignupPage = () => {
    const navigate = useNavigate();
    // State Management
    const [form, setForm] = useState({
        password: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);
    
    // 👇 separate states for each field
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Functions to toggle Password Visiblity ON/OFF 
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Constructing Payload
    const payload = {
        password: form.password,
        newPassword: form.newPassword
    }

    // This Handles Change in the confirmPassword and newPassword if they doesnt match then it will show error
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    // Sending Payload via Request To Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validation of Passoword
        if (form.password !== form.confirmPassword) {
            toast.error("Passwords do not match")
            return setLoading(false);
        }

        try {
            const response = await api.put(`api/auth/reset-password`,payload)

            const data = response.data
            if (response.status===200) {
                useUserStore.getState().setUser(data.user)
                navigate("/login")
                toast.success("Reset Password Success: ", data.message)

            } else {
                toast.error("Reset Password Failed", res.status)
            }
        } catch {
            toast.error("Reset Password Failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-bg text-white relative overflow-hidden">
            {/* Background */}

            {/* Polygon Gradient Background */}
            <div
                className="absolute top-0 right-0 w-3/5 h-full"
                style={{
                    background:
                        "linear-gradient(135deg, rgba(161,0,255,0.8) 0%, rgba(0,16,255,0.8) 50%, rgba(0,217,255,0.8) 100%)",
                    clipPath: "polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%)",
                }}
            />
            {/* --------------------------- */}

            {/* Reset Password Form */}
            <form >
                <div
                    className="relative z-10 p-10 py-5 rounded-xl shadow-2xl w-full max-w-md mx-4"
                    style={{ backgroundColor: "rgba(28, 26, 47, 0.9)", backdropFilter: "blur(10px)" }}
                >
                    {/* Heading */}
                        <div className="flex justify-center mb-6">
                            <button>
                                <h2 className="text-2xl font-bold">Reset Password</h2>
                            </button>
                        </div>
                    {/* ------- */}

                    {/* Current Password */}
                        <div className="form-control mb-4">
                            <div className="relative w-full">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Current Password"
                                    id="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    className="input input-bordered input-md w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500 focus:ring-blue-500 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-yellow-300 transition-all duration-200 ease-in-out"
                                >
                                    {showPassword ? (
                                        <LuEyeClosed className="w-5 h-5" />
                                    ) : (
                                        <GiBleedingEye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                    {/* ---------------- */}

                    {/* New Password */}
                        <div className="form-control mb-4">
                            <div className="relative w-full">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="New Password"
                                    id="newPassword"
                                    name="newPassword"
                                    value={form.newPassword}
                                    onChange={handleChange}
                                    className="input input-bordered input-md w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500 focus:ring-blue-500 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-yellow-300 transition-all duration-200 ease-in-out"
                                >
                                    {showNewPassword ? (
                                        <LuEyeClosed className="w-5 h-5" />
                                    ) : (
                                        <GiBleedingEye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                    {/* ---------------- */}


                    {/* Confirm Password */}
                        <div className="form-control mb-4">
                            <div className="relative w-full">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm Password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    className="input input-bordered input-md w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500 focus:ring-blue-500 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-yellow-300 transition-all duration-200 ease-in-out"
                                >
                                    {showConfirmPassword ? (
                                        <LuEyeClosed className="w-5 h-5" />
                                    ) : (
                                        <GiBleedingEye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                    {/* ---------------- */}

                    {/* Submit to Reset Password */}
                    <button
                        className="btn w-full text-white font-bold py-3 px-4 rounded-lg mb-4"
                        style={{ backgroundColor: "#ff007f", "&:hover": { backgroundColor: "#e60073" } }}
                        onClick={handleResetPassword}
                    >
                        RESET PASSWORD
                    </button>
                    {/* ----------------------- */}
                    
                    
                    {/* Back to login */}
                        <div className="flex justify-center mt-4">
                            <a
                                href="#"
                                className="text-sm text-gray-400"
                                onClick={() => navigate("/login")}
                            >
                                Back to <span className="text-primary-button hover:underline hover:text-blue-400">Login</span>
                            </a>
                        </div>
                    {/* ---------------- */}
                </div>
            </form>
            {/* ------------------- */}


        </div>
    );

};

export default SignupPage;