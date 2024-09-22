import React, { useContext, useState } from "react";
import { SharedData } from "../../SharedData/SharedContext";
import useAxiosSecure from "../../CustomHook/useAxiosSecure/useAxiosSecure";
import ClockLoader from "react-spinners/ClockLoader";
import toast from "react-hot-toast";

const ChangePasswordModal = () => {
    const { user, setUser } = useContext(SharedData);
    const [axiosSecure] = useAxiosSecure();
    const [dataLoading, setDataLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const oldPass = form.oldPassword.value;
        const newPass = form.newPassword.value;
        const confirmPass = form.confirmPassword.value;

        if (oldPass !== user?.password) {
            toast.error("Passwords does not matched");
            return;
        }
        if(newPass !== confirmPass){
            toast.error("passwords are not the same");
            return;
        }
        setDataLoading(true);
        axiosSecure.put(`/auth/update-user?user=${user?.email}`,{
            password: newPass
        })
        .then(res=>res.data)
        .then(data=>{
            if(data.modifiedCount>=1){
                let tempUser= {...user}
                tempUser.password= newPass;
                setUser({...tempUser});
                form.reset();
                setDataLoading(false);

            }
        })
        .catch(error=>{
            setDataLoading(false);
            toast.error(error?.message);
        })
    };
    return (
        <div
            className="modal fade"
            id="ChangePasswordModal"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
        >
            <div className="modal-dialog modal-dialog-centered modal-sm">
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
                        <form className="form" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="oldPassword">
                                    Old Password:
                                </label>
                                <div className="input-group">
                                    <input
                                        type="password"
                                        id="oldPassword"
                                        className="form-control"
                                        required
                                        placeholder="Old password"
                                    />
                                </div>
                            </div>
                            <div className="mt-2">
                                <label htmlFor="newPassword">
                                    New Password:
                                </label>
                                <div className="input-group">
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        id="newPassword"
                                        className="form-control"
                                        required
                                        placeholder="New password"
                                        style={{ borderRight: "0px" }}
                                    />
                                    <span
                                        className="input-group-text"
                                        style={{
                                            backgroundColor: "white",
                                            cursor: "pointer",
                                        }}
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        <i
                                            className={`bi ${
                                                showPassword
                                                    ? "bi-eye"
                                                    : "bi-eye-slash"
                                            }`}
                                        ></i>
                                    </span>
                                </div>
                            </div>
                            <div className="mt-2">
                                <label htmlFor="confirmPassword">
                                    Confirm Password:
                                </label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    className="form-control"
                                    required
                                    placeholder="Confirm Password"
                                />
                            </div>
                            <div className="mt-2">
                                <button
                                    className="btn btn-primary btn-sm w-100 border border-0 d-flex justify-content-center"
                                    disabled={dataLoading}
                                >
                                    {dataLoading ? (
                                        <ClockLoader size={24} color="white" />
                                    ) : (
                                        "Change"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
