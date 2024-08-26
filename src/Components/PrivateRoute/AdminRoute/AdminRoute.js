import React, { useContext, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Spinner from "../../Spinner/Spinner";
import { SharedData } from "../../SharedData/SharedContext";

const AdminRoute = ({ children }) => {
    const { user, loading, setUser } = useContext(SharedData);
    const location = useLocation();

    useEffect(()=>{
        if(!loading && user?.role!=='admin'){
            setUser(null);
        }
    },[loading, user])

    if (loading) {
        return <Spinner></Spinner>;
    }

    if (user && user?.role === "admin") {
        return children;
    }

    return (
        <Navigate to={"/login"} state={{ from: location }} replace></Navigate>
    );
};

export default AdminRoute;
