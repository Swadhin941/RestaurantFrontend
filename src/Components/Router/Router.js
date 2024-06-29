import { createBrowserRouter } from "react-router-dom";
import Root from "../Layout/Root";
import Home from "../Home/Home/Home";
import Admin from "../Layout/Admin";
import AdminDashboard from "../AdminDashboard/AdminDashboard";
import AddItem from "../AddItem/AddItem";
import Login from "../Login/Login";
import Register from "../Register/Register";
import AllProducts from "../AllProducts/AllProducts";
import PageNotFound from "../PageNotFound/PageNotFound";
import Forbidden from "../Forbidden/Forbidden";
import AdminRoute from "../PrivateRoute/AdminRoute/AdminRoute";
const Router = createBrowserRouter([
    {
        path: "/",
        element: <Root></Root>,
        children: [
            {
                path: "/",
                element: <Home></Home>,
            },
            {
                path: "/login",
                element: <Login></Login>,
            },
            {
                path: "/register",
                element: <Register></Register>,
            },
        ],
    },
    {
        path: "/admin",
        element: (
            <AdminRoute>
                <Admin></Admin>,
            </AdminRoute>
        ),
        children: [
            {
                path: "/admin/",
                element: (
                    <AdminRoute>
                        <AdminDashboard></AdminDashboard>
                    </AdminRoute>
                ),
            },
            {
                path: "/admin/add-item",
                element: (
                    <AdminRoute>
                        <AddItem></AddItem>,
                    </AdminRoute>
                ),
            },
            {
                path: "/admin/all-products",
                element: <AdminRoute><AllProducts></AllProducts></AdminRoute>,
            },
        ],
    },
    {
        path: "*",
        element: <PageNotFound></PageNotFound>,
    },
    {
        path: "/forbidden",
        element: <Forbidden></Forbidden>,
    },
]);

export default Router;
