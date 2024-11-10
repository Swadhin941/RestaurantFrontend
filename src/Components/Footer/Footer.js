import React, { useEffect, useState } from "react";
import "./Footer.css";
import { Link, useNavigate } from "react-router-dom";
import useAxiosSecure from "../CustomHook/useAxiosSecure/useAxiosSecure";
import toast from "react-hot-toast";

const Footer = () => {
    const [recentPost, setRecentPost]= useState([]);
    const [axiosSecure]= useAxiosSecure();
    const navigate = useNavigate();

    useEffect(()=>{
        axiosSecure.get(`/get-recent-posts`)
        .then(res=>res.data)
        .then(data=>{
            setRecentPost(data);
        })
        .catch(error=>{
            toast.error(error.message);
        })
    },[])


    return (
        <div className="container-fluid footerContainer">
            <div className="d-flex justify-content-center">
                <div style={{ height: "70px", width: "auto" }}>
                    <img
                        src="https://i.ibb.co/mJn7gmn/foodie-logo.png"
                        alt=""
                        style={{ height: "100%", width: "auto" }}
                    />
                </div>
            </div>
            <div className="d-flex justify-content-center">
                <hr
                    className="w-75"
                    style={{ border: "2px solid #ff9900", borderRadius: "2px" }}
                />
            </div>
            <div className="footerInfo">
                <div className="footerAboutUs">
                    <h5 className="fw-bold text-white">About us</h5>
                    <p className="text-white">
                        Welcome to FOODIE, where fresh ingredients, authentic
                        flavors, and warm hospitality come together to create a
                        memorable dining experience for every guest.
                    </p>
                    <div className="d-flex">
                        <div className="me-2">
                            <div className="bg-warning border border-0 rounded p-3">
                                <i className="bi bi-clock-history text-white fs-4 fw-bold"></i>
                            </div>
                        </div>
                        <div>
                            <h5 className="my-0 text-white">Opening Hours</h5>
                            <p
                                className="m-0 text-white"
                                style={{ fontSize: "10px" }}
                            >
                                Sat-Thu
                            </p>
                            <p
                                className="m-0 text-white"
                                style={{ fontSize: "10px" }}
                            >
                                10am - 10pm
                            </p>
                            <p
                                className="m-0 text-white"
                                style={{ fontSize: "10px" }}
                            >
                                Friday closed
                            </p>
                        </div>
                    </div>
                </div>
                <div className="footerUsefulLinks">
                    <h5 className="text-white fw-bold">Useful links</h5>
                    <div>
                        <Link
                            to="/my-profile"
                            className="text-decoration-none text-white"
                        >
                            Profile
                        </Link>
                    </div>
                    <div>
                        <Link
                            to="/cart"
                            className="text-decoration-none text-white"
                        >
                            Cart
                        </Link>
                    </div>
                    <div>
                        <Link
                            to="/about-us"
                            className="text-decoration-none text-white"
                        >
                            About-us
                        </Link>
                    </div>
                </div>
                <div className="footerRecentPost">
                    <h5 className="text-white fw-bold">Recent post</h5>
                    {recentPost.map((post, index) => (
                        <div className="d-flex my-0" key={index} style={{cursor:"pointer"}} onClick={()=>navigate(`/product-details/${post._id}`)}>
                            <div style={{ height: "80px", width: "80px" }}>
                                <img
                                    src= {post?.imgLink}
                                    alt=""
                                    style={{ height: "auto", width: "100%" }}
                                />
                            </div>
                            <div className="ms-2">
                                <h5
                                    className="text-white fw-bold my-0"
                                    style={{ fontSize: "12px" }}
                                >
                                    {post.title}
                                </h5>
                                <p
                                    className="text-white my-0"
                                    style={{ fontSize: "10px" }}
                                >
                                    {post.description.slice(0,60)}...
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Footer;
