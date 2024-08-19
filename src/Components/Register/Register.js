import React, { useContext, useEffect, useState } from "react";
import "./Register.css";
import { SharedData } from "../SharedData/SharedContext";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { ServerUrl } from "../ServerUrl/ServerUrl";

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { user, register, setLoading, setUser } = useContext(SharedData);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';
    

    useEffect(()=>{
        if(user){
            navigate(from, {replace: true});
        }
    },[user])

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const fullName = form.fullName.value;
        const email = form.email.value;
        const password = form.password.value;
        const cPassword = form.cPassword.value;
        const role = "regular";
        if (password !== cPassword) {
            toast.error("Password do not match");
            return;
        }
        if(password.length< 6){
            toast.error("Password should be at least 6 characters long");
            return;
        }
        if(!/(?=.*[A-Z].*[a-z].*[0-9])/.test(password)){
            toast.error("Password should contain at least one uppercase letter, one lowercase letter, and one number");
            return;
        }

        fetch(`${ServerUrl}/auth/register`,{
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({fullName, email, password, role})
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.acknowledged){
                fetch(`${ServerUrl}/auth/jwt`,{
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({email, role})
                })
                .then(res=>res.json())
                .then(jwtResponse=>{
                    if(jwtResponse?.token){
                        localStorage.setItem("token", jwtResponse?.token);
                        setLoading(false);
                        setUser({fullName, email, role})
                    }
                })
                .catch(error=>{
                    toast.error(error.message);
                })
            }
        })
        .catch(error=>{
            toast.error(error.message);
        })

    };

    return (
        <div className="container-fluid registerPage">
            <div className="registerCardContent">
                <div className="card border border-0 w-100">
                    <div className="card-body">
                        <h2 className="text-center">Sign up</h2>
                        <form className="form" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="fullName">Full Name:</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="bi bi-person"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="fullName"
                                        required
                                        placeholder="Enter your full name"
                                    />
                                </div>
                            </div>
                            <div className="mt-2">
                                <label htmlFor="email">Email:</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="bi bi-envelope"></i>
                                    </span>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        className="form-control"
                                    />
                                </div>
                            </div>
                            <div className="mt-2">
                                <label htmlFor="password">Password:</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="bi bi-lock"></i>
                                    </span>
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        className="form-control"
                                        name="password"
                                        placeholder="Enter your password"
                                        minLength={6}
                                    />
                                </div>
                            </div>
                            <div className="mt-2">
                                <label htmlFor="cPassword">
                                    Confirm Password:
                                </label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="bi bi-lock"></i>
                                    </span>
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        className="form-control"
                                        name="cPassword"
                                        minLength={6}
                                        placeholder="Re-type your password"
                                    />
                                </div>
                            </div>
                            <div className="mt-2">
                                <input
                                    type="checkbox"
                                    className="form-check-input me-2"
                                    name="showPass"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                />
                                <label htmlFor="showPass form-label ms-2">
                                    Show Password
                                </label>
                            </div>
                            <div className="mt-2 d-flex justify-content-center">
                                <button className="btn btn-primary w-50">
                                    Sign up
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="registerImgContent">
                <div className="">
                    <img
                        src="https://i.ibb.co/sQNp0qs/signup.webp"
                        alt=""
                        style={{ height: "100%", width: "100%" }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Register;
