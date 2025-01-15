import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await fetch('http://localhost/login-backend/login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Network response was not ok');
            }
    
            const data = await response.json();
            setMessage(data.message);
    
            // If login is successful, set the session and redirect based on role
            if (data.success) {
                // Optionally, store role in sessionStorage or localStorage
                sessionStorage.setItem('role', data.role);
                switch (data.role) {
                    case 'owner':
                        navigate('/owner-dashboard');
                        break;
                    case 'employee':
                        navigate('/employee-dashboard');
                        break;
                    case 'clerk':
                        navigate('/clerk-dashboard');
                        break;
                    default:
                        setMessage('Unknown role. Please contact support.');
                }
            } else {
                setMessage('Invalid username or password. Please try again.');
            }
        } catch (error) {
            setMessage('An error occurred: ' + error.message);
            console.error('Error:', error);
        }
    };
    

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-orange-300 to-orange-500">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-4">
                {/* Company Branding */}
                <div className="flex flex-col items-center mb-8">
                    <h1 className="text-3xl font-extrabold text-orange-600">Saisamarth Polytech</h1>
                </div>

                <h2 className="text-2xl font-semibold mb-6 text-center text-orange-600">Login</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full p-4 mb-4 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 ease-in-out"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-4 mb-6 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 ease-in-out"
                    />
                    <button
                        type="submit"
                        className="w-full bg-orange-600 text-white py-3 rounded-lg shadow-md hover:bg-orange-700 transition duration-200"
                    >
                        Submit
                    </button>
                </form>
                {message && (
                    <p className="mt-4 text-center text-red-500">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Login;