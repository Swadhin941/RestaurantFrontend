import React, { useContext, useEffect, useState } from "react";
import { SharedData } from "../SharedData/SharedContext";
import useAxiosSecure from "../CustomHook/useAxiosSecure/useAxiosSecure";
import toast from "react-hot-toast";
import "./Cart.css";
import ConfirmModal from "../Modals/ConfirmModal/ConfirmModal";
import { useNavigate } from "react-router-dom";
import useTitle from "../CustomHook/useTitle/useTitle";

const Cart = () => {
    useTitle("Cart - Foodie");
    const [allCart, setAllCart] = useState([]);
    const { user } = useContext(SharedData);
    const [axiosSecure] = useAxiosSecure();
    const [dataLoading, setDataLoading] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [selectedToDelete, setSelectedToDelete] = useState(null);
    const [deleteState, setDeleteState] = useState(false);
    const [reload, setReload]= useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (deleteState) {
            axiosSecure
                .delete(`/remove-cart?user=${user?.email}`, {
                    data: {
                        productId: selectedToDelete,
                        user: user?.email,
                    },
                })
                .then((res) => res.data)
                .then((data) => {
                    if (data.deletedCount >= 1) {
                        const temp = allCart.filter(
                            (cartItem) => cartItem._id !== selectedToDelete
                        );
                        setAllCart(temp);
                        toast.success("Product removed from cart successfully");
                        setDeleteState(false);
                        setSelectedToDelete(null);
                        setReload(!reload);
                    }
                })
                .catch((error) => {
                    toast.error(error?.message);
                });
        }
    }, [deleteState]);

    useEffect(() => {
        if (user) {
            setDataLoading(true);
            axiosSecure
                .get(`/all-cart?user=${user?.email}`)
                .then((res) => res.data)
                .then((data) => {
                    if (data.length > 0) {
                        let tempPrice = 0;
                        data.forEach((item) => {
                            tempPrice += item.price * item.quantity;
                        });
                        setTotalPrice(tempPrice);
                        setAllCart([...data]);
                        setDataLoading(false);
                    }
                })
                .catch((error) => {
                    setDataLoading(false);
                    toast.error(error?.message);
                });
        }
    }, [user, reload]);

    const handleInc = (item) => {
        axiosSecure
            .put(`/product-quantity/inc?user=${user?.email}`, {
                cartId: item._id,
                quantity: item?.quantity + 1,
            })
            .then((res) => res.data)
            .then((data) => {
                if (data.modifiedCount >= 1) {
                    const temp = [...allCart];
                    temp.forEach((updateData) => {
                        if (updateData._id === item._id) {
                            updateData.quantity += 1;
                            setTotalPrice(totalPrice + item.price);
                        }
                    });
                    setAllCart(temp);
                }
            })
            .catch((error) => {
                toast.error(error?.message);
            });
    };
    const handleDec = (item) => {
        if (parseInt(item.quantity) === 1) {
            toast.error("Cannot decrement quantity to less than 1");
            return;
        }
        axiosSecure
            .put(`/product-quantity/dec?user=${user?.email}`, {
                cartId: item._id,
                quantity: item?.quantity - 1,
            })
            .then((res) => res.data)
            .then((data) => {
                if (data.modifiedCount >= 1) {
                    const temp = [...allCart];
                    temp.forEach((updateData) => {
                        if (updateData._id === item._id) {
                            updateData.quantity -= 1;
                            setTotalPrice(totalPrice - item.price);
                        }
                    });
                    setAllCart(temp);
                }
            })
            .catch((error) => {
                toast.error(error?.message);
            });
    };

    const handleCheckout= (item)=>{
        axiosSecure.post(`/api/payment?user=${user?.email}`,{
            allItem: [...item],
            totalAmount: totalPrice,
            timeInMill: Date.now(),
            dateString: new Date().toLocaleDateString(),
            currentMonth: new Date().toLocaleString("default",{month: "long"}),
            user: user?.email
        })
        .then(res=>res.data)
        .then(data=>{
            if(data?.url){
                window.location.replace(data.url);
            }
        })
        .catch(error=>{
            toast.error(error?.message);
        })
    }

    return (
        <div className="container-fluid">
            {allCart.length === 0 ? (
                <div style={{ height: "100vh", width: "100%" }}>
                    <img
                        src="https://i.ibb.co/f9TPssj/NoData.png"
                        alt=""
                        style={{ height: "100%", width: "100%" }}
                    />
                </div>
            ) : (
                <div>
                    <div style={{ height: "100vh", overflow:"auto", overflowX:"hidden", overflowY:"auto" }}>
                        <div className="row g-2">
                            {allCart.map((item, index) => (
                                <div
                                    className="col-12 col-sm-12 col-md-12 col-lg-12"
                                    key={index}
                                >
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-4 col-sm-4 col-md-5 col-lg-4">
                                                    <div
                                                        style={{
                                                            height: "auto",
                                                            width: "auto",
                                                        }}
                                                    >
                                                        <img
                                                            src={item?.imgLink}
                                                            alt=""
                                                            style={{
                                                                height: "200px",
                                                                width: "100%",
                                                                borderRadius:
                                                                    "10px",
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-8 col-sm-8 col-md-7 col-lg-8">
                                                    <h5
                                                        style={{
                                                            fontWeight: "600",
                                                        }}
                                                    >
                                                        {item?.title}
                                                    </h5>
                                                    <p className="my-0">
                                                        {item?.description.slice(
                                                            0,
                                                            200
                                                        )}
                                                        ...
                                                    </p>
                                                    <span
                                                        className="d-block text-success"
                                                        style={{
                                                            fontWeight: "600",
                                                        }}
                                                    >
                                                        Price: {item?.price}
                                                    </span>
                                                    <div className="d-flex mt-3">
                                                        <div
                                                            className="btn btn-light btn-sm"
                                                            onClick={() =>
                                                                handleDec(item)
                                                            }
                                                        >
                                                            <i className="bi bi-dash"></i>
                                                        </div>
                                                        <div
                                                            className="mx-2 d-flex justify-content-center"
                                                            style={{
                                                                width: "80px",
                                                                height: "30px",
                                                                border: "1px solid black",
                                                            }}
                                                        >
                                                            {item?.quantity}
                                                        </div>
                                                        <div
                                                            className="btn btn-light btn-sm"
                                                            onClick={() =>
                                                                handleInc(item)
                                                            }
                                                        >
                                                            <i className="bi bi-plus"></i>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="d-flex mt-2 justify-content-center"
                                                        style={{
                                                            width: "160px",
                                                        }}
                                                    >
                                                        <button
                                                            className="btn btn-sm btn-light"
                                                            data-bs-target="#ConfirmModal"
                                                            data-bs-toggle="modal"
                                                            onClick={() =>
                                                                setSelectedToDelete(
                                                                    item._id
                                                                )
                                                            }
                                                        >
                                                            <i className="bi bi-trash-fill"></i>
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-light ms-4"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/product-details/${item?.productId}`
                                                                )
                                                            }
                                                        >
                                                            <i className="bi bi-eye"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="d-flex justify-content-end mb-2">
                        <div className="me-5">
                            <h2
                                style={{
                                    fontFamily: `"New Amsterdam", sans-serif`,
                                }}
                            >
                                Total:{" "}
                                <span style={{ color: "green" }}>
                                    {totalPrice} Taka
                                </span>
                            </h2>
                            <button className="btn btn-primary w-100" onClick={()=>handleCheckout(allCart)}>
                                Checkout
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal setDeleteState={setDeleteState}></ConfirmModal>
        </div>
    );
};

export default Cart;
