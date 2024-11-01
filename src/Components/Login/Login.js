import React, { useContext, useEffect, useState } from "react";
import "./Login.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SharedData } from "../SharedData/SharedContext";
import ClockLoader from "react-spinners/ClockLoader";
import toast from "react-hot-toast";
import { ServerUrl } from "../ServerUrl/ServerUrl";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { login, setUser, setLoading, user } = useContext(SharedData);
    const [dataLoading, setDataLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    useEffect(()=>{
        if(user){
            navigate(from, {replace: true});
        }
    },[user])

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;
        setDataLoading(true);
        login(email, password)
            .then((res) => res.json())
            .then((data) => {
                if (data) {
                    if(data?.message){
                        toast.error(data?.message);
                        setUser(null);
                        setDataLoading(false);
                        return;
                    }
                    fetch(`${ServerUrl}/auth/jwt`, {
                        method: "POST",
                        headers: {
                            "content-type": "application/json",
                        },
                        body: JSON.stringify({
                            email: email,
                            role: data?.role,
                        }),
                    })
                        .then((res) => res.json())
                        .then((jwtData) => {
                            localStorage.setItem("token", jwtData?.token);
                            setUser(data);
                            navigate(from, { replace: true });
                            toast.success("Logged in successfully");
                        })
                        .catch((error) => {
                            toast.error(error.message);
                        });
                } else {
                    toast.error("Invalid username or password");
                    setUser(null);
                }
                setLoading(false);
                setDataLoading(false);
            })
            .catch((error) => {
                setDataLoading(false);
                setLoading(false);
                toast.error("Check your internet connection and try again");
            });
    };
    return (
        <div className="container-fluid loginContainer">
            <div className="loginCardContainer">
                <div>
                    <h2 className="text-center">Sign in</h2>
                    <div
                        className="card border border-0"
                        style={{ width: "300px" }}
                    >
                        <div className="card-body">
                            <form className="form" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="email">Email:</label>
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <i className="bi bi-envelope"></i>
                                        </span>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            className="form-control"
                                            placeholder="Enter your email"
                                            required
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
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="password"
                                            id="password"
                                            className="form-control"
                                            placeholder="Enter your password"
                                            style={{ borderRight: "0px" }}
                                            required
                                            minLength={6}
                                        />
                                        <span
                                            className="input-group-text"
                                            style={{ backgroundColor: "white" }}
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                        >
                                            <i
                                                className={`bi ${
                                                    showPassword
                                                        ? "bi-eye"
                                                        : "bi-eye-slash"
                                                }`}
                                            ></i>
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-3 d-flex justify-content-center">
                                    <button
                                        className="btn btn-success w-50 d-flex justify-content-center"
                                        disabled={dataLoading}
                                    >
                                        {dataLoading ? (
                                            <ClockLoader
                                                size={24}
                                                color="white"
                                            />
                                        ) : (
                                            "Sign in"
                                        )}
                                    </button>
                                </div>
                            </form>
                            <div className="mt-2 d-flex justify-content-center">
                                <Link to={"/register"}>
                                    Did not have any account?
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="loginImgDiv">
                <img
                    src="https://i.ibb.co/74hdYx4/image-3.png"
                    alt=""
                    style={{ height: "100%", width: "auto" }}
                />
            </div>
        </div>
    );
};

export default Login;
