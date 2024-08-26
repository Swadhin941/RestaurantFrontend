import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
    const navigate = useNavigate();
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12 col-md-12 col-lg-12">
                    <p className="text-center">Something went wrong!</p>
                    <div className="d-flex justify-content-center">
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate(-1, { replace: true })}
                        >
                            Go back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
