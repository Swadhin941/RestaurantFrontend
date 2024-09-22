import { createBrowserRouter } from "react-router-dom";
import Root from "../Layout/Root";
import Home from "../Home/Home/Home";
import Admin from "../Layout/Admin";
import AdminDashboard from "../AdminDashboard/AdminDashboard";
import Login from "../Login/Login";
import Register from "../Register/Register";
import AllProducts from "../AllProducts/AllProducts";
import PageNotFound from "../PageNotFound/PageNotFound";
import Forbidden from "../Forbidden/Forbidden";
import AdminRoute from "../PrivateRoute/AdminRoute/AdminRoute";
import ProductDetails from "../ProductDetails/ProductDetails";
import { ServerUrl } from "../ServerUrl/ServerUrl";
import SpecificProducts from "../SpecificProducts/SpecificProducts";
import Cart from "../ Cart/Cart";
import PrivateRoute from "../PrivateRoute/PrivateRoute/PrivateRoute";
import Profile from "../Profile/Profile";
import ErrorPage from "../ErrorPage/ErrorPage";
import AllUsers from "../AllUsers/AllUsers";
import AllOrder from "../AllOrder/AllOrder";
import AllDelivered from "../AllDelivered/AllDelivered";
import ChefRoute from "../PrivateRoute/ChefRoute/ChefRoute";
const Router = createBrowserRouter([
    {
        path: "/",
        element: <Root></Root>,
        errorElement: <ErrorPage></ErrorPage>,
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
            {
                path: "/product-details/:id",
                element: <ProductDetails></ProductDetails>,
                loader: async ({ params }) => {
                    return fetch(`${ServerUrl}/product-details/${params.id}`);
                },
            },
            {
                path: "/specific-category/:name",
                element: <SpecificProducts></SpecificProducts>,
                loader: async ({ params }) => {
                    return fetch(`${ServerUrl}/get-products`, {
                        method: "POST",
                        headers: {
                            "content-type": "application/json",
                        },
                        body: JSON.stringify({
                            category: params.name,
                        }),
                    });
                },
            },
            {
                path: "/cart",
                element: (
                    <PrivateRoute>
                        <Cart></Cart>
                    </PrivateRoute>
                ),
            },
            {
                path: "/my-profile",
                element: (
                    <PrivateRoute>
                        <Profile></Profile>
                    </PrivateRoute>
                ),
            },
        ],
    },
    {
        path: "/admin",
        element: <Admin></Admin>,
        errorElement: <ErrorPage></ErrorPage>,
        children: [
            {
                path: "/admin/dashboard",
                element: <AdminDashboard></AdminDashboard>,
            },
            {
                path: "/admin/all-products",
                element: (
                    <AdminRoute>
                        <AllProducts></AllProducts>
                    </AdminRoute>
                ),
            },
            {
                path: "/admin/all-users",
                element: (
                    <AdminRoute>
                        <AllUsers></AllUsers>
                    </AdminRoute>
                ),
            },
            {
                path: "/admin/",
                element: (
                    <ChefRoute>
                        <AllOrder></AllOrder>
                    </ChefRoute>
                ),
            },
            {
                path: "/admin/all-delivered",
                element: (
                    <ChefRoute>
                        <AllDelivered></AllDelivered>
                    </ChefRoute>
                ),
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
