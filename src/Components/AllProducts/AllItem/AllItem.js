import React, { useContext, useEffect, useState } from "react";
import "./AllItem.css";
import AddItemModal from "../../Modals/AddItemModal/AddItemModal";
import useAxiosSecure from "../../CustomHook/useAxiosSecure/useAxiosSecure";
import { SharedData } from "../../SharedData/SharedContext";
import toast from "react-hot-toast";
import Spinner from "../../Spinner/Spinner";
import EditItemModal from "../../Modals/EditItemModal/EditItemModal";
import ConfirmModal from "../../Modals/ConfirmModal/ConfirmModal";
import { useNavigate } from "react-router-dom";

const AllItem = ({ reloadData, setReloadData }) => {
    const [allItem, setAllItem] = useState([]);
    const { user } = useContext(SharedData);
    const [dataLoading, setDataLoading] = useState(false);
    const [axiosSecure] = useAxiosSecure();
    const [selectedItem, setSelectedItem]= useState(null);
    const navigate = useNavigate();

   

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

    const handleDelete = (deleteData)=>{
        axiosSecure.delete(`/admin/delete-item?user=${user?.email}`,{
            data: {
                id: deleteData?._id
            }
        })
        .then(res=>res.data)
        .then(data=>{
            if(data?.deletedCount>0){
                toast.success("Item deleted successfully");
                setReloadData(!reloadData);
            }
        })
        .catch(error=>{
            toast.error(error?.message);
        })
    }



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
                                                    <div className="card">
                                                        <div className="row">
                                                            <div className="col-6 col-sm-6 col-md-4 col-lg-5">
                                                                <div
                                                                    style={{
                                                                        height: "60px",
                                                                        width: "100%",
                                                                    }}
                                                                >
                                                                    <img
                                                                        src={
                                                                            item2?.imgLink
                                                                        }
                                                                        alt=""
                                                                        className="img-fluid"
                                                                        style={{
                                                                            height: "100%",
                                                                            width: "100%",
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-6 col-sm-6 col-md-8 col-lg-7">
                                                                <div>
                                                                    <h6
                                                                        className="mt-2 text-center"
                                                                        style={{
                                                                            fontWeight:
                                                                                "600",
                                                                            fontSize:
                                                                                item2
                                                                                    ?.title
                                                                                    .length >=
                                                                                30
                                                                                    ? "16px"
                                                                                    : "14px",
                                                                        }}
                                                                    >
                                                                        {
                                                                            item2?.title
                                                                        }
                                                                    </h6>
                                                                </div>
                                                                <div className="d-flex justify-content-center">
                                                                    <div title="view details" onClick={()=>navigate(`/product-details/${item2._id}`)}>
                                                                        <i
                                                                            className="bi bi-eye-fill mx-2 d-block"
                                                                            style={{
                                                                                cursor: "pointer",
                                                                            }}
                                                                        ></i>
                                                                    </div>
                                                                    <div title="edit" className="" data-bs-target="#EditItemModal" data-bs-toggle="modal" onClick={()=>setSelectedItem(item2)}>
                                                                        <i
                                                                            className="bi bi-pencil-fill me-2 d-block"
                                                                            style={{
                                                                                cursor: "pointer",
                                                                            }}
                                                                        ></i>
                                                                    </div>
                                                                    <div title="remove" className="" onClick={()=>handleDelete(item2)}>
                                                                        <i
                                                                            className="bi bi-trash-fill d-block"
                                                                            style={{
                                                                                cursor: "pointer",
                                                                            }}
                                                                        ></i>
                                                                    </div>
                                                                </div>
                                                            </div>
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
            <EditItemModal selectedItem={selectedItem} setSelectedItem={setSelectedItem}></EditItemModal>
            <AddItemModal
                reloadData={reloadData}
                setReloadData={setReloadData}
            ></AddItemModal>
        </div>
    );
};

export default AllItem;
