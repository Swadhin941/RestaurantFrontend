import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../CustomHook/useAxiosSecure/useAxiosSecure";
import toast from "react-hot-toast";
import "./PopularDishes.css";
import Spinner from "../../Spinner/Spinner";
import { useNavigate } from "react-router-dom";

const PopularDishes = () => {
    const [popularDishes, setPopularDishes] = useState([]);
    const [axiosSecure] = useAxiosSecure();
    const [positionCount, setPositionCount] = useState(1);
    const [dataLoading, setDataLoading] = useState(false);
    const [loadMore, setLoadMore] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setDataLoading(true);
        axiosSecure
            .get(`/top-products`)
            .then((res) => res.data)
            .then((data) => {
                setPopularDishes(data);
                setDataLoading(false);
            })
            .catch((error) => {
                toast.error(error.message);
                setDataLoading(false);
            });
    }, []);

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
                <div className="row mx-3 my-2">
                    {popularDishes.map((dish, index) => (
                        <div
                            className="col-12 col-sm-6 col-md-4 col-lg-3"
                            key={index}
                        >
                            <div
                                className="card"
                                style={{ cursor: "pointer" }}
                                onClick={() => navigate(`/product-details/${dish._id}`)}
                            >
                                <div style={{ height: "160px" }}>
                                    <img
                                        src={dish.imgLink}
                                        alt={dish.title}
                                        className="card-img-top"
                                        style={{
                                            height: "100%",
                                            width: "100%",
                                        }}
                                    />
                                </div>

                                <div className="card-body">
                                    <h5 className="card-title">{dish.title}</h5>
                                    <div className="card-text">
                                        {(dish.ratingValue * 10) % 10 === 0 ? (
                                            <div className="pe-2">
                                                {[...Array(5).keys()].map(
                                                    (rating, ratingIndex) => (
                                                        <i
                                                            className={`bi bi-star-fill ${
                                                                dish.ratingValue <=
                                                                ratingIndex + 1
                                                                    ? "text-secondary"
                                                                    : "text-warning"
                                                            }`}
                                                            key={ratingIndex}
                                                        ></i>
                                                    )
                                                )}
                                                ({dish.totalRatings})
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
                                                                        dish.ratingValue
                                                                    ) ===
                                                                1
                                                                    ? "bi-star-half"
                                                                    : "bi-star-fill"
                                                            } ${
                                                                ratingIndex +
                                                                    1 -
                                                                    parseInt(
                                                                        dish.ratingValue
                                                                    ) <=
                                                                1
                                                                    ? "text-warning"
                                                                    : "text-secondary"
                                                            }`}
                                                            key={ratingIndex}
                                                        ></i>
                                                    )
                                                )}
                                                ({dish.totalRatings})
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PopularDishes;
