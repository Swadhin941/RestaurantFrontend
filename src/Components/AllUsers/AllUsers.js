import React, { useContext, useEffect, useState } from "react";
import { SharedData } from "../SharedData/SharedContext";
import useAxiosSecure from "../CustomHook/useAxiosSecure/useAxiosSecure";
import toast from "react-hot-toast";
import ConfirmModal from "../Modals/ConfirmModal/ConfirmModal";

const AllUsers = () => {
    const [allData, setAllData] = useState([]);
    const { user } = useContext(SharedData);
    const [axiosSecure] = useAxiosSecure();
    const [userFilter, setUserFilter] = useState(null);
    const [selectedToDelete, setSelectedToDelete]= useState(null);
    const [deleteState, setDeleteState]= useState(false);

    const filterOption = [
        {
            label: "All",
            value: "",
        },
        {
            label: "Admin",
            value: "admin",
        },
        {
            label: "Chef",
            value: "chef",
        },
    ];
    useEffect(() => {
        if (user && user?.role === "admin") {
            axiosSecure
                .get(`/auth/all-users?user=${user?.email}&&role=${userFilter}`)
                .then((res) => res.data)
                .then((data) => {
                    console.log(data);
                    setAllData(data);
                })
                .catch((error) => {
                    toast.error(error.message);
                });
        }
    }, [user, userFilter]);

    const handleRoleChange= (data, email)=>{
        axiosSecure.put(`/auth/update-role?user=${user?.email}`,{
            role: data,
            email: email
        })
        .then(res=>res.data)
        .then(updateRole=>{
            if(updateRole.modifiedCount>=1){
                const temp = [...allData];
                temp.forEach(element=>{
                    if(element.email===email){
                        element.role=data;
                    }
                })
                setAllData(temp);
                toast.success("Role Updated Successfully");
            }
        })
        .catch(error=>{
            toast.error(error.message);
        })
    }

    const handleFilterChange = (e) => {
        if (e.target.value !== "") {
            setUserFilter(e.target.value);
        } else {
            setUserFilter(null);
        }
    };

    useEffect(()=>{
        if(deleteState){
            axiosSecure.delete(`/auth/delete-user?user=${user?.email}`,{
                data: {
                    email: selectedToDelete
                }
            })
            .then(res=>res.data)
            .then(data=>{
                if(data.deletedCount>=1){
                    const temp = allData.filter(filterData=>filterData.email !== selectedToDelete);
                    setAllData(temp);
                    setSelectedToDelete(null);
                    setDeleteState(false);
                }
            })
            .catch(error=>{
                toast.error(error.message);
            })
        }
    },[deleteState])

    return (
        <div className="container-fluid">
            <h4 className="text-center" style={{ fontWeight: "600" }}>
                All User
            </h4>
            <div className="row mt-3">
                <div className="col-12 col-md-12 col-lg-12">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th className="d-flex justify-content-evenly">
                                    <div>Actions</div>
                                    <div>
                                        <select
                                            name="filter"
                                            id=""
                                            className="form-select"
                                            onChange={handleFilterChange}
                                        >
                                            {filterOption.map(
                                                (option, index) => (
                                                    <option
                                                        value={option.value}
                                                        key={index}
                                                    >
                                                        {option.label}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {allData.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.fullName}</td>
                                    <td>{item.email}</td>
                                    <td>
                                        {item.role !== "chef" &&
                                        item.role !== "admin" ? (
                                            <>
                                                <button className="btn btn-primary me-2 btn-sm border border-0" onClick={()=>handleRoleChange("chef", item.email)}>
                                                    Make Chef
                                                </button>

                                                <button className="btn btn-warning me-2 btn-sm border border-0" onClick={()=>handleRoleChange("admin", item.email)}>
                                                    Make Admin
                                                </button>
                                            </>
                                        ) : (
                                            <button className="btn btn-primary me-2 btn-sm border border-0" onClick={()=>handleRoleChange("regular", item.email)}>
                                                Make regular user
                                            </button>
                                        )}

                                        <button className="btn btn-danger btn-sm border border-0" data-bs-target="#ConfirmModal" data-bs-toggle="modal" onClick={()=>setSelectedToDelete(item?.email)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <ConfirmModal setDeleteState={setDeleteState}></ConfirmModal>
            </div>
        </div>
    );
};

export default AllUsers;
