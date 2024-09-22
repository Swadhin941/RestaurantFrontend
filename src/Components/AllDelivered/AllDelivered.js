import React, { useContext, useEffect, useState } from "react";
import { SharedData } from "../SharedData/SharedContext";
import useAxiosSecure from "../CustomHook/useAxiosSecure/useAxiosSecure";
import toast from "react-hot-toast";

const AllDelivered = () => {
    const [allDelivered, setAllDelivered] = useState([]);
    const [tempData, setTempData] = useState([]);
    const { user } = useContext(SharedData);
    const [axiosSecure] = useAxiosSecure();

    useEffect(()=>{
        if(user){
            axiosSecure
                .get(`/all-delivered?user=${user?.email}`)
                .then((res) => res.data)
                .then((data) => {
                    console.log(data);
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
        }, 20000);
        return ()=> clearInterval(interval);
    },[user])
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
            const filteredData = tempData.filter((data) => data.user === email);
            setAllDelivered(filteredData);
        }
    };

    const handleChange = (e) => {
        const searchData = e.target.value;
        if (searchData === "") {
            setAllDelivered(tempData);
        }
    };

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-end">
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
        </div>
    );
};

export default AllDelivered;
