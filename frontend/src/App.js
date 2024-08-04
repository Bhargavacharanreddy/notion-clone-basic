import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const App = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const canvas = document.getElementById('starfield');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const stars = Array.from({ length: 300 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 0.5 + 0.2,
      }));

      const animate = () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        stars.forEach(star => {
          ctx.fillStyle = 'white';
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, 2 * Math.PI);
          ctx.fill();
          star.y += star.speed;
          if (star.y > window.innerHeight) {
            star.y = 0;
          }
        });
        requestAnimationFrame(animate);
      };

      animate();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isNewUser) {
        await axios.post('http://localhost:6030/api/register', { email, password });
        setIsNewUser(false);
        setErrorMessage('Registration successful! Please log in.');
      } else if (isOtpSent) {
        const response = await axios.post('http://localhost:6030/api/verify-otp', { email, otp });
        if (response.data.success) {
          setErrorMessage('Login successful!');
          // Handle successful login (e.g., redirect to dashboard)
        } else {
          setErrorMessage('Invalid OTP. Please try again.');
        }
      } else {
        const response = await axios.post('http://localhost:6030/api/login', { email });
        if (response.data.success) {
          setIsOtpSent(true);
          setErrorMessage('OTP sent to your email!');
        } else {
          setErrorMessage('Email not found. Please register.');
        }
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black overflow-hidden relative">
      <canvas
        id="starfield"
        className="absolute inset-0"
        width={window.innerWidth}
        height={window.innerHeight}
      >
      </canvas>
      <motion.div
        initial={{ y: -250, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.5, type: 'spring' }}
        className="z-10 flex flex-col items-center justify-center w-full max-w-md p-8 bg-black bg-opacity-80 rounded"
      >
        <h2 className="text-3xl font-bold mb-6 text-white text-center">
          {isNewUser ? 'Register' : 'Login'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col items-center">
          <motion.div initial={{ x: '-100vw' }} animate={{ x: 0 }} transition={{ delay: 0.2, type: 'spring', stiffness: 120 }} className="w-full">
            <label htmlFor="email" className="block text-white mb-1 text-center">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}
                   className="w-full px-3 py-2 bg-gray-700 text-white rounded" required />
          </motion.div>
          {isNewUser && (
            <motion.div initial={{ x: '100vw' }} animate={{ x: 0 }} transition={{ delay: 0.4, type: 'spring', stiffness: 120 }} className="w-full">
              <label htmlFor="password" className="block text-white mb-1 text-center">Password</label>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}
                     className="w-full px-3 py-2 bg-gray-700 text-white rounded" required />
            </motion.div>
          )}
          {isOtpSent && (
            <motion.div initial={{ x: '-100vw' }} animate={{ x: 0 }} transition={{ delay: 0.6, type: 'spring', stiffness: 120 }} className="w-full">
              <label htmlFor="otp" className="block text-white mb-1 text-center">OTP</label>
              <input type="text" id="otp" value={otp} onChange={(e) => setOtp(e.target.value)}
                     className="w-full px-3 py-2 bg-gray-700 text-white rounded" required />
            </motion.div>
          )}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            {isNewUser ? 'Register' : isOtpSent ? 'Verify OTP' : 'Login'}
          </motion.button>
        </form>
        <p className="text-red-400 mt-4">{errorMessage}</p>
        <button
          onClick={() => setIsNewUser(!isNewUser)}
          className="mt-4 text-blue-300 hover:text-blue-400 transition duration-300"
        >
          {isNewUser ? 'Back to Login' : 'New User? Register'}
        </button>
      </motion.div>
      
    </div>
  );
};

export default App;
