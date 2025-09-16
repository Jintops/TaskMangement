import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const [emailId, setEmailId] = useState("vini@gmail.com");
  const [password, setPassword] = useState("Vini@777");
  const [name, setName] = useState("");
 
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true)
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:3000/login", {
        emailId,
        password
      }, {
        withCredentials: true,
      })
      console.log(res.data)
     if (res.data.data.role === "admin") {
        navigate("/admindashboard");
      } else {
        navigate("/dashboard");
      }
     
    } catch (err) {
      setError(err?.response?.data || "Something went wrong")
      console.log(err)
    }
  }

  const handleSignUp = async () => {
    try {
      const res = await axios.post("http://localhost:3000/signup", { name, emailId, password }, { withCredentials: true })
   
    navigate('/dashboard')
    } catch (err) {
      setError(err?.response?.data || "Something went wrong")
    }
  }

  return (
    <div className='flex justify-center my-28'>
      <div className="card  w-96 shadow-xl border border-indigo-700/50">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl font-bold text-white">{isLogin ? "Login" : "Create Account"} </h2>

          {!isLogin && <><label className="form-control w-full max-w-xs mt-6">
            <div className="label" >
              <span className="label-text text-white"> Name</span>
            </div>
            <input type="text" value={name} className="input input-bordered w-full max-w-xs text-white border" placeholder='Enter your  name' onChange={(e) => setName(e.target.value)} />
          </label>
          </>}


          <label className="form-control w-full max-w-xs mt-4 my-4">
            <div className="label">
              <span className="label-text text-white">Email ID</span>
            </div>
            <input type="text" value={emailId} className="input input-bordered w-full max-w-xs text-white border" placeholder='Enter your email'  onChange={(e) => setEmailId(e.target.value)} />
          </label>

          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text text-white">Password</span>
            </div>
            <input type="text" value={password} className="input input-bordered w-full max-w-xs text-white border" placeholder='Enter your password' onChange={(e) => setPassword(e.target.value)} />
          </label>
          <p className='text-red-500'>{error}</p>

          <div className="card-actions justify-center my-2">
            <button className="btn bg-indigo-600 w-full max-w-xs text-white hover:bg-indigo-700" onClick={isLogin ? handleLogin : handleSignUp}>{isLogin ? "Login" : "SignUp "}</button>
          </div>

          <div className="">
            <p className="cursor-pointer text-start text-sm  text-white" onClick={() => setIsLogin((value) => !value)}>
              {isLogin ? (
                <>
                  Don't have an account?{" "}
                  <span className="text-indigo-600 hover:text-indigo-700 font-semibold">
                    Register here
                  </span>
                </>
              ) : (
                <>
                  You have an account?{" "}
                  <span className="text-indigo-600 hover:text-indigo-700 font-semibold">
                     Login here
                  </span>
                </>
              )}
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Login
