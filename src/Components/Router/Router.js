import { createBrowserRouter } from "react-router-dom";
import Root from "../Layout/Root";
import Home from "../Home/Home/Home";
import Admin from "../Layout/Admin";
import AdminDashboard from "../AdminDashboard/AdminDashboard";
import AddItem from "../AddItem/AddItem";
import Login from "../Login/Login";
import Register from "../Register/Register";
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
                element: <Login></Login>
            },
            {
                path: "/register",
                element: <Register></Register>
            }
        ],
    },
    {
        path: "/admin",
        element: <Admin></Admin>,
        children: [
            {
                path: "/admin/",
                element: <AdminDashboard></AdminDashboard>
            },
            {
                path: "/admin/add-item",
                element: <AddItem></AddItem>
            }
        ],
    },
]);

export default Router;
