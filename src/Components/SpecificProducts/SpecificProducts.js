import React, { useContext, useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import "./SpecificProducts.css";
import { SharedData } from "../SharedData/SharedContext";
import useAxiosSecure from "../CustomHook/useAxiosSecure/useAxiosSecure";
import toast from "react-hot-toast";

const SpecificProducts = () => {
    const loaderData = useLoaderData();
    const [allData, setAllData] = useState([...loaderData]);
    const [count, setCount] = useState([...Array(allData.length).fill(1)]);
    const { user } = useContext(SharedData);
    const navigate = useNavigate();
    const [axiosSecure] = useAxiosSecure();
    const [dataLoading, setDataLoading] = useState(false);

    useEffect(() => {
        if (user && allData.length > 0) {
            setDataLoading(true);
            axiosSecure
                .post(`/cart-check-from-user?user=${user?.email}`, {
                    category: loaderData[0].category,
                })
                .then((res) => res.data)
                .then((data) => {
                    const tempAllCart = [...allData];
                    tempAllCart.forEach((item, index) => {
                        const findData = data.find(
                            (dataItem) => dataItem.productId === item._id
                        );
                        if (findData) {
                            tempAllCart[index].quantity = findData.quantity;
                            tempAllCart[index].cart = true;
                            tempAllCart[index].cartId = findData._id;
                        } else {
                            tempAllCart[index].cart = false;
                        }
                    });
                    setAllData([...tempAllCart]);
                })
                .catch((error) => {
                    setDataLoading(false);
                    toast.error(error.message);
                });
        }
    }, [user]);

    const handleInc = (item, pos) => {
        const cartStatus = item?.cart ? true : false;

        if (cartStatus) {
            axiosSecure
                .put(`/product-quantity/inc?user=${user?.email}`, {
                    cartId: item.cartId,
                    quantity: item?.quantity + 1,
                })
                .then((res) => res.data)
                .then((data) => {
                    if (data?.modifiedCount >= 1) {
                        const tempAllCart = [...allData];
                        tempAllCart.forEach((element) => {
                            if (element._id === item._id) {
                                element.quantity = item.quantity + 1;
                            }
                        });
                        setAllData([...tempAllCart]);
                    }
                })
                .catch((error) => {
                    toast.error(error.message);
                });
        } else {
            count[pos]++;
            setCount([...count]);
        }
    };

    const handleDec = (item, pos) => {
        const cartStatus = item?.cart ? true : false;

        if (cartStatus) {
            if (item?.quantity === 1) {
                return;
            } else {
                axiosSecure
                    .put(`/product-quantity/dec?user=${user?.email}`, {
                        cartId: item.cartId,
                        quantity: item?.quantity - 1,
                    })
                    .then((res) => res.data)
                    .then((data) => {
                        if (data.modifiedCount >= 1) {
                            const tempAllCart = [...allData];
                            tempAllCart.forEach((element) => {
                                if (element._id === item._id) {
                                    element.quantity = item.quantity - 1;
                                }
                            });
                            setAllData([...tempAllCart]);
                        }
                    })
                    .catch((error) => {
                        toast.error(error?.message);
                    });
            }
        } else {
            if (count[pos] === 1) {
                return;
            }
            count[pos]--;
            setCount([...count]);
        }
    };

    const handleSearch = (data) => {
        console.log(data);
    };

    const handleAddCart = (item, quantity) => {
        if (!user) {
            navigate("/login", { replace: true });
        } else {
            let temp = { ...item, quantity: quantity, user: user?.email };
            temp.productId = item?._id;
            delete temp._id;
            delete temp.cart;
            axiosSecure
                .post(`/add-cart?user=${user}`, {
                    ...temp,
                })
                .then((res) => res.data)
                .then((data) => {
                    if (data?.cartId) {
                        const tempAllCart = [...allData];
                        tempAllCart.forEach((element) => {
                            if (element._id === item._id) {
                                element.cart = true;
                                element.cartId = data.cartId;
                                element.quantity = quantity;
                            }
                        });
                        setAllData([...tempAllCart]);
                        toast.success("Cart added successfully");
                    }
                })
                .catch((error) => {
                    toast.error(error.message);
                });
        }
    };
    const handleRemoveCart = (item) => {
        axiosSecure.delete(`/remove-cart?user=${user?.email}`, {
            data: {
                productId: item.cartId,
                user: user?.email,
            },
        })
        .then(res=>res.data)
        .then(data=>{
            if(data.deletedCount>=1){
                let tempAllCart = [...allData];
                tempAllCart.forEach((element)=>{
                    if(element.cartId===item.cartId){
                        element.cart= false;
                        delete element.cartId;
                        delete element.quantity;
                    }
                })
                setAllData([...tempAllCart]);
                toast.success("Cart removed successfully");
            }
        })
        .catch(error=>{
            toast.error(error.message);
        })
    };

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-center mb-5">
                <div className="">
                    <input
                        type="text"
                        className="form-control "
                        style={{ width: "400px" }}
                        autoCorrect="off"
                        placeholder="Search..."
                        id="search-input"
                        autoComplete="off"
                    />
                </div>
                <div className="ms-2">
                    <button
                        className="searchBtn btn"
                        onClick={() =>
                            handleSearch(
                                document.querySelector("#search-input").value
                            )
                        }
                    >
                        Search
                    </button>
                </div>
            </div>
            <div
                style={{
                    backgroundImage: `url(https://i.ibb.co/CmKwQHR/drawing.png)`,
                    height: "100vh",
                    overflow: "auto",
                    overflowX: "hidden",
                    overflowY: "auto",
                }}
            >
                {allData.length === 0 ? (
                    <div style={{ height: "100%", width: "100%" }}>
                        <img
                            src="https://i.ibb.co/f9TPssj/NoData.png"
                            alt=""
                            style={{ height: "100%", width: "100%" }}
                        />
                    </div>
                ) : (
                    <div className="productSpecific">
                        <div className="row productSpecificRow g-3">
                            {allData.map((item, index) => (
                                <div
                                    className="col-12 col-sm-12 col-md-12 col-lg-12"
                                    key={index}
                                >
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-6 col-sm-6 col-md-6 col-lg-6">
                                                    <div
                                                        style={{
                                                            height: "130px",
                                                            width: "280px",
                                                        }}
                                                    >
                                                        <img
                                                            src={item?.imgLink}
                                                            alt=""
                                                            className="img-fluid"
                                                            style={{
                                                                borderRadius:
                                                                    "10px",
                                                                height: "100%",
                                                                width: "100%",
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-6 col-sm-6 col-md-6 col-lg-6">
                                                    <h5 className="fw-bold">
                                                        {item?.title}
                                                    </h5>
                                                    <div className="d-flex">
                                                        <button
                                                            className="border border-0 p-1"
                                                            style={{
                                                                height: "30px",
                                                                width: "30px",
                                                            }}
                                                            onClick={() =>
                                                                handleDec(
                                                                    item,
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            <i className="bi bi-dash fs-6"></i>
                                                        </button>
                                                        <div className="input-field">
                                                            {item?.quantity ||
                                                                count[index]}
                                                        </div>
                                                        <button
                                                            className="border border-0 p-1"
                                                            style={{
                                                                height: "30px",
                                                                width: "30px",
                                                            }}
                                                            onClick={() =>
                                                                handleInc(
                                                                    item,
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            <i className="bi bi-plus fs-6"></i>
                                                        </button>
                                                    </div>
                                                    <div className="text-success mt-1">
                                                        Price: {item?.price}
                                                    </div>
                                                    {item?.cart ? (
                                                        <button
                                                            className="btn btn-danger btn-sm me-2 border border-0"
                                                            onClick={() =>
                                                                handleRemoveCart(
                                                                    item
                                                                )
                                                            }
                                                        >
                                                            Remove from cart
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="btn btn-sm btn-primary me-2 border border-0"
                                                            onClick={() =>
                                                                handleAddCart(
                                                                    item,
                                                                    count[index]
                                                                )
                                                            }
                                                        >
                                                            Add cart
                                                        </button>
                                                    )}

                                                    <button
                                                        className="btn btn-sm btn-warning border border-0"
                                                        onClick={() =>
                                                            navigate(
                                                                `/product-details/${item._id}`
                                                            )
                                                        }
                                                    >
                                                        View details
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SpecificProducts;
