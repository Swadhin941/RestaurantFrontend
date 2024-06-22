import React, { useContext, useState } from "react";
import "./Register.css";
import { SharedData } from "../SharedData/SharedContext";
import toast from "react-hot-toast";

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { user, register, setLoading } = useContext(SharedData);

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const fullName = form.fullName.value;
        const email = form.email.value;
        const password = form.password.value;
        const cPassword = form.cPassword.value;
        if (password !== cPassword) {
            toast.error("Password do not match");
            return;
        }
        //regex matching
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
