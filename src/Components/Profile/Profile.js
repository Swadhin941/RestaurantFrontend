import React, { useContext, useEffect, useState } from "react";
import { SharedData } from "../SharedData/SharedContext";
import "./Profile.css";
import ChangePasswordModal from "../Modals/ChangePasswordModal/ChangePasswordModal";
import useAxiosSecure from "../CustomHook/useAxiosSecure/useAxiosSecure";
import toast from "react-hot-toast";
import useTitle from "../CustomHook/useTitle/useTitle";
import { useNavigate } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import ConfirmModal from "../Modals/ConfirmModal/ConfirmModal";

const Profile = () => {
    useTitle("Profile- Foodie");
    const { user, setUser } = useContext(SharedData);
    const [allTrx, setAllTrx] = useState([]);
    const [axiosSecure] = useAxiosSecure();
    const [tempImg, setTempImg] = useState(null);
    const [dataLoading, setDataLoading] = useState(false);
    const [deleteState, setDeleteState] = useState(false);
    const [selectedToDelete, setSelectedToDelete] = useState(null);
    const navigate = useNavigate();
    const [reload, setReload] = useState(false);

    useEffect(() => {
        if (user) {
            axiosSecure
                .get(`/api/all-transactions?user=${user?.email}`)
                .then((res) => res.data)
                .then((data) => {
                    if (data) {
                        setAllTrx(data);
                    }
                })
                .catch((error) => {
                    toast.error(error.message);
                });
        }
        const interval = setInterval(() => {
            axiosSecure
                .get(`/api/all-transactions?user=${user?.email}`)
                .then((res) => res.data)
                .then((data) => {
                    if (data) {
                        // console.log(data);
                        setAllTrx(data);
                    }
                })
                .catch((error) => {
                    toast.error(error.message);
                });
        }, 8000);
        return () => clearInterval(interval);
    }, [user, reload]);

    useEffect(() => {
        if (deleteState) {
            axiosSecure
                .delete(`/remove-order?user=${user?.email}`, {
                    data: {
                        ...selectedToDelete,
                    },
                })
                .then((res) => res.data)
                .then((data) => {
                    if (data.deletedCount >= 1) {
                        setReload(!reload);
                        setSelectedToDelete(null);
                    }
                    setDeleteState(false);
                })
                .catch((error) => {
                    setDeleteState(false);
                    toast.error(error.message);
                });
        }
    }, [deleteState]);

    const handleImgChange = (e) => {
        const files = e.target.files[0];
        // console.log(files);
        if (
            files.type.split("/")[1] === "png" ||
            files.type.split("/")[1] === "jpg" ||
            files.type.split("/")[1] === "jpeg" ||
            files.type.split("/")[1] === "webp"
        ) {
            setTempImg(e.target.files[0]);
        } else {
            toast.error("Please select a valid image file (png, jpg, jpeg)");
            return;
        }
    };

    const handleCancel = () => {
        document.querySelector("#imgFile").value = null;
        setTempImg(null);
    };

    const handleSave = () => {
        setDataLoading(true);
        const formData = new FormData();
        formData.append("image", tempImg);
        fetch(
            `https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_imgBB}`,
            {
                method: "POST",
                body: formData,
            }
        )
            .then((res) => res.json())
            .then((imgData) => {
                if (imgData.success) {
                    axiosSecure
                        .put(`/auth/update-user?user=${user?.email}`, {
                            imgLink: imgData.data.url,
                        })
                        .then((res) => res.data)
                        .then((data) => {
                            if (data.modifiedCount >= 1) {
                                const tempUser = {
                                    ...user,
                                    imgLink: imgData.data.url,
                                };
                                setUser({ ...tempUser });
                                setTempImg(null);
                                setDataLoading(false);
                            }
                        })
                        .catch((error) => {
                            setDataLoading(false);
                            toast.error(error.message);
                        });
                }
            })
            .catch((error) => {
                setDataLoading(false);
                toast.error(error.message);
            });
    };

    return (
        <div className="container-fluid">
            <div className="profile-content-div">
                <div
                    className="profile-content-img-container"
                    onClick={() => document.querySelector("#imgFile").click()}
                >
                    <img
                        src={
                            tempImg
                                ? URL.createObjectURL(tempImg)
                                : user?.imgLink ||
                                  `https://i.ibb.co/bmVqbdY/empty-person.jpg`
                        }
                        alt=""
                    />
                </div>
                <input
                    type="file"
                    name="imgFile"
                    id="imgFile"
                    hidden
                    onChange={handleImgChange}
                />
            </div>
            {tempImg && (
                <div className="d-flex justify-content-center">
                    <button
                        className="btn btn-success btn-sm border border-0"
                        onClick={handleSave}
                        disabled={dataLoading}
                    >
                        Save
                    </button>
                    <button
                        className="btn btn-danger btn-sm ms-5 border border-0"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                </div>
            )}
            <div className="profile-content-info">
                <div>
                    <h4
                        className="m-0 w-100 text-center"
                        style={{ fontSize: "2rem" }}
                    >
                        {user?.fullName}
                    </h4>
                    <span className="d-inline-block w-100 text-center">
                        {user?.email}
                    </span>
                    <button
                        className="btn btn-success w-100 btn-sm border border-0"
                        data-bs-toggle="modal"
                        data-bs-target="#ChangePasswordModal"
                    >
                        Change password
                    </button>
                </div>
            </div>
            {allTrx.length === 0 ? (
                <div className="empty-data-profile">
                    <img src="https://i.ibb.co/f9TPssj/NoData.png" alt="" />
                </div>
            ) : (
                <div className="row mt-3 ms-2 me-2">
                    {allTrx.map((trx, index) => (
                        <div className="col-12 col-md-12 col-sm-12" key={index}>
                            <div className="d-flex">
                                <hr className="w-100 text-muted" />
                                <div
                                    className="w-50 text-center"
                                    style={{ color: "gray", fontWeight: "600" }}
                                >
                                    {trx.dateString.split("/")[0] +
                                        " " +
                                        trx.currentMonth +
                                        " " +
                                        trx.dateString.split("/")[2]}
                                </div>

                                <hr className="w-100 text-muted" />
                            </div>
                            <div className="row">
                                {trx.allItem.map((item, index2) => (
                                    <div
                                        className="col-12 col-sm-12 col-md-6 col-lg-6"
                                        key={index2}
                                    >
                                        <div className="card">
                                            <div className="row">
                                                <div className="col-5 col-sm-5 col-md-4 col-lg-4">
                                                    <img
                                                        src={item.imgLink}
                                                        alt=""
                                                        style={{
                                                            height: "160px",
                                                            width: "100%",
                                                        }}
                                                        className="border rounded"
                                                    />
                                                </div>
                                                <div className="col-7 col-sm-7 col-md-8 col-lg-8">
                                                    <div className="d-flex justify-content-between mt-1">
                                                        <h5>{item.title}</h5>
                                                        {trx?.deliverStatus ? (
                                                            <div className="pe-2">
                                                                <i className="bi bi-check-circle-fill text-success fs-5"></i>
                                                            </div>
                                                        ) : trx?.deliverTimeInMilli ? (
                                                            trx?.deliverTimeInMilli >=
                                                            Date.now() ? (
                                                                <span>
                                                                    {parseInt(
                                                                        (trx.deliverTimeInMilli -
                                                                            Date.now()) /
                                                                            1000 /
                                                                            60
                                                                    )}
                                                                    Min
                                                                </span>
                                                            ) : (
                                                                <>
                                                                    <span
                                                                        className="text-success fw-bold"
                                                                        style={{
                                                                            cursor: "pointer",
                                                                        }}
                                                                    >
                                                                        Waiting
                                                                        to
                                                                        deliver
                                                                    </span>
                                                                </>
                                                            )
                                                        ) : (
                                                            <p
                                                                className="bg-warning me-1 ps-1 d-flex"
                                                                style={{
                                                                    height: "25px",
                                                                    width: "100px",
                                                                    borderRadius:
                                                                        "8px",
                                                                    display:
                                                                        "inline-block",
                                                                    cursor: "pointer",
                                                                }}
                                                            >
                                                                Pending{" "}
                                                                <PulseLoader
                                                                    size={4}
                                                                    style={{
                                                                        marginTop:
                                                                            "1px",
                                                                    }}
                                                                />
                                                            </p>
                                                        )}
                                                    </div>
                                                    <p className="my-0">
                                                        Price: {item.price} Tk
                                                    </p>
                                                    <p className="my-0">
                                                        Quantity:{" "}
                                                        {item.quantity}
                                                    </p>
                                                    <button
                                                        className="btn btn-sm btn-outline-warning mt-2"
                                                        onClick={() =>
                                                            navigate(
                                                                `/product-details/${item.productId}`
                                                            )
                                                        }
                                                    >
                                                        View Details
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {!trx?.deliverStatus && (
                                    <div className="d-flex justify-content-center mt-2 mb-2">
                                        <button
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() =>
                                                setSelectedToDelete(trx)
                                            }
                                            data-bs-target="#ConfirmModal"
                                            data-bs-toggle="modal"
                                        >
                                            Cancel this order
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    <ConfirmModal
                        setDeleteState={setDeleteState}
                    ></ConfirmModal>
                </div>
            )}
            <ChangePasswordModal></ChangePasswordModal>
        </div>
    );
};

export default Profile;
