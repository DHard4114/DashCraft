import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSignIn(e);
        }
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API}user/login`,
                null,
                { params: { email, password } }
            );

            console.log("LOGIN RESPONSE:", response.data);

            if (response.data.success) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user_id", response.data.payload.id);
                localStorage.setItem("email", email);

                alert("Login successful!");

                navigate("/");
            } else {
                setError(response.data.message || "Login failed");
            }
        } catch (error) {
            setError(error.response?.data?.message || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full flex items-center justify-center min-h-screen bg-[#f3f2f3] p-4 font-lato">
            <div className="max-w-md w-full bg-white rounded-sm  p-6 border border-gray-300">
                <h2 className="text-2xl font-mono text-gray-800 text-center mb-4 tracking-wide">Login</h2>

                <form onSubmit={handleSignIn} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-mono text-gray-700">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="mt-1 block w-full rounded-sm border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-800 p-2"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-mono text-gray-700">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="mt-1 block w-full rounded-sm border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-800 p-2"
                            required
                        />
                    </div>

                    {error && <p className="text-red-500 text-center">{error}</p>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full bg-[#141414] text-white font-mono py-2 rounded-sm transition-all ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-900'
                        }`}
                    >
                        {isLoading ? "Loading..." : "Login"}
                    </button>

                    <div className="text-center text-sm space-y-2">
                        <p>Belum punya akun? <Link to="/auth/register" className="text-blue-500 hover:underline">Daftar</Link></p>
                        <p><Link to="/authentication/repass" className="text-blue-500 hover:underline">Forgot Password?</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
