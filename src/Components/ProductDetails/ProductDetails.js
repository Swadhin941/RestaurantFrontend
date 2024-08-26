import React, { useContext, useEffect, useState } from "react";
import {
    Navigate,
    useLoaderData,
    useLocation,
    useNavigate,
    useNavigation,
} from "react-router-dom";
import Spinner from "../Spinner/Spinner";
import "./ProductDetails.css";
import toast from "react-hot-toast";
import { SharedData } from "../SharedData/SharedContext";
import useAxiosSecure from "../CustomHook/useAxiosSecure/useAxiosSecure";

const ProductDetails = () => {
    const [quantityCounter, setQuantityCounter] = useState(1);
    const { user } = useContext(SharedData);
    const [axiosSecure] = useAxiosSecure();
    const loaderData = useLoaderData();
    const [detailsData, setDetailsData] = useState({ ...loaderData });
    const navigation = useNavigation();
    const location = useLocation();
    const navigate = useNavigate();
    const [dataLoading, setDataLoading] = useState(false);
    const handleIncClick = () => {
        const cartStatus = detailsData.cart ? true : false;
        if (cartStatus) {
            axiosSecure
                .put(`/product-quantity/inc?user=${user?.email}`, {
                    cartId: detailsData.cartId,
                    quantity: detailsData?.quantity + 1,
                })
                .then((res) => res.data)
                .then((data) => {
                    if (data?.modifiedCount >= 1) {
                        setDetailsData({
                            ...detailsData,
                            quantity: parseInt(detailsData?.quantity) + 1,
                        });
                    }
                })
                .catch((error) => {
                    toast.error(error.message);
                });
        } else {
            setQuantityCounter(quantityCounter + 1);
        }
    };

    useEffect(() => {
        if(user && detailsData._id){
            axiosSecure.post(`/cart-check?user=${user?.email}`,{
                productId: detailsData._id,
                category: detailsData.category,
            })
            .then(res=>res.data)
            .then(data=>{
                if(data?.cartId){
                    setDetailsData({...detailsData, cartId: data?.cartId, quantity: data?.quantity, cart: true});
                }
            })
            .catch(error=>{
                toast.error(error.message);
            })
        }
    }, [user]);

    const handleDecClick = () => {
        const cartStatus = detailsData.cart ? true : false;
        if (cartStatus) {
            if (detailsData?.quantity === 1) {
                toast.error("Quantity cannot be less than 1");
                return;
            } else {
                axiosSecure
                    .put(`/product-quantity/dec?user=${user?.email}`, {
                        cartId: detailsData.cartId,
                        quantity: detailsData?.quantity - 1,
                    })
                    .then((res) => res.data)
                    .then((data) => {
                        if (data.modifiedCount >= 1) {
                            setDetailsData({
                                ...detailsData,
                                quantity: detailsData?.quantity - 1,
                            });
                        }
                    })
                    .catch((error) => {
                        toast.error(error?.message);
                    });
            }
        } else {
            if (quantityCounter === 1) {
                toast.error("Quantity cannot be less than 1");
                return;
            } else {
                setQuantityCounter(quantityCounter - 1);
            }
        }
    };

    if (navigation?.state === "loading") {
        return <Spinner></Spinner>;
    }

    const handleCart = () => {
        if (!user) {
            navigate("/login", { replace: true });
        } else {
            let temp = {
                ...detailsData,
                quantity: quantityCounter,
                user: user?.email,
            };
            temp.productId= detailsData?._id;
            delete temp._id;
            axiosSecure
                .post(`/add-cart?user=${user}`, {
                    ...temp,
                })
                .then((res) => res.data)
                .then((data) => {
                    if (data?.cartId) {
                        setDetailsData({
                            ...detailsData,
                            cart: true,
                            cartId: data.cartId,
                            quantity: quantityCounter,
                        });
                    }
                })
                .catch((error) => {
                    toast.error("Failed to add product to cart");
                });
        }
    };

    const handleRemoveCart = () => {
        axiosSecure
            .delete(`/remove-cart?user=${user?.email}`, {
                data: {
                    productId: detailsData?.cartId,
                    user: user?.email,
                },
            })
            .then((res) => res.data)
            .then((data) => {
                if (data.deletedCount >= 1) {
                    const temp = { ...detailsData, cart: false };
                    setDetailsData(temp);
                    toast.success("Product removed from cart successfully");
                }
            })
            .catch((error) => {
                toast.error(error.message);
            });
    };

    return (
        <div className="container-fluid mb-3">
            <div className="row">
                <div className="col-sm-12 col-md-6 col-lg-4">
                    <img
                        src={detailsData?.imgLink}
                        alt={detailsData?.title}
                        className="img-fluid"
                    />
                </div>
                <div className="col-sm-12 col-md-6 col-lg-8">
                    <h1>{detailsData?.title}</h1>
                    <p>{detailsData?.description}</p>
                    <p style={{ fontWeight: "600", color: "green" }}>
                        Price: {detailsData?.price} Taka
                    </p>
                    <div>
                        <div className="d-flex">
                            <div>
                                <span>Quantity:</span>
                            </div>
                            <div className="d-flex" style={{}}>
                                <div
                                    className="div-dash"
                                    onClick={() => handleDecClick()}
                                >
                                    <i className="bi bi-dash"></i>
                                </div>
                                <div className="input-field">
                                    {detailsData?.quantity || quantityCounter}
                                </div>
                                <div
                                    className="div-plus"
                                    onClick={() => handleIncClick()}
                                >
                                    <i className="bi bi-plus"></i>
                                </div>
                            </div>
                        </div>
                        <div className="my-3">
                            {detailsData?.cart === true ? (
                                <button
                                    className="btn btn-warning"
                                    onClick={handleRemoveCart}
                                >
                                    Remove from cart
                                </button>
                            ) : (
                                <button
                                    className="btn btn-primary"
                                    onClick={handleCart}
                                >
                                    Add to Cart
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
