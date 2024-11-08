import React, { useContext, useEffect, useState } from "react";
import { ServerUrl } from "../../ServerUrl/ServerUrl";
import toast from "react-hot-toast";
import Spinner from "../../Spinner/Spinner";
import "./AllCategory.css";
import { useNavigate } from "react-router-dom";
import { SharedData } from "../../SharedData/SharedContext";
import { Carousel } from "primereact/carousel";

const AllCategories = () => {
    const [allCategory, setAllCategory] = useState([]);
    const [allStoredCategory, setAllStoredCategory] = useState([]);
    const [dataLoading, setDataLoading] = useState(false);
    const navigate = useNavigate();
    const {user}= useContext(SharedData);
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
        fetch(`${ServerUrl}/get-category`)
            .then((res) => res.json())
            .then((data) => {
                setAllCategory(data);
                setAllStoredCategory(data);
                setDataLoading(false);
            })
            .catch((error) => {
                setDataLoading(false);
                toast.error(error.message);
            });
    }, []);

    const categoryTemplate = (category)=>{
        return (
            <div
                className="m-2 py-5 px-3 categoryHover"
                onClick={() => {
                    navigate(`/specific-category/${category?.name}`);
                    sessionStorage.setItem("user", user?.email || undefined);
                }}
                style={{ borderRadius: "10px" }}
            >
                <div className="">
                    <div className="categoryTopImg">
                        <img
                            src={category?.imgLink}
                            alt=""
                            className="img-fluid"
                            style={{
                                height: "100%",
                                width: "100%",
                                borderRadius: "10px",
                            }}
                        />
                    </div>
                    <h4 className="text-center mt-2">{category?.name}</h4>
                </div>
            </div>
        );
    }


    return (
        <div className="mt-2 mx-4">
            <h5
                className="text-center fw-bolder"
                style={{ color: "rgb(25, 90, 0)" }}
            >
                All Categories
            </h5>
            {dataLoading ? (
                <Spinner></Spinner>
            ) : (
                <div className="row g-2">
                    <div className="card" style={{border: "0px"}}>
                        <Carousel
                            value={allCategory}
                            numVisible={3}
                            numScroll={3}
                            responsiveOptions={responsiveOptions}
                            className="custom-carousel"
                            circular
                            itemTemplate={categoryTemplate}
                            autoplayInterval={2000}
                        />
                    </div>
                    {/* {allCategory.map((item, index) => (
                        <div
                            className="col-6 col-sm-4 col-md-3 col-lg-2"
                            key={index}
                        >
                            
                        </div>
                    ))} */}
                </div>
            )}
        </div>
    );
};

export default AllCategories;
