import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { SharedData } from "../SharedData/SharedContext";

const Navbar = () => {
    const { user, logout } = useContext(SharedData);
    const navigate = useNavigate();
    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">
                <Link className="navbar-brand" to={"/"}>
                    <img src="https://i.ibb.co/G3c5DM7/logo.png" alt="" />
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div
                    className="collapse navbar-collapse"
                    id="navbarSupportedContent"
                >
                    <div className="nav-content">
                        <ul className="navbar-nav mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link
                                    className="nav-link active"
                                    aria-current="page"
                                    to={"/"}
                                    title="Home"
                                >
                                    <i className="bi bi-house-door-fill fs-4"></i>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    className="nav-link"
                                    to={"/cart"}
                                    title="cart"
                                >
                                    <i className="bi bi-cart-fill fs-4"></i>
                                </Link>
                            </li>
                            {!user && (
                                <li
                                    className="nav-item p-2 profile-item"
                                    style={{}}
                                    onClick={() => navigate("/my-profile")}
                                >
                                    <img
                                        src={`https://i.ibb.co/bmVqbdY/empty-person.jpg`}
                                        alt=""
                                        style={{
                                            height: "30px",
                                            width: "30px",
                                            borderRadius: "50%",
                                        }}
                                    />
                                </li>
                            )}

                            {user && (
                                <li className="nav-item profile-item p-2">
                                    <div className="dropdown">
                                        <img
                                            src={
                                                user?.imgLink ||
                                                `https://i.ibb.co/bmVqbdY/empty-person.jpg`
                                            }
                                            alt=""
                                            className="dropdown-toggle"
                                            style={{
                                                height: "30px",
                                                width: "30px",
                                                borderRadius: "50%",
                                            }}
                                            data-bs-toggle="dropdown"
                                        />
                                        <ul
                                            className="dropdown-menu"
                                            style={{ backgroundColor: "gray" }}
                                        >
                                            <li className="">
                                                <p
                                                    className="dropdown-item"
                                                    onClick={() =>
                                                        navigate("/my-profile")
                                                    }
                                                >
                                                    Profile
                                                </p>
                                            </li>
                                            {(user?.role === "admin" ||
                                                user?.role === "chef") && (
                                                <>
                                                    <li className="">
                                                        <p
                                                            className="dropdown-item"
                                                            onClick={() =>
                                                                navigate(
                                                                    "/admin"
                                                                )
                                                            }
                                                        >
                                                            Admin panel
                                                        </p>
                                                    </li>
                                                </>
                                            )}
                                            <li className="">
                                                <p
                                                    className="dropdown-item"
                                                    onClick={() => logout()}
                                                >
                                                    Logout
                                                </p>
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
