import React, { useContext, useEffect, useState } from "react";
import CategoryUploadModal from "../../Modals/CategoryUploadModal/CategoryUploadModal";
import { SharedData } from "../../SharedData/SharedContext";
import { ServerUrl } from "../../ServerUrl/ServerUrl";
import EditCategoryModal from "../../Modals/EditCategoryModal/EditCategoryModal";
import useAxiosSecure from "../../CustomHook/useAxiosSecure/useAxiosSecure";
import ConfirmModal from "../../Modals/ConfirmModal/ConfirmModal";
import toast from "react-hot-toast";

const AllCategory = ({ setReloadData, reloadData }) => {
    const [allCategory, setAllCategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [deleteState, setDeleteState] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const { user } = useContext(SharedData);
    const [axiosSecure] = useAxiosSecure();

    useEffect(() => {
        if (user) {
            fetch(`${ServerUrl}/get-category`)
                .then((res) => res.json())
                .then((data) => {
                    setAllCategory(data);
                });
        }
    }, [user]);

    const handleEditCategory = (category) => {
        setSelectedCategory(category);
    };

    const handleDeleteCategory = (category) => {
        setDeleteId(category);
    };

    useEffect(() => {
        if (deleteState) {
            axiosSecure
                .delete(`/admin/delete-category?user=${user?.email}`, {
                    data: {
                        ...deleteId,
                    },
                })
                .then((res) => res.data)
                .then((data) => {
                    if (data.deletedCount >= 1) {
                        const temp = [...allCategory];
                        const filteredData = temp.filter(
                            (filterData) => filterData?._id !== deleteId?._id
                        );
                        setAllCategory([...filteredData]);
                        setReloadData(!reloadData);
                        setDeleteId(null);
                        toast.success("Category deleted successfully");
                    }
                    setDeleteState(false);
                })
                .catch(error=>{
                    setDeleteId(null);
                    setDeleteState(false);
                    toast.error(error.message);
                });
        }
    }, [deleteState]);

    return (
        <div
            className="container-fluid ps-0 pe-0 pt-0"
            style={{
                height: allCategory.length<=1?"100vh":"100%",
                borderRight: "1px solid blue",
                borderTopRightRadius: "10px",
                overflow: "auto",
                overflowX: "hidden",
                overflowY: "auto",
            }}
        >
            <div
                className=" pt-4 pb-4 ps-1 pe-1"
                style={{
                    border: "1px solid blue",
                    borderRadius: "10px",
                    borderRight: "0px",
                }}
            >
                <div className="d-flex justify-content-between">
                    <h6 className="m-0 p-0">Categories</h6>
                    <h6
                        className="m-0 p-0"
                        style={{ cursor: "pointer" }}
                        data-bs-target="#CategoryUploadModal"
                        data-bs-toggle="modal"
                    >
                        <i className="bi bi-plus fs-6"></i>Add Category
                    </h6>
                </div>
            </div>
            <div
                className="p-2"
                style={{
                    marginTop: allCategory.length === 0 ? "50%" : "0%",
                    marginBottom: allCategory.length === 0 ? "50%" : "0%",
                }}
            >
                {allCategory.length === 0 && (
                    <div
                        className="card p-2 shadow border border-0"
                        style={{
                            backgroundColor: "gainsboro",
                        }}
                    >
                        <div className="card-body">
                            <h6
                                className="text-center"
                                style={{ color: "blue", fontWeight: "600" }}
                            >
                                No Categories
                            </h6>
                        </div>
                    </div>
                )}
                {allCategory.length !== 0 && (
                    <div className="row g-2">
                        {allCategory.map((category, index) => (
                            <div
                                className="col-12 col-md-12 col-lg-12"
                                key={index}
                            >
                                <div className="card shadow">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-4 col-sm-4 col-md-4 col-lg-4">
                                                <img
                                                    src={category?.imgLink}
                                                    alt=""
                                                    className="img-fluid"
                                                    style={{height:"100%", borderRadius:"5px"}}
                                                />
                                            </div>
                                            <div className="col-8 col-sm-8 col-md-8 col-lg-8">
                                                <h4 className="p-0 m-0" style={{fontSize:category?.name.length <=11?"17px": "14px"}}>
                                                    {category?.name}
                                                </h4>
                                                <div className="d-flex mt-1">
                                                    <i
                                                        className="bi bi-box-arrow-in-down-right mx-2"
                                                        style={{
                                                            cursor: "pointer",
                                                        }}
                                                        onClick={() =>
                                                            handleEditCategory(
                                                                category
                                                            )
                                                        }
                                                        data-bs-target="#EditCategoryModal"
                                                        data-bs-toggle="modal"
                                                    ></i>
                                                    <i
                                                        className="bi bi-trash ms-2"
                                                        style={{
                                                            cursor: "pointer",
                                                        }}
                                                        onClick={() =>
                                                            handleDeleteCategory(
                                                                category
                                                            )
                                                        }
                                                        data-bs-target="#ConfirmModal"
                                                        data-bs-toggle="modal"
                                                    ></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <EditCategoryModal
                selectedCategory={selectedCategory}
                allCategory={allCategory}
                setAllCategory={setAllCategory}
                deleteState= {deleteState}
                reloadData={reloadData}
                setReloadData={setReloadData}
            ></EditCategoryModal>
            <CategoryUploadModal
                allCategory={allCategory}
                setAllCategory={setAllCategory}
                reloadData= {reloadData}
                setReloadData={setReloadData}
                deleteState= {deleteState}
            ></CategoryUploadModal>
            <ConfirmModal setDeleteState={setDeleteState}></ConfirmModal>
        </div>
    );
};

export default AllCategory;
