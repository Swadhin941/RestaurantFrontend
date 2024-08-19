import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import ClockLoader from "react-spinners/ClockLoader";
import useAxiosSecure from "../../CustomHook/useAxiosSecure/useAxiosSecure";
import { SharedData } from "../../SharedData/SharedContext";

const EditItemModal = ({ selectedItem, setSelectedItem }) => {
    const [discountCheck, setDiscountCheck] = useState(false);
    const [dataLoading, setDataLoading] = useState(false);
    const [axiosSecure] = useAxiosSecure();
    const { user } = useContext(SharedData);

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const description = form.editDescription.value;
        const price = parseInt(form.editPrice.value);
        let discount;
        if (discountCheck) {
            discount = parseInt(form.NOP.value);
            axiosSecure
                .post(`/admin/edit-item?user=${user?.email}&&id=${selectedItem?._id}`, {
                    price: price,
                    description,
                    discount: discount,
                })
                .then((res) => res.data)
                .then((data) => {
                    if (data?.modifiedCount>0) {
                        toast.success("Item updated successfully");
                        form.reset();
                        const temp = {...selectedItem};
                        temp.price= price;
                        temp.description= description;
                        temp.discount= discount;
                        setSelectedItem({...temp});

                    }
                    setDataLoading(false);
                    setDiscountCheck(false);
                })
                .catch((error) => {
                    toast.error("Failed to update item");
                    setDataLoading(false);
                    setDiscountCheck(false);
                });
        } else {
            console.log(description, price);
            axiosSecure
                .post(
                    `/admin/edit-item?user=${user?.email}&&id=${selectedItem?._id}`,
                    {
                        price,
                        description,
                    }
                )
                .then((res) => res.data)
                .then((data) => {
                    if (data.modifiedCount>0) {
                        toast.success("Item updated successfully");
                        form.reset();
                        const temp = { ...selectedItem };
                        temp.price = price;
                        temp.description = description;
                        setSelectedItem({ ...temp });
                    }
                    setDataLoading(false);
                    setDiscountCheck(false);
                })
                .catch((error) => {
                    toast.error("Failed to update item");
                    setDataLoading(false);
                    setDiscountCheck(false);
                });
        }
    };
    return (
        <div
            className="modal fade"
            id="EditItemModal"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
        >
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
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
                        <h4 className="text-center fw-bold">Edit item</h4>
                        <form
                            className="form mt-2"
                            onSubmit={handleSubmit}
                            id="editItemForm"
                        >
                            <div>
                                <label
                                    htmlFor="edit_description"
                                    className="form-label"
                                >
                                    Edit Description:
                                </label>
                                <div className="input-group">
                                    <textarea
                                        name="editDescription"
                                        id="editDescription"
                                        className="form-control"
                                        style={{ resize: "none" }}
                                        rows={2}
                                        placeholder="Enter new description"
                                        required
                                        defaultValue={selectedItem?.description}
                                    ></textarea>
                                </div>
                            </div>
                            <div className="mt-2">
                                <label
                                    htmlFor="edit_price"
                                    className="form-label"
                                >
                                    Edit Price:
                                </label>
                                <div className="input-group">
                                    <input
                                        type="number"
                                        name="editPrice"
                                        id="editPrice"
                                        className="form-control"
                                        min={0}
                                        placeholder="Enter your new price"
                                        required
                                        defaultValue={selectedItem?.price}
                                    />
                                </div>
                            </div>
                            <div className="mt-2 d-flex justify-content-center">
                                <div className="form-check form-switch">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        onClick={() => {
                                            setDiscountCheck(!discountCheck);
                                            if (discountCheck) {
                                                document.querySelector(
                                                    "#NOP"
                                                ).value = 0;
                                            }
                                        }}
                                    />
                                    <label
                                        htmlFor="checkbox"
                                        className="form-check label"
                                    >
                                        Discount
                                        {discountCheck ? " Enabled" : " Disabled"}
                                    </label>
                                </div>
                            </div>
                            {discountCheck && (
                                <div className="mt-2">
                                    <label htmlFor="discountInput">
                                        Number of percentage
                                    </label>
                                    <div className="input-group">
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="NOP"
                                            id="NOP"
                                            min={0}
                                            max={100}
                                            required
                                            placeholder="Enter number of percentage"
                                            defaultValue={selectedItem?.discount|| 0}
                                        />
                                    </div>
                                </div>
                            )}
                            <div className="mt-2 d-flex justify-content-center">
                                <button
                                    className="btn btn-primary w-25 d-flex justify-content-center"
                                    onClick={() => setDataLoading(!dataLoading)}
                                >
                                    {dataLoading ? (
                                        <ClockLoader size={24} color="white" />
                                    ) : (
                                        "Save"
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

export default EditItemModal;
