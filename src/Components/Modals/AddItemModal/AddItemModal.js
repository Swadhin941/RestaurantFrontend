import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners/ClipLoader";
import useAxiosSecure from "../../CustomHook/useAxiosSecure/useAxiosSecure";
import { SharedData } from "../../SharedData/SharedContext";
import { ServerUrl } from "../../ServerUrl/ServerUrl";

const AddItemModal = ({reloadData, setReloadData}) => {
    const [tempImg, setTempImg] = useState(null);
    const [axiosSecure] = useAxiosSecure();
    const { user } = useContext(SharedData);
    const [titleUnique, setTitleUnique] = useState([]);
    const [allCategory, setAllCategory] = useState([]);
    const [selectedCategory, setSelectedCategory]= useState(null);

    useEffect(() => {
        if (user) {
            fetch(`${ServerUrl}/get-category`)
                .then((res) => res.json())
                .then((data) => {
                    setAllCategory(data);
                })
                .catch((error) => {
                    toast.error(error.message);
                });
        }
    }, [user, reloadData]);

    useEffect(()=>{
        if(user){
            fetch(`${ServerUrl}/get-products`,{
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({category: selectedCategory})
            })
        }
    },[user,selectedCategory])

    const handleCancel = () => {
        document.querySelector("#addItemForm").reset();
        setTempImg(null);
    };

    const handleItemSubmit = (e) => {
        e.preventDefault();
        // Add item to the allItem state
        const form = e.target;
        const title = form.title.value;
        const price = form.price.value;
        const description = form.description.value;
        const category = form.category.value;
        if(category==="default"){
            toast.error("Please select a category");
            return;
        }
        if (!tempImg) {
            toast.error("Please upload a image");
            return;
        }
        const formData = new FormData();
        formData.append("image", tempImg);
        fetch(
            `https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_imgBB}`,
            {
                method: "POST",
                body: formData,
            }
        )
            .then((res) => res.json())
            .then((imgData) => {
                if (imgData.success) {
                    console.log(imgData);
                    axiosSecure.post(`/admin/add-product?user=${user?.email}`, {
                        title,
                        price,
                        description,
                        imgLink: imgData?.data?.url,
                        category
                    })
                    .then(res=>res.data)
                    .then((data)=>{
                        if(data.acknowledged){
                            document.getElementById("addItemForm").reset();
                            setReloadData(!reloadData);
                            toast.success("Item added successfully");
                        }
                    })
                    .catch(error=>{
                        toast.error(error.message);
                    })
                } else {
                    toast.error(imgData.message);
                }
            })
            .catch((error) => {
                toast.error(error.message);
            });
    };
    const handleItemImage = (e) => {
        // Add image to the tempImg state
        const type = e.target.files[0].type.split("/")[1];
        if (
            type.toLowerCase() === "jpg" ||
            type.toLowerCase() === "png" ||
            type.toLowerCase() === "jpeg" ||
            type.toLowerCase() === "webp"
        ) {
            setTempImg(e.target.files[0]);
        } else {
            toast.error(
                "Image file should be either a jpg,jpeg, png or webp format"
            );
            return;
        }
    };

    const handleTitleChange = async (e) => {
        console.log(e.target.value);
        // if (titleUnique.length === 0) {
        //     const response = await axiosSecure.get(
        //         `/admin/add-item/title-check?user${user}`
        //     );
        //     const data = await response.json();
        //     console.log(data);
        // }
    };

    const categoryChange= e=>{
        setSelectedCategory(e.target.value);
    }

    return (
        <div
            className="modal fade"
            id="AddItemModal"
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
                            onClick={() => handleCancel()}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <form
                            className="form"
                            id="addItemForm"
                            onSubmit={handleItemSubmit}
                        >
                            <div>
                                <label
                                    htmlFor="title"
                                    className="mb-1 form-label"
                                >
                                    Add Title:
                                </label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="title"
                                        id="title"
                                        placeholder="Enter item title"
                                        required
                                        autoComplete="off"
                                        onChange={(data) =>
                                            handleTitleChange(data)
                                        }
                                    />
                                </div>
                            </div>
                            <div className="mt-2">
                                <label
                                    htmlFor="description"
                                    className="form-label mb-1"
                                >
                                    Description:
                                </label>
                                <div className="input-group">
                                    <textarea
                                        className="form-control"
                                        name="description"
                                        id="description"
                                        placeholder="Enter item description"
                                        required
                                        rows="2"
                                        autoComplete="on"
                                        style={{ resize: "none" }}
                                    />
                                </div>
                            </div>
                            <div className="mt-2">
                                <label
                                    htmlFor="Category"
                                    className="form-label mb-1"
                                >
                                    Category:
                                </label>
                                <div className="input-group">
                                    <select
                                        name="category"
                                        id="category"
                                        className="form-select"
                                        defaultValue={"default"}
                                        onChange={(data)=>categoryChange(data)}
                                    >
                                        <option value="default" disabled>
                                            ---Select a category---
                                        </option>
                                        {
                                            allCategory.map((item, index)=><option value={item?.name} key={index}>{item?.name}</option>)
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="mt-2">
                                <label
                                    htmlFor="price"
                                    className="form-label mb-1"
                                >
                                    Price:
                                </label>
                                <div className="input-group">
                                    <input
                                        type="number"
                                        className="form-control"
                                        autoComplete="off"
                                        placeholder="Enter item price"
                                        name="price"
                                        id="price"
                                        min={0}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mt-2">
                                {tempImg ? (
                                    <div className="mt-2">
                                        <div
                                            style={{
                                                height: "100px",
                                                width: "100%",
                                                cursor: "pointer",
                                            }}
                                            onClick={() =>
                                                document
                                                    .querySelector(".uploadImg")
                                                    .click()
                                            }
                                        >
                                            <img
                                                src={URL.createObjectURL(
                                                    tempImg
                                                )}
                                                alt=""
                                                style={{
                                                    height: "100%",
                                                    width: "100%",
                                                }}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-2">
                                        <label htmlFor="uploadImage">
                                            Add Item Image:
                                        </label>
                                        <div
                                            className="mt-2 d-flex justify-content-center align-items-center"
                                            style={{
                                                border: "1px dashed blue",
                                                height: "100px",
                                                width: "100%",
                                                cursor: "pointer",
                                            }}
                                            onClick={() =>
                                                document
                                                    .querySelector(".itemImg")
                                                    .click()
                                            }
                                        >
                                            <div>
                                                <i className="bi bi-plus fs-4"></i>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    name="itemImg"
                                    className="itemImg"
                                    hidden
                                    onChange={handleItemImage}
                                />
                            </div>
                            <div className="mt-3 d-flex justify-content-end">
                                <button
                                    className="btn btn-primary w-25"
                                    type="submit"
                                >
                                    Add Item
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddItemModal;
