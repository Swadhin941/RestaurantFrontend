import React, { useContext, useEffect, useState } from "react";
import { SharedData } from "../SharedData/SharedContext";
import useAxiosSecure from "../CustomHook/useAxiosSecure/useAxiosSecure";
import toast from "react-hot-toast";
import TimeSetModal from "../Modals/TimeSetModal/TimeSetModal";
import ConfirmModal from "../Modals/ConfirmModal/ConfirmModal";

const AllOrder = () => {
    const [allOrder, setAllOrder] = useState([]);
    const { user } = useContext(SharedData);
    const [axiosSecure] = useAxiosSecure();
    const [timeUpdate, setTimeUpdate] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [tempData, setTempData] = useState([]);
    const [deleteState, setDeleteState]= useState(false);
    const [selectedToDelete, setSelectedToDelete]= useState(null);
    const [reload, setReload]= useState(false);

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

    useEffect(()=>{
        if(deleteState){
            console.log(selectedToDelete);
            axiosSecure.delete(`/remove-order?user=${user?.email}`,{
                data: {
                    ...selectedToDelete
                }
            })
            .then(res=>res.data)
            .then(data=>{
                if(data.deletedCount>=1){
                    setReload(!reload);
                    setSelectedToDelete(null);
                }
                    setDeleteState(false);
                
            })
            .catch(error=>{
                setDeleteState(false);
                toast.error(error.message);
            })
        }
    },[deleteState])

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
        }, 8000);
        return () => clearInterval(interval);
    }, [user, timeUpdate, reload]);

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
                        <div className="card p-3">
                            <div className="d-flex justify-content-between">
                                <h6>Email: {item.user}</h6>
                                <button className="btn btn-outline-danger btn-sm" data-bs-target="#ConfirmModal" data-bs-toggle="modal" onClick={()=>setSelectedToDelete(item)}>Cancel this order</button>
                            </div>

                            <h6>trxID: {item.trxID}</h6>
                            {item?.deliverTimeInMilli ? (
                                item.deliverTimeInMilli >= Date.now() ? (
                                    <span>
                                        {parseInt(
                                            (item.deliverTimeInMilli -
                                                Date.now()) /
                                                1000 /
                                                60
                                        )}{" "}
                                        Min
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
                            <p className="my-0">Total Price: {item.totalAmount} Taka</p>
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
                                                            style={{height:"100px", width:"150px"}}
                                                        />
                                                    </div>
                                                    <div className="col-7 col-sm-8 col-md-9 col-lg-9">
                                                        <h5>{item2?.title}</h5>
                                                        <p className="my-0">
                                                            Quantity:{" "}
                                                            {item2.quantity}{" "}
                                                            Taka
                                                        </p>
                                                        <p className="my-0 text-success fw-bold">
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
            <ConfirmModal setDeleteState={setDeleteState}></ConfirmModal>
        </div>
    );
};

export default AllOrder;
