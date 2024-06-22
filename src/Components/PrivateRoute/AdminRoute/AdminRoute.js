import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Spinner from '../../Spinner/Spinner';
import { SharedData } from '../../SharedData/SharedContext';

const AdminRoute = ({children}) => {
    const {user, loading}= useContext(SharedData);
    const location = useLocation();

    if(loading){
        return <Spinner></Spinner>
    }

    if(user && user?.role==="admin"){
        return children;
    }

    return <Navigate to={'/login'} state={{from: location}} replace></Navigate>
};

export default AdminRoute;