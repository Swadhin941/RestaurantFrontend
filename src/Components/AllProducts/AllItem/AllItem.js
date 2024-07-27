import React, { useContext, useEffect, useState } from "react";
import "./AllItem.css";
import AddItemModal from "../../Modals/AddItemModal/AddItemModal";
import useAxiosSecure from "../../CustomHook/useAxiosSecure/useAxiosSecure";
import { SharedData } from "../../SharedData/SharedContext";
import toast from "react-hot-toast";
import Spinner from "../../Spinner/Spinner";

const AllItem = ({ reloadData, setReloadData }) => {
    const [allItem, setAllItem] = useState([]);
    const { user } = useContext(SharedData);
    const [dataLoading, setDataLoading] = useState(false);
    const [axiosSecure] = useAxiosSecure();
    useEffect(() => {
        if (user) {
            setDataLoading(true);
            axiosSecure
                .get(`/admin/all-product?user=${user?.email}`)
                .then((res) => res.data)
                .then((data) => {
                    setAllItem(data);
                    setDataLoading(false);
                })
                .catch((error) => {
                    toast.error(error.message);
                    setDataLoading(false);
                });
        }
    }, [user, reloadData]);
    return (
        <div className="container-fluid ps-0 pe-0">
            {dataLoading ? (
                <Spinner></Spinner>
            ) : (
                <div className="row g-2">
                    <div className="d-flex justify-content-between">
                        <h2>All Item</h2>
                        <h4
                            className="p-2 addItem"
                            data-bs-target="#AddItemModal"
                            data-bs-toggle="modal"
                            style={{ cursor: "pointer" }}
                        >
                            <i className="bi bi-plus"></i>
                            Add Item
                        </h4>
                    </div>
                    {allItem.length === 0 && (
                        <div className="" style={{ height: "100vh" }}>
                            <img
                                src="https://i.ibb.co/f9TPssj/NoData.png"
                                alt=""
                                style={{ height: "100%", width: "100%" }}
                            />
                        </div>
                    )}
                    {allItem.map((item1, index) => (
                        <div
                            className="col-12 col-sm-12 col-md-12 col-lg-12"
                            key={index}
                        >
                            <div>
                                <h4>{item1?.name}</h4>
                                <hr />
                                <div className="row">
                                    {item1?.allProductList.length !== 0 ? (
                                        item1?.allProductList.map(
                                            (item2, index2) => (
                                                <div
                                                    className="col-12 col-sm-6 col-md-4 col-lg-4"
                                                    key={index2}
                                                >
                                                    <div
                                                        className="card border border-0"
                                                        style={{
                                                            backgroundColor:
                                                                "yellowgreen",
                                                        }}
                                                    >
                                                        <div className="card-body">
                                                            <img
                                                                src={
                                                                    item2?.imgLink
                                                                }
                                                                alt=""
                                                                className="img-fluid"
                                                            />
                                                            <h5
                                                                className="mt-2"
                                                                style={{
                                                                    fontWeight:
                                                                        "600",
                                                                    fontSize:
                                                                        item2
                                                                            ?.title
                                                                            .length >=
                                                                        30
                                                                            ? "16px"
                                                                            : "20px",
                                                                }}
                                                            >
                                                                {item2?.title}
                                                            </h5>
                                                        </div>
                                                        <div
                                                            className="card-footer"
                                                            style={{
                                                                borderTop:
                                                                    "0px",
                                                                backgroundColor:
                                                                    "yellowgreen",
                                                            }}
                                                        >
                                                            <button className="btn btn-warning w-100">
                                                                View Details
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )
                                    ) : (
                                        <div
                                            className=""
                                            style={{ height: "400px" }}
                                        >
                                            <img
                                                src="https://i.ibb.co/f9TPssj/NoData.png"
                                                alt=""
                                                style={{
                                                    height: "100%",
                                                    width: "100%",
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <AddItemModal reloadData={reloadData} setReloadData={setReloadData}></AddItemModal>
        </div>
    );
};

export default AllItem;
