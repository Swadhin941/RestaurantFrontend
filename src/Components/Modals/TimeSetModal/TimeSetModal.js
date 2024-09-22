import React, { useContext } from "react";
import useAxiosSecure from "../../CustomHook/useAxiosSecure/useAxiosSecure";
import toast from "react-hot-toast";
import { SharedData } from "../../SharedData/SharedContext";

const TimeSetModal = ({setTimeUpdate, orderData}) => {
    const [axiosSecure] = useAxiosSecure();
    const { user } = useContext(SharedData);
    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const timeSet = parseInt(form.timeSet.value) * 60 * 1000 + Date.now();
        console.log(timeSet);
        axiosSecure.patch(`/update-time?user=${user?.email}`,{
            orderId: orderData,
            deliverTimeInMilli: timeSet,
        })
        .then(res=>res.data)
        .then(data=>{
            if(data.modifiedCount>=1){
                toast.success("Time set successfully");
                form.reset();
                setTimeUpdate(true);
            }
        })
        .catch(error=>{
            toast.error(error.message);
        })
    };
    return (
        <div
            className="modal fade"
            id="TimeSetModal"
            data-bs-keyboard="false"
            data-bs-backdrop="static"
        >
            <div className="modal-dialog modal-sm modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-body">
                        <form className="form" onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="timeSet" className="form-label">
                                    Set Delivery Time
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="timeSet"
                                    name="timeSet"
                                    placeholder="Enter time in Minutes"
                                    min={10}
                                    defaultValue={10}
                                    required
                                />
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimeSetModal;
