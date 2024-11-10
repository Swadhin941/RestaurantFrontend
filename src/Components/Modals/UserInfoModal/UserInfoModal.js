import React, { useContext } from "react";
import { SharedData } from "../../SharedData/SharedContext";
import useAxiosSecure from "../../CustomHook/useAxiosSecure/useAxiosSecure";
import toast from "react-hot-toast";

const UserInfoModal = ({selectedToEdit, setSelectedToEdit, reload, setReload}) => {
    const { user } = useContext(SharedData);
    const [axiosSecure] = useAxiosSecure();
    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const fullName = form.fullName.value;
        const email = form.email.value;
        axiosSecure.put(`/auth/update-user-by-admin?user=${user?.email}`,{
            id:selectedToEdit._id ,fullName, email
        })
        .then(res=>res.data)
        .then(data=>{
            if(data.modifiedCount>=1){
                setSelectedToEdit({...selectedToEdit, fullName: fullName, email: email});
                setReload(!reload);
                toast.success("User updated successfully");
            }
        })
        .catch(error=>{
            toast.error(error.message);
        })
    };
    return (
        <div
            className="modal fade"
            id="UserInfoModal"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
        >
            <div className="modal-dialog modal-sm modal-dialog-centered">
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
                        <div className="d-flex justify-content-center">
                            <img
                                src={
                                    selectedToEdit?.imgLink ||
                                    `https://i.ibb.co.com/bmVqbdY/empty-person.jpg`
                                }
                                alt=""
                                className="img-fluid"
                                style={{
                                    height: "100px",
                                    width: "100px",
                                    borderRadius: "50%",
                                }}
                            />
                        </div>
                        <form className="form mt-2" onSubmit={handleSubmit}>
                            <div>
                                <input
                                    type="text"
                                    className="form-control"
                                    defaultValue={selectedToEdit?.fullName}
                                    name="fullName"
                                />
                            </div>
                            <div className="mt-2">
                                <input
                                    type="email"
                                    className="form-control"
                                    defaultValue={selectedToEdit?.email}
                                    name="email"
                                />
                            </div>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    className="form-control"
                                    defaultValue={selectedToEdit?.role}
                                    readOnly
                                    disabled
                                />
                            </div>
                            <div className="d-flex justify-content-end mt-2">
                                <button type="submit" className="btn btn-outline-primary btn-sm border border-0">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserInfoModal;
