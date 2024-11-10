import React, { useEffect, useState } from "react";
import "./AboutUs.css"; // Import your CSS or use inline styles
import { ServerUrl } from "../ServerUrl/ServerUrl";
import toast from "react-hot-toast";
import useTitle from "../CustomHook/useTitle/useTitle";

const AboutUs = () => {
    useTitle("About Us- Foodie");
    const [allChef, setAllChef]= useState([]);
    useEffect(()=>{
        fetch(`${ServerUrl}/auth/all-chef`)
        .then(res=>res.json())
        .then(data=>{
            setAllChef(data);
        })
        .catch(error=>{
            toast.error(error.message);
        })
    },[])
    return (
        <div className="container-fluid p-4" style={{backgroundColor:"whitesmoke"}}>
            {/* Hero Section */}
            <section>
                <div
                    className="d-flex justify-content-center"
                    style={{ width: "100%", height: "380px" }}
                >
                    <img
                        src="https://i.ibb.co/mJn7gmn/foodie-logo.png"
                        alt="Restaurant"
                        className="img-fluid"
                        style={{
                            borderRadius: "10px",
                            height: "100%",
                            width: "auto",
                        }}
                    />
                </div>
                <div className="d-flex justify-content-center">
                    <div>
                        <h1 className="hero-title mt-2">
                            Welcome to{" "}
                            <span style={{ color: "red", fontWeight: "700" }}>
                                FOODIE
                            </span>
                        </h1>
                        <p className="hero-subtitle text-center fw-bold">
                            Where flavors meet tradition
                        </p>
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="row mt-5 mb-5">
                <div className="col-12 col-sm-6 col-md-6 col-lg-6">
                    <h2 className="text-center fw-bold ms-4">Our Story</h2>
                    <p className=" ms-4" style={{ fontWeight: "600" }}>
                        Established in{" "}
                        <span className="text-success">2024</span>,{" "}
                        <span className="text-danger fw-bold">Foodie</span> has
                        been serving up mouth-watering dishes inspired by
                        traditional Asian flavors and modern culinary
                        techniques. Our journey began with a passion for quality
                        ingredients and a desire to bring people together over
                        delicious food.
                    </p>
                    <p className="ms-4">
                        Every dish is crafted with love and attention to detail,
                        blending fresh ingredients with rich flavors to create
                        an unforgettable dining experience.
                    </p>
                </div>
                <div className="col-12 col-sm-6 col-md-6 col-lg-6">
                    <img
                        src="https://i.ibb.co.com/3WnXN8n/20210913-193841.jpg"
                        alt=""
                        className="img-fluid"
                        style={{
                            borderRadius: "10px",

                            marginRight: "2rem",
                        }}
                    />
                </div>
                <div className=""></div>
            </section>

            {/* Chef Section */}
            <section className="row mt-5">
                <div className="col-12 col-sm-6 col-md-6 col-lg-6">
                    <h2>Meet Our Chef</h2>
                    <div className="chef-container">
                        <p className="chef-description text-justify-center">
                            Our head chef, <span className="text-danger fw-bold">{allChef[0]?.fullName}</span>,
                            brings over 5 years of culinary experience, having
                            honed their skills in Asian. Known for
                            their creativity and dedication to authentic
                            flavors, Chef {allChef[0]?.fullName} ensures every
                            plate is a masterpiece.
                        </p>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-md-6 col-lg-6">
                    <div className="row">
                        {allChef.map((chef, index) => (
                            <div
                                className="col-12 col-sm-4 col-md-4 col-lg-4"
                                key={index}
                            >
                                <div className="card p-4">
                                    <div className="d-flex justify-content-center">
                                        <img
                                            src={
                                                chef.imgLink ||
                                                "https://i.ibb.co/bmVqbdY/empty-person.jpg"
                                            }
                                            alt=""
                                            style={{
                                                height: "100px",
                                                width: "100px",
                                            }}
                                        />
                                    </div>
                                    <h6 className="text-center mb-0">
                                        {chef.fullName}
                                    </h6>
                                    {index === 0 && (
                                        <p className="text-center text-danger fw-bold mt-0">
                                            Head
                                        </p>
                                    )}
                                    {index === 1 && (
                                        <p className="text-center text-success fw-bold mt-0">
                                            New
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="values-section">
                <h2>Our Values</h2>
                <ul>
                    <li>
                        🌱 Quality Ingredients: We source only the finest local
                        ingredients.
                    </li>
                    <li>
                        🍲 Authentic Recipes: Our recipes reflect
                        Bangladesh traditions.
                    </li>
                    <li>
                        💖 Customer Satisfaction: Our customers are our family.
                    </li>
                </ul>
            </section>
        </div>
    );
};

export default AboutUs;
