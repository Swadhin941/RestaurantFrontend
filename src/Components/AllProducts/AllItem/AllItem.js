import React, { useEffect, useState } from "react";
import "./AllItem.css";
import AddItemModal from "../../Modals/AddItemModal/AddItemModal";

const AllItem = () => {
    const [allItem, setAllItem] = useState([]);
    useEffect(()=>{

    },[]);
    return (
        <div className="container-fluid ps-0 pe-0">
            <div className="row">
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
            </div>
            <AddItemModal></AddItemModal>
        </div>
    );
};

export default AllItem;
