import React, { useContext } from "react";
import { SharedData } from "../../SharedData/SharedContext";
import { Navigate, useLocation } from "react-router-dom";
import Spinner from "../../Spinner/Spinner";

const ChefRoute = ({ children }) => {
    const { user, loading } = useContext(SharedData);
    const location = useLocation();

    if (loading) {
        return <Spinner></Spinner>;
    }
    if (user && user?.role === "chef") {
        return children;
    }

    return (
        <Navigate to={"/login"} state={{ from: location }} replace></Navigate>
    );
};

export default ChefRoute;
