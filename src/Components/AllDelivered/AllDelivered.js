import React, { useContext, useEffect, useState } from "react";
import { SharedData } from "../SharedData/SharedContext";
import useAxiosSecure from "../CustomHook/useAxiosSecure/useAxiosSecure";
import toast from "react-hot-toast";

const AllDelivered = () => {
    const [allDelivered, setAllDelivered] = useState([]);
    const [tempData, setTempData] = useState([]);
    const { user } = useContext(SharedData);
    const [axiosSecure] = useAxiosSecure();
    const [reload, setReload] = useState(false);

    useEffect(() => {
        if (user) {
            axiosSecure
                .get(`/all-delivered?user=${user?.email}`)
                .then((res) => res.data)
                .then((data) => {
                    setAllDelivered(data);
                    setTempData(data);
                })
                .catch((error) => {
                    toast.error(error.message);
                });
        }
        const interval = setInterval(() => {
            axiosSecure
                .get(`/all-delivered?user=${user?.email}`)
                .then((res) => res.data)
                .then((data) => {
                    setAllDelivered(data);
                    setTempData(data);
                })
                .catch((error) => {
                    toast.error(error.message);
                });
        }, 50000);
        return () => clearInterval(interval);
    }, [user, reload]);
    // useEffect(()=>{

    //     const interval= setInterval(()=>{
    //             console.log('working');
    //             // axiosSecure
    //             // .get(`/all-delivered?user=${user?.email}`)
    //             // .then((res) => res.data)
    //             // .then((data) => {
    //             //     console.log(data);
    //             //     setAllDelivered(data);
    //             //     setTempData(data);
    //             // })
    //             // .catch((error) => {
    //             //     toast.error(error.message);
    //             // });

    //     }, 60000)
    //     return ()=> clearInterval(interval);
    // },[])

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const email = form.orderSearch.value;
        if (email) {
            const filteredData =
                allDelivered.length === 0
                    ? tempData.filter((data) => data.user === email)
                    : allDelivered.filter((data) => data.user === email);
            setAllDelivered(filteredData);
        }
    };

    const handleChange = (e) => {
        const searchData = e.target.value;
        if (searchData === "") {
            setAllDelivered(tempData);
        }
    };

    const handleDateChange = (e) => {
        if (e.target.value !== "") {
            const tempDateString = e.target.value.split("-");
            const dateString =
                tempDateString[1] +
                "/" +
                tempDateString[2] +
                "/" +
                tempDateString[0];
            const temp =
                allDelivered.length === 0
                    ? tempData.filter((data) => data.dateString === dateString)
                    : allDelivered.filter((data) => data.dateString === dateString);
            setAllDelivered(temp);
        } else {
            setReload(!reload);
        }
    };

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between mb-3">
                <div className="d-flex">
                    <label
                        htmlFor="datePicker"
                        className="form-label w-100 me-3 mt-2 text-success"
                    >
                        Pick a date for filter
                    </label>
                    <input
                        type="date"
                        className="form-control"
                        name="datePicker"
                        id="datePicker"
                        onChange={handleDateChange}
                    />
                </div>
                <div className="mb-2" style={{ width: "300px" }}>
                    <form className="form" onSubmit={handleSubmit}>
                        <input
                            type="email"
                            className="form-control"
                            name="orderSearch"
                            style={{ display: "inline", width: "200px" }}
                            placeholder="Search by email"
                            required
                            onChange={handleChange}
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
            {allDelivered.length === 0 && (
                <div style={{ height: "100vh", width: "100%" }}>
                    <img
                        src="https://i.ibb.co/f9TPssj/NoData.png"
                        alt=""
                        style={{ height: "100%", width: "100%" }}
                    />
                </div>
            )}
            <div className="row g-2">
                {allDelivered.map((item, index) => (
                    <div className="col-12 col-md-12 col-lg-12" key={index}>
                        <div className="card p-2">
                            <h6>Email: {item.user}</h6>
                            <h6 className="">trxID: {item.trxID}</h6>
                            <div className="text-success mb-1">
                                <span className="fw-bold">Delivered </span>
                                <i className="bi bi-check-circle-fill text-success"></i>
                            </div>
                            <h6>Total: {item.totalAmount} Taka</h6>
                            <h6>Ordered Date: {item.dateString}</h6>
                            <h6>
                                Delivered Date:{" "}
                                {new Date(item?.deliverTimeInMilli)
                                    .toLocaleDateString()
                                    .split("/")[1] +
                                    "/" +
                                    new Date(item?.deliverTimeInMilli)
                                        .toLocaleDateString()
                                        .split("/")[0] +
                                    "/" +
                                    new Date(item?.deliverTimeInMilli)
                                        .toLocaleDateString()
                                        .split("/")[2]}
                            </h6>
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
                                                            style={{
                                                                height: "100px",
                                                                width: "100px",
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="col-7 col-sm-8 col-md-9 col-lg-9">
                                                        <h5>{item2?.title}</h5>
                                                        <p className="my-0">
                                                            Quantity:{" "}
                                                            {item2.quantity}{" "}
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
        </div>
    );
};

export default AllDelivered;
