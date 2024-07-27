import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAxiosSecure from "../../CustomHook/useAxiosSecure/useAxiosSecure";
import { SharedData } from "../../SharedData/SharedContext";
import { ServerUrl } from "../../ServerUrl/ServerUrl";

const EditCategoryModal = ({
    selectedCategory,
    setAllCategory,
    allCategory,
    deleteState, 
    setReloadData, 
    reloadData
}) => {
    const [tempImg, setTempImg] = useState(null);
    const [base64, setBase64] = useState(null);
    const [axiosSecure] = useAxiosSecure();
    const { user } = useContext(SharedData);
    const [uniqueTitle, setUniqueTitle]= useState(null);
    const [allTitle, setAllTitle]= useState([]);

    useEffect(() => {
        if (selectedCategory) {
            setTempImg(selectedCategory?.imgLink);
        }
    }, [selectedCategory]);

    useEffect(() => {
        if (user) {
            fetch(`${ServerUrl}/get-category`)
                .then((res) => res.json())
                .then((data) => {
                    setAllTitle(data);
                })
                .catch((error) => {
                    toast.error(error.message);
                });
        }
    }, [user, deleteState, reloadData]);

    const handleEditImageChange = (e) => {
        const type = e.target.files[0].type.split("/")[1];
        if (
            type.toLowerCase() === "jpg" ||
            type.toLowerCase() === "png" ||
            type.toLowerCase() === "jpeg" ||
            type.toLowerCase() === "webp"
        ) {
            setBase64(e.target.files[0]);
            setTempImg(URL.createObjectURL(e.target.files[0]));
        } else {
            toast.error("Only JPG, JPEG, PNG, or WebP images are allowed.");
            setBase64(null);
            return;
        }
    };

        const handleNameChange = (e) => {
            const name = e.target.value;
            const temp = [...allTitle];
            const findName = temp.find(
                (data) => data?.name.toLowerCase() === name.toLowerCase()
            );
            if (findName) {
                setUniqueTitle(null);
            } else {
                setUniqueTitle(name);
            }
        };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!uniqueTitle) {
            toast.error("Category name must be unique");
            return;
        }
        const form = e.target;
        const name = form.name.value;
        if (!tempImg) {
            toast.error("Please select an image.");
            return;
        }
        let imgLink ;
        
        if (base64) {
            const formData = new FormData();
            formData.append("image", base64);
            const response = await fetch(
                `https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_imgBB}`,
                {
                    method: "POST",
                    body: formData,
                }
            );
            const data = await response.json();
            if(data?.success){
                imgLink = data?.data?.url;
            }
        }
        else{
            imgLink = selectedCategory?.imgLink;
        }
        const updateCategoryResponse = await axiosSecure.put(
            `/admin/edit-category?user=${user?.email}`,
            {
                _id: selectedCategory?._id,
                name: name,
                imgLink: imgLink,
                oldName: selectedCategory?.name
            }
        );
        const data = await updateCategoryResponse.data;
        if(data?.acknowledged){
            const temp = [...allCategory];
            temp.forEach((element) => {
                if (element?._id === selectedCategory._id) {
                    element.name = name;
                    element.imgLink = imgLink;
                }
            });
            setAllCategory([...temp]);
            setReloadData(!reloadData);
        }
    };
    const handleCancel= ()=>{
        document.querySelector("#editCategoryForm").reset();
    }

    return (
        <div
            className="modal fade"
            id="EditCategoryModal"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div
                        className="modal-header"
                        style={{ borderBottom: "0px" }}
                    >
                        <button
                            className="btn btn-close"
                            data-bs-dismiss="modal"
                            onClick={()=>handleCancel()}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <form
                            className="form"
                            id="editCategoryForm"
                            onSubmit={handleSubmit}
                        >
                            <div>
                                <label
                                    htmlFor="name"
                                    className="form-label mb-1"
                                >
                                    Name:
                                </label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        defaultValue={selectedCategory?.name}
                                        name="name"
                                        maxLength={20}
                                        onChange={(data)=>handleNameChange(data)}
                                        
                                    />
                                </div>
                            </div>
                            <div className="mt-2">
                                {tempImg ? (
                                    <div className="mt-2">
                                        <label htmlFor="uploadImage">
                                            Food Category Image:
                                        </label>
                                        <div
                                            style={{
                                                height: "100px",
                                                width: "100%",
                                                cursor: "pointer",
                                            }}
                                            onClick={() =>
                                                document
                                                    .querySelector(
                                                        ".editCategoryImg"
                                                    )
                                                    .click()
                                            }
                                        >
                                            <img
                                                src={tempImg}
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
                                            Food Category Image:
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
                                                    .querySelector(
                                                        ".editCategoryImg"
                                                    )
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
                                    name="uploadImg"
                                    className="editCategoryImg"
                                    hidden
                                    onChange={handleEditImageChange}
                                />
                            </div>
                            <div className="mt-2 d-flex justify-content-end">
                                <button
                                    className="btn w-50 border border-0 text-white"
                                    type="submit"
                                    style={{ backgroundColor: "blue" }}
                                    data-bs-dismiss="modal"
                                >
                                    Update category
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditCategoryModal;
