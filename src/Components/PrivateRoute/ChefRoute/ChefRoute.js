import React, { useContext, useEffect } from "react";
import { SharedData } from "../../SharedData/SharedContext";
import { Navigate, useLocation } from "react-router-dom";
import Spinner from "../../Spinner/Spinner";

const ChefRoute = ({ children }) => {
    const { user, loading, setUser } = useContext(SharedData);
    const location = useLocation();
    useEffect(() => {
        if (!loading && (user?.role !== "admin" && user?.role !== "chef")) {
            setUser(null);
        }
    }, [loading, user]);

    if (loading) {
        return <Spinner></Spinner>;
    }
    if (user && user?.email) {
        return children;
    }

    return (
        <Navigate to={"/login"} state={{ from: location }} replace></Navigate>
    );
};

export default ChefRoute;
