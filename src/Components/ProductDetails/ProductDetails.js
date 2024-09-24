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
import FeedbackModal from "../Modals/FeedbackModal/FeedbackModal";
import EditCommentModal from "../Modals/EditCommentModal/EditCommentModal";
import ConfirmModal from "../Modals/ConfirmModal/ConfirmModal";

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
    const [feedbackData, setFeedbackData] = useState(null);
    const [allFeedback, setAllFeedback] = useState([]);
    const [reload, setReload] = useState(true);
    const [commentEdit, setCommentEdit] = useState(null);
    const [deleteState, setDeleteState] = useState(false);
    const [deleteFeedback, setDeleteFeedback] = useState(null);

    useEffect(() => {
        if (loaderData?._id) {
            axiosSecure
                .post("/specific-products-rating", {
                    productId: loaderData._id,
                })
                .then((res) => res.data)
                .then((data) => {
                    if (data) {
                        const temp = { ...loaderData, ...data };
                        setDetailsData(temp);
                    }
                })
                .catch((error) => {
                    toast.error(error.message);
                });
        }
    }, [loaderData, reload]);

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
        setDataLoading(true);
        axiosSecure
            .get(`/feedback/all?productId=${loaderData._id}`)
            .then((res) => res.data)
            .then((data) => {
                setDataLoading(false);
                setAllFeedback(data);
            })
            .catch((error) => {
                setDataLoading(false);
                toast.error(error.message);
            });
    }, [reload]);

    useEffect(() => {
        if (user && detailsData._id) {
            axiosSecure
                .post(`/cart-check?user=${user?.email}`, {
                    productId: detailsData._id,
                    category: detailsData.category,
                })
                .then((res) => res.data)
                .then((data) => {
                    if (data?.cartId) {
                        setDetailsData({
                            ...detailsData,
                            cartId: data?.cartId,
                            quantity: data?.quantity,
                            cart: true,
                        });
                    }
                })
                .catch((error) => {
                    toast.error(error.message);
                });
        }
    }, [user]);

    useEffect(() => {
        if (user && loaderData) {
            axiosSecure
                .post(`/feedback/user-product-check?user=${user?.email}`, {
                    productId: loaderData._id,
                })
                .then((res) => res.data)
                .then((data) => {
                    const temp = { ...detailsData, purchased: data.purchase };
                    setDetailsData(temp);
                })
                .catch((error) => {
                    toast.error(error.message);
                });
        }
    }, [user, loaderData]);

    useEffect(() => {
        if (feedbackData) {
            const data = {
                ...feedbackData,
                productId: loaderData._id,
                timeInMill: Date.now(),
                date: `${
                    new Date().getDate().toString() +
                    " " +
                    new Date()
                        .toLocaleDateString("default", { month: "long" })
                        .toString() +
                    " " +
                    new Date().getFullYear().toString()
                }`,
                reactions: [],
            };
            axiosSecure
                .post(`/feedback/post?user=${user?.email}`, {
                    ...data,
                })
                .then((res) => res.data)
                .then((data) => {
                    if (data.acknowledged) {
                        const temp = [{ ...data }, ...allFeedback];
                        setAllFeedback(temp);
                        setReload(!reload);
                    }
                })
                .catch((error) => {
                    toast.error(error.message);
                });
        }
    }, [user, feedbackData]);

    useEffect(() => {
        if (deleteState) {
            axiosSecure
                .delete(
                    `/feedback/delete?user=${user?.email}&deleteId=${deleteFeedback}`
                )
                .then((res) => res.data)
                .then((data) => {
                    console.log(data);
                    if (data.deletedCount >= 1) {
                        setDeleteState(false);
                        setDeleteFeedback(null);
                        toast.success("Deleted successfully");
                        setReload(!reload);
                    }
                })
                .catch((error) => {
                    toast.error(error.message);
                    setDeleteState(false);
                    setDeleteFeedback(null);
                });
        }
    }, [deleteState]);

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
            temp.productId = detailsData?._id;
            delete temp._id;
            axiosSecure
                .post(`/add-cart?user=${user?.email}`, {
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
                    {(detailsData.avgRating * 10) % 10 === 0 ? (
                        <div className="">
                            {[...Array(5).keys()].map((rating, ratingIndex) => (
                                <i
                                    className={`bi bi-star-fill ${
                                        detailsData.avgRating <= ratingIndex + 1
                                            ? "text-secondary"
                                            : "text-warning"
                                    }`}
                                    key={ratingIndex}
                                ></i>
                            ))}
                            <small>
                                ({detailsData.totalUserRating || "0"})
                            </small>
                        </div>
                    ) : (
                        <div className="">
                            {[...Array(5).keys()].map((rating, ratingIndex) => (
                                <i
                                    className={`bi ${
                                        ratingIndex +
                                            1 -
                                            parseInt(detailsData.avgRating) ===
                                        1
                                            ? "bi-star-half"
                                            : "bi-star-fill"
                                    } ${
                                        ratingIndex +
                                            1 -
                                            parseInt(detailsData.avgRating) <=
                                        1
                                            ? "text-warning"
                                            : "text-secondary"
                                    }`}
                                    key={ratingIndex}
                                ></i>
                            ))}
                            <small className="text-dark fs-6 ms-1">
                                ({detailsData?.totalUsersRating || "0"})
                            </small>
                        </div>
                    )}
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
                                <>
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleCart}
                                    >
                                        Add to Cart
                                    </button>
                                    {detailsData?.purchased && (
                                        <button
                                            className="btn btn-success ms-2"
                                            data-bs-target="#FeedbackModal"
                                            data-bs-toggle="modal"
                                        >
                                            Leave feedback
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mt-2">
                {dataLoading ? (
                    <Spinner></Spinner>
                ) : (
                    allFeedback.map((item, index) => (
                        <div
                            className="col-12 col-sm-12 col-md-12 col-lg-12"
                            key={index}
                        >
                            <div className="card ps-2">
                                <div className="d-flex">
                                    <div
                                        style={{
                                            height: "30px",
                                            width: "30px",
                                            borderRadius: "50%",
                                        }}
                                    >
                                        <img
                                            src={
                                                item?.imgLink
                                                    ? item.imgLink
                                                    : "https://i.ibb.co/bmVqbdY/empty-person.jpg"
                                            }
                                            alt=""
                                            className="img-fluid"
                                        />
                                    </div>
                                    <div className="ms-2 w-100">
                                        <div className="d-flex justify-content-between">
                                            <h6 className="text-primary mb-0">
                                                {user?.email === item.email
                                                    ? "You"
                                                    : item.fullName}
                                            </h6>
                                            <div className="d-flex me-2">
                                                <small className="pe-2 text-success fw-bold">
                                                    {item.date}
                                                </small>
                                                {(user?.role === "admin" ||
                                                    item.email ===
                                                        user?.email) && (
                                                    <div className="dropdown">
                                                        <i
                                                            className="bi bi-three-dots-vertical dropdown-toggle"
                                                            data-bs-toggle="dropdown"
                                                        ></i>

                                                        <ul className="dropdown-menu">
                                                            {item.email ===
                                                                user?.email && (
                                                                <li>
                                                                    <p
                                                                        className="dropdown-item"
                                                                        onClick={() =>
                                                                            setCommentEdit(
                                                                                {
                                                                                    email: user?.email,
                                                                                    id: item._id,
                                                                                }
                                                                            )
                                                                        }
                                                                        data-bs-target="#EditCommentModal"
                                                                        data-bs-toggle="modal"
                                                                    >
                                                                        Edit
                                                                    </p>
                                                                </li>
                                                            )}

                                                            <li
                                                                data-bs-target="#ConfirmModal"
                                                                data-bs-toggle="modal"
                                                                onClick={() =>
                                                                    setDeleteFeedback(
                                                                        item._id
                                                                    )
                                                                }
                                                            >
                                                                <p className="dropdown-item">
                                                                    Delete
                                                                </p>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div>{item.message}</div>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-end">
                                    {(item.ratingValue * 10) % 10 === 0 ? (
                                        <div className="pe-2">
                                            {[...Array(5).keys()].map(
                                                (rating, ratingIndex) => (
                                                    <i
                                                        className={`bi bi-star-fill ${
                                                            item.ratingValue <=
                                                            ratingIndex + 1
                                                                ? "text-secondary"
                                                                : "text-warning"
                                                        }`}
                                                        key={ratingIndex}
                                                    ></i>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <div className="pe-2">
                                            {[...Array(5).keys()].map(
                                                (rating, ratingIndex) => (
                                                    <i
                                                        className={`bi ${
                                                            ratingIndex +
                                                                1 -
                                                                parseInt(
                                                                    item.ratingValue
                                                                ) ===
                                                            1
                                                                ? "bi-star-half"
                                                                : "bi-star-fill"
                                                        } ${
                                                            ratingIndex +
                                                                1 -
                                                                parseInt(
                                                                    item.ratingValue
                                                                ) <=
                                                            1
                                                                ? "text-warning"
                                                                : "text-secondary"
                                                        }`}
                                                        key={ratingIndex}
                                                    ></i>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <EditCommentModal
                commentEdit={commentEdit}
                reload={reload}
                setReload={setReload}
            ></EditCommentModal>
            <FeedbackModal setFeedbackData={setFeedbackData}></FeedbackModal>
            <ConfirmModal setDeleteState={setDeleteState}></ConfirmModal>
        </div>
    );
};

export default ProductDetails;
