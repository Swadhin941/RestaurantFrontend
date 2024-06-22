import React from 'react';
import FadeLoader from "react-spinners/FadeLoader";

const Spinner = () => {
    return (
        <div
            className="container-fluid d-flex justify-content-center align-items-center"
            style={{ height: "100vh" }}
        >
            <FadeLoader color="black"  />
        </div>
    );
};

export default Spinner;