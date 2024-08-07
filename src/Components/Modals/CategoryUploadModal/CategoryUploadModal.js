import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { SharedData } from "../../SharedData/SharedContext";
import useAxiosSecure from "../../CustomHook/useAxiosSecure/useAxiosSecure";
import { ServerUrl } from "../../ServerUrl/ServerUrl";
import ClockLoader from 'react-spinners/ClockLoader';
const CategoryUploadModal = ({
    allCategory,
    setAllCategory,
    reloadData,
    setReloadData,
    deleteState,
}) => {
    const [tempImg, setTempImg] = useState(null);
    const { user } = useContext(SharedData);
    const [axiosSecure] = useAxiosSecure();
    const [uniqueTitle, setUniqueTitle] = useState(null);
    const [allTitle, setAllTitle] = useState([]);
    const [dataLoading, setDataLoading]= useState(false);

    useEffect(() => {
        if (user) {
            fetch(`${ServerUrl}/get-category`)
                .then((res) => res.json())
                .then((data) => {
                    setAllTitle(data);
                })
                .catch((error) => {
                    toast.error(error.message);
                });
        }
    }, [user, deleteState]);

    const handleImageChange = (e) => {
        const type = e.target.files[0].type.split("/")[1];
        if (
            type.toLowerCase() === "jpg" ||
            type.toLowerCase() === "png" ||
            type.toLowerCase() === "jpeg" ||
            type.toLowerCase() === "webp"
        ) {
            setTempImg(e.target.files[0]);
        } else {
            toast.error("Only JPG, JPEG, PNG, or WebP images are allowed.");
            setTempImg(null);
            return;
        }
    };

    const handleNameChange = (e) => {
        const name = e.target.value;
        const temp = [...allTitle];
        const findName = temp.find(
            (data) => data?.name.toLowerCase() === name.toLowerCase()
        );
        if (findName) {
            setUniqueTitle(null);
        } else {
            setUniqueTitle(name);
        }
    };

    const handleCategorySubmit = (e) => {
        e.preventDefault();
        if (!uniqueTitle) {
            toast.error("Please enter a unique name");
            return;
        }
        const form = e.target;
        const tempName = form.categoryName.value;
        const name =
            tempName.charAt(0).toUpperCase() +
            tempName.slice(1, tempName.length);
        if (!tempImg) {
            toast.error("Please upload a image");
            return;
        }
        const formData = new FormData();
        formData.append("image", tempImg);
        setDataLoading(true);
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
                        .post(`/admin/add-category?user=${user?.email}`, {
                            name,
                            imgLink: imgData?.data?.url,
                        })
                        .then((res) => res.data)
                        .then((data) => {
                            if (data.acknowledged) {
                                const temp = [
                                    ...allCategory,
                                    { name, imgLink: imgData?.data?.url },
                                ];
                                setAllCategory([...temp]);
                                setReloadData(!reloadData);
                                toast.success("Category added successfully");
                                handleCancel();
                            }
                            setDataLoading(false);
                        })
                        .catch((error) => {
                            toast.error(error.message);
                            setDataLoading(false)
                        });
                } else {
                    setDataLoading(false);
                    toast.error(imgData?.message);
                }
            })
            .catch((error) => {
                setDataLoading(false);
                toast.error(error.message);
            });
    };
    const handleCancel = () => {
        document.querySelector("#categoryForm").reset();
        setTempImg(null);
    };

    return (
        <div
            className="modal fade"
            id="CategoryUploadModal"
            data-bs-keyboard="false"
            data-bs-backdrop="static"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div
                        className="modal-header"
                        style={{ borderBottom: "0px" }}
                    >
                        <button
                            className="btn btn-close"
                            data-bs-dismiss="modal"
                        ></button>
                    </div>
                    <div className="modal-body">
                        <form
                            className="form"
                            id="categoryForm"
                            onSubmit={handleCategorySubmit}
                        >
                            <div>
                                <label
                                    htmlFor="name"
                                    className="form-label mb-1"
                                >
                                    Category Name:
                                </label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        name="categoryName"
                                        className="form-control"
                                        required
                                        style={{ border: "1px solid blue" }}
                                        placeholder="Enter a category name"
                                        autoComplete="off"
                                        onChange={(data) =>
                                            handleNameChange(data)
                                        }
                                        maxLength={20}
                                    />
                                </div>
                            </div>
                            <div className="mt-2">
                                {tempImg ? (
                                    <div className="mt-2">
                                        <div
                                            style={{
                                                height: "100px",
                                                width: "100%",
                                                cursor: "pointer",
                                            }}
                                            onClick={() =>
                                                document
                                                    .querySelector(".uploadImg")
                                                    .click()
                                            }
                                        >
                                            <img
                                                src={URL.createObjectURL(
                                                    tempImg
                                                )}
                                                alt=""
                                                style={{
                                                    height: "100%",
                                                    width: "100%",
                                                }}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-2">
                                        <label htmlFor="uploadImage">
                                            Food Category Image:
                                        </label>
                                        <div
                                            className="mt-2 d-flex justify-content-center align-items-center"
                                            style={{
                                                border: "1px dashed blue",
                                                height: "100px",
                                                width: "100%",
                                                cursor: "pointer",
                                            }}
                                            onClick={() =>
                                                document
                                                    .querySelector(
                                                        ".categoryImg"
                                                    )
                                                    .click()
                                            }
                                        >
                                            <div>
                                                <i className="bi bi-plus fs-4"></i>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    name="uploadImg"
                                    className="categoryImg"
                                    hidden
                                    onChange={handleImageChange}
                                />
                            </div>
                            <div className="mt-2 d-flex justify-content-end">
                                <button
                                    className="btn border border-0"
                                    style={{
                                        backgroundColor: "blue",
                                        color: "white",
                                        width: "120px",
                                        display:"flex",
                                        justifyContent:"center"
                                    }}
                                    disabled={dataLoading}
                                >
                                    {dataLoading? <ClockLoader size="24" color="white" />: "Create"}
                                </button>
                                <p
                                    className="btn btn-white mx-2 mb-0 pb-0"
                                    style={{
                                        color: "blue",
                                        border: "1px solid blue",
                                        width: "120px",
                                    }}
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryUploadModal;
