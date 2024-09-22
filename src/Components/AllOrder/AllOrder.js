import React, { useContext, useEffect, useState } from "react";
import { SharedData } from "../SharedData/SharedContext";
import useAxiosSecure from "../CustomHook/useAxiosSecure/useAxiosSecure";
import toast from "react-hot-toast";
import TimeSetModal from "../Modals/TimeSetModal/TimeSetModal";

const AllOrder = () => {
    const [allOrder, setAllOrder] = useState([]);
    const { user } = useContext(SharedData);
    const [axiosSecure] = useAxiosSecure();
    const [timeUpdate, setTimeUpdate] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [tempData, setTempData] = useState([]);

    // useEffect(() => {
    //     if (user) {
    //         axiosSecure
    //             .get(`/all-orders?user=${user?.email}`)
    //             .then((res) => res.data)
    //             .then((data) => {
    //                 console.log(data);
    //                 setAllOrder(data);
    //                 setTimeUpdate(false);
    //                 setSelectedOrder(null);
    //                 setTempData(data);
    //             })
    //             .catch((error) => {
    //                 toast.error(error.message);
    //             });
    //     }
    // }, [user, timeUpdate]);

    useEffect(() => {
        if (user) {
            axiosSecure
                .get(`/all-orders?user=${user?.email}`)
                .then((res) => res.data)
                .then((data) => {
                    console.log(data);
                    setAllOrder(data);
                    setTimeUpdate(false);
                    setSelectedOrder(null);
                    setTempData(data);
                })
                .catch((error) => {
                    toast.error(error.message);
                });
        }
        const interval = setInterval(() => {
            axiosSecure
                .get(`/all-orders?user=${user?.email}`)
                .then((res) => res.data)
                .then((data) => {
                    setAllOrder(data);
                    setTimeUpdate(false);
                    setSelectedOrder(null);
                    setTempData(data);
                })
                .catch((error) => {
                    toast.error(error.message);
                });
        }, 20000);
        return () => clearInterval(interval);
    }, [user, timeUpdate]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const email = form.orderSearch.value;
        if (email) {
            const filteredData = tempData.filter((data) => data.user === email);
            setAllOrder(filteredData);
        }
    };

    const handleSearchChange = (e) => {
        const searchData = e.target.value;
        if (searchData === "") {
            setAllOrder(tempData);
        }
    };

    const handleDeliver = (id) => {
        axiosSecure
            .put(`/update-delivery-status?user=${user?.email}`, {
                id: id,
            })
            .then((res) => res.data)
            .then((data) => {
                if (data.modifiedCount >= 1) {
                    const temp = allOrder.filter(
                        (orderData) => orderData._id !== id
                    );
                    setAllOrder(temp);
                }
            })
            .catch((error) => {
                toast.error(error.message);
            });
    };

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-end">
                <div className="mb-2" style={{ width: "300px" }}>
                    <form className="form" onSubmit={handleSearchSubmit}>
                        <input
                            type="email"
                            className="form-control"
                            name="orderSearch"
                            style={{ display: "inline", width: "200px" }}
                            placeholder="Search by email"
                            required
                            onChange={handleSearchChange}
                            autoComplete="off"
                        />
                        <button
                            className="btn btn-primary ms-2"
                            style={{ marginTop: "-4px" }}
                        >
                            Search
                        </button>
                    </form>
                </div>
            </div>
            {allOrder.length === 0 && (
                <div style={{ height: "100vh", width: "100%" }}>
                    <img
                        src="https://i.ibb.co/f9TPssj/NoData.png"
                        alt=""
                        style={{ height: "100%", width: "100%" }}
                    />
                </div>
            )}
            <div className="row g-2">
                {allOrder.map((item, index) => (
                    <div className="col-12 col-md-12 col-lg-12" key={index}>
                        <div className="card p-2">
                            <h6>Email: {item.user}</h6>
                            <h6>trxID: {item.trxID}</h6>
                            {item?.deliverTimeInMilli ? (
                                item.deliverTimeInMilli >= Date.now() ? (
                                    <span>
                                        {(item.deliverTimeInMilli -
                                            Date.now()) /
                                            1000 /
                                            60}
                                    </span>
                                ) : (
                                    <>
                                        <span
                                            className="text-success fw-bold"
                                            title="Click on it to confirm the shipment"
                                            style={{ cursor: "pointer" }}
                                            onClick={() =>
                                                handleDeliver(item._id)
                                            }
                                        >
                                            Waiting to deliver
                                        </span>
                                    </>
                                )
                            ) : (
                                <button
                                    className="btn btn-primary btn-sm border border-0 w-25"
                                    data-bs-target="#TimeSetModal"
                                    data-bs-toggle="modal"
                                    onClick={() => setSelectedOrder(item._id)}
                                >
                                    Set delivery time
                                </button>
                            )}
                            <div className="row mt-2 g-2">
                                {item.allItem.map((item2, index2) => (
                                    <div
                                        className="col-12 col-sm-12 col-md-6 col-lg-6 "
                                        key={index2}
                                    >
                                        <div className="card">
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-5 col-sm-4 col-md-3 col-lg-3">
                                                        <img
                                                            src={item2?.imgLink}
                                                            alt=""
                                                            className="img-fluid"
                                                        />
                                                    </div>
                                                    <div className="col-7 col-sm-8 col-md-9 col-lg-9">
                                                        <h5>{item2?.title}</h5>
                                                        <p>
                                                            Price: {item2.price}{" "}
                                                            Taka
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <TimeSetModal
                setTimeUpdate={setTimeUpdate}
                orderData={selectedOrder}
            ></TimeSetModal>
        </div>
    );
};

export default AllOrder;
