import React, { useContext } from "react";
import { SharedData } from "../../SharedData/SharedContext";
import useAxiosSecure from "../../CustomHook/useAxiosSecure/useAxiosSecure";

const ChangePasswordModal = () => {
    const { user, setUser } = useContext(SharedData);
    const [axiosSecure] = useAxiosSecure();

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const oldPass = form.oldPassword.value;
        const newPass = form.newPassword.value;
        const confirmPass = form.confirmPassword.value;
        console.log(oldPass, newPass, confirmPass);
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
                                <input
                                    type="password"
                                    id="oldPassword"
                                    className="form-control"
                                    required
                                    placeholder="Old password"
                                />
                            </div>
                            <div className="mt-2">
                                <label htmlFor="newPassword">
                                    New Password:
                                </label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    className="form-control"
                                    required
                                    placeholder="New password"
                                />
                            </div>
                            <div className="mt-2">
                                <label htmlFor="confirmPassword">
                                    Confirm Password:
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    className="form-control"
                                    required
                                    placeholder="Confirm Password"
                                />
                            </div>
                            <div className="mt-2">
                                <button className="btn btn-primary btn-sm w-100 border border-0">
                                    Change
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
