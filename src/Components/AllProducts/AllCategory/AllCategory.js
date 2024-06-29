import React, { useEffect, useState } from 'react';
import CategoryUploadModal from '../../Modals/CategoryUploadModal/CategoryUploadModal';

const AllCategory = () => {
    const [allCategory, setAllCategory]= useState([]);
    useEffect(()=>{

    },[])

    return (
        <div
            className="container-fluid ps-0 pe-0 pt-0"
            style={{ height: "100vh", borderRight: "1px solid blue" }}
        >
            <div
                className=" pt-4 pb-4 ps-1 pe-1"
                style={{ border: "1px solid blue", borderRadius:"10px", borderRight:"0px" }}
            >
                <div className="d-flex justify-content-between">
                    <h6 className="m-0 p-0">Categories</h6>
                    <h6 className="m-0 p-0" style={{ cursor: "pointer" }} data-bs-target="#CategoryUploadModal" data-bs-toggle="modal">
                        <i className="bi bi-plus fs-6"></i>Add Category
                    </h6>
                </div>
            </div>
            <div className='p-2' style={{ marginTop: "50%", marginBottom: "50%" }}>
                {allCategory.length === 0 && (
                    <div
                        className="card p-2 shadow border border-0"
                        style={{
                            backgroundColor: "gainsboro",
                        }}
                    >
                        <div className="card-body">
                            <h6 className="text-center" style={{color:"blue", fontWeight:"600"}}>No Categories</h6>
                        </div>
                    </div>
                )}
            </div>
            <CategoryUploadModal></CategoryUploadModal>
        </div>
    );
};

export default AllCategory;