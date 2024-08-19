import React, { useContext, useEffect, useState } from "react";
import { ServerUrl } from "../../ServerUrl/ServerUrl";
import toast from "react-hot-toast";
import Spinner from "../../Spinner/Spinner";
import "./AllCategory.css";
import { useNavigate } from "react-router-dom";
import { SharedData } from "../../SharedData/SharedContext";

const AllCategories = () => {
    const [allCategory, setAllCategory] = useState([]);
    const [allStoredCategory, setAllStoredCategory] = useState([]);
    const [dataLoading, setDataLoading] = useState(false);
    const [dataLimit, setDataLimit] = useState(true);
    const navigate = useNavigate();
    const {user}= useContext(SharedData);


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
    useEffect(()=>{
        if(!dataLimit){
            setDataLoading(true);
            setAllCategory(allStoredCategory);
            setDataLoading(false);
        }
        else{
            setDataLoading(true);
            setAllCategory(allStoredCategory.slice(0, 6));
            setDataLoading(false);
        }
    },[allStoredCategory, dataLimit])
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
                    {allCategory.map((item, index) => (
                        <div
                            className="col-6 col-sm-4 col-md-3 col-lg-2"
                            key={index}
                        >
                            <div className="categoryHover" onClick={()=>{navigate(`/specific-category/${item?.name}`); sessionStorage.setItem("user", user?.email || undefined)}}>
                                <div className="categoryTopImg"
                                >
                                    <img
                                        src={item?.imgLink}
                                        alt=""
                                        className="img-fluid"
                                        style={{
                                            height: "100%",
                                            width: "100%",
                                            borderRadius: "10px",
                                        }}
                                    />
                                </div>
                                <h4 className="text-center mt-2">
                                    {item?.name}
                                </h4>
                            </div>
                        </div>
                    ))}
                    <div className="mt-2 d-flex justify-content-center mb-3">
                        {
                            dataLimit ? (
                                <button
                                    className="btn btn-success"
                                    onClick={() => {
                                        setDataLimit(false);
                                        // fetch more data here
                                    }}
                                >
                                    Load More
                                </button>
                            ): (
                                <button className="btn btn-success" onClick={()=>setDataLimit(true)}>
                                    Load fewer data
                                </button>  // add this when there is no more data to load
                            )
                        }
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllCategories;
