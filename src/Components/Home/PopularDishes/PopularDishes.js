import React, { useContext, useEffect, useState } from "react";
import useAxiosSecure from "../../CustomHook/useAxiosSecure/useAxiosSecure";
import toast from "react-hot-toast";
import "./PopularDishes.css";
import Spinner from "../../Spinner/Spinner";
import { useNavigate } from "react-router-dom";
import { SharedData } from "../../SharedData/SharedContext";
import { Carousel } from "primereact/carousel";

const PopularDishes = () => {
    const [popularDishes, setPopularDishes] = useState([]);
    const [axiosSecure] = useAxiosSecure();
    const [positionCount, setPositionCount] = useState(1);
    const [dataLoading, setDataLoading] = useState(false);
    const [loadMore, setLoadMore] = useState(false);
    const { user } = useContext(SharedData);
    const navigate = useNavigate();

    const responsiveOptions = [
        {
            breakpoint: "1400px",
            numVisible: 2,
            numScroll: 1,
        },
        {
            breakpoint: "1199px",
            numVisible: 3,
            numScroll: 1,
        },
        {
            breakpoint: "767px",
            numVisible: 2,
            numScroll: 1,
        },
        {
            breakpoint: "575px",
            numVisible: 1,
            numScroll: 1,
        },
    ];

    useEffect(() => {
        setDataLoading(true);
        axiosSecure
            .get(`/top-products?user=${user?.email}`)
            .then((res) => res.data)
            .then((data) => {
                setPopularDishes(data);
                setDataLoading(false);
            })
            .catch((error) => {
                toast.error(error.message);
                setDataLoading(false);
            });
    }, [user]);

    const handleCart = (cartData) => {
        if (!user) {
            navigate("/login", { replace: true });
        } else {
            const temp = {
                ...cartData,
                user: user?.email,
                productId: cartData._id,
                quantity: 1,
            };
            delete temp._id;
            delete temp.cartStatus;
            delete temp.ratingValue;
            delete temp.totalRatings;
            console.log(temp);
            axiosSecure
                .post(`/add-cart?user=${user?.email}`, {
                    ...temp,
                })
                .then((res) => res.data)
                .then((data) => {
                    const temp = [...popularDishes];
                    temp.forEach((dish)=>{
                        if(dish._id=== cartData._id){
                            dish.cartStatus= !dish.cartStatus;
                            dish.cartId= data.cartId;
                        }
                    })
                    console.log(temp);
                    setPopularDishes(temp);
                })
                .catch((error) => {
                    toast.error(error.message);
                });
        }
    };

    const handleRemoveCart = (cartData) => {
        axiosSecure
            .delete(`/remove-cart?user=${user?.email}`, {
                data: {
                    productId: cartData.cartId,
                    user: user?.email,
                },
            })
            .then((res) => res.data)
            .then((data) => {
                if(data.deletedCount>=1){
                    const temp= [...popularDishes];
                    temp.forEach((dish)=>{
                        if(dish._id===cartData._id){
                            dish.cartStatus=!dish.cartStatus;
                            delete dish.cartId
                        }
                    })
                    console.log(temp);
                    setPopularDishes(temp);
                }
            })
            .catch((error) => {
                toast.error(error.message);
            });
    };

    const productTemplate = (product) => {
        return (
            <div
                className="border border-1 m-2 py-5 px-3"
                style={{ borderRadius: "10px" }}
            >
                <div className="mb-3">
                    <div
                        className="d-flex justify-content-center"
                        style={{ width: "100%" }}
                    >
                        <img
                            src={product?.imgLink}
                            alt={product.title}
                            className="img-fluid"
                            style={{ width: "50%", height: "100px" }}
                        />
                    </div>
                </div>
                <div className="text-center">
                    <h4 className="mb-1">{product.title}</h4>
                    <h6 className="mt-0 mb-3 text-success fw-bold">
                        {product.price} taka
                    </h6>
                    {(product.ratingValue * 10) % 10 === 0 ? (
                        <div className="pe-2">
                            {[...Array(5).keys()].map((rating, ratingIndex) => (
                                <i
                                    className={`bi bi-star-fill ${
                                        product.ratingValue <= ratingIndex + 1
                                            ? "text-secondary"
                                            : "text-warning"
                                    }`}
                                    key={ratingIndex}
                                ></i>
                            ))}
                            ({product.totalRatings})
                        </div>
                    ) : (
                        <div className="pe-2">
                            {[...Array(5).keys()].map((rating, ratingIndex) => (
                                <i
                                    className={`bi ${
                                        ratingIndex +
                                            1 -
                                            parseInt(product.ratingValue) ===
                                        1
                                            ? "bi-star-half"
                                            : "bi-star-fill"
                                    } ${
                                        ratingIndex +
                                            1 -
                                            parseInt(product.ratingValue) <=
                                        1
                                            ? "text-warning"
                                            : "text-secondary"
                                    }`}
                                    key={ratingIndex}
                                ></i>
                            ))}
                            ({product.totalRatings})
                        </div>
                    )}
                    <div className="mt-5">
                        {product?.cartStatus ? (
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleRemoveCart(product)}
                            >
                                Remove from cart
                            </button>
                        ) : (
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleCart(product)}
                            >
                                Add to cart
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="container-fluid ps-0 pe-0 mb-4">
            <h4
                className="text-center mt-2 mb-0 fw-bold"
                style={{ color: "#195A00" }}
            >
                Food Items
            </h4>
            <p className="my-0 text-center">Popular dishes</p>
            {dataLoading ? (
                <Spinner></Spinner>
            ) : (
                <div className="row mx-3 my-2 g-3">
                    <div className="card">
                        <Carousel
                            value={popularDishes}
                            numVisible={3}
                            numScroll={3}
                            responsiveOptions={responsiveOptions}
                            className="custom-carousel"
                            circular
                            itemTemplate={productTemplate}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PopularDishes;
