import React from "react";
import "./TopBanner.css";

const TopBanner = () => {
    return (
        <div className="container-fluid p-0 ">
            <div
                className="topBanner"
            >
                <div className="topBannerContent">
                    <div className="topBannerContentInfo"
                        
                    >
                        <h1 className="fw-bold" style={{ }}>
                            Enjoy healthy life and{" "}
                            <span style={{ color: "#195A00" }}>tasty</span> food
                        </h1>
                        <div>
                            <button
                                className="btn"
                                style={{
                                    backgroundColor: "#195A00",
                                    color: "white",
                                }}
                            >
                                Show more
                            </button>
                            <button
                                className="ms-2 btn"
                                style={{
                                    border: "1px solid #195A00",
                                    color: "#195A00",
                                }}
                            >
                                Place a order
                            </button>
                        </div>
                    </div>
                    <div className="topBannerContentImg"
                    >
                        <img
                            src="https://i.ibb.co/BnJQkkx/unsplash-IGf-IGP5-ONV0.png"
                            alt=""
                            className="img-fluid"
                            style={{ height: "100%", width: "100%" }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopBanner;
