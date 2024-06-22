import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AddItem = () => {
    const [tempImg, setTempImg] = useState(null);

    useEffect(()=>{
        
    },[])

    const handleImageChange = (e) => {
        console.log(e.target.files);
        const type = e.target.files[0].type;
        console.log(type);
    };

    const handleSubmit= (e)=>{
        e.preventDefault();
        const form = e.target;
        const title = form.title.value;
        const description = form.description.value;
        const price = form.price.value;
        const ratings = [];
        const category = form.category.value;
        console.log(title, description, price, ratings, category);
        if(!tempImg){
            toast.error("Please select an image");
            return;
        }
    }

    return (
        <div className="container-fluid d-flex justify-content-center align-items-center">
            <div className="card" style={{ width: "350px" }}>
                <div className="card-body">
                    <h4 className="text-center">Add Item</h4>
                    <form className="form" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name">Title:</label>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="foodName"
                                    placeholder="Food title"
                                    required
                                />
                            </div>
                        </div>
                        <div className="mt-2">
                            <label htmlFor="description">Description:</label>
                            <div className="input-group">
                                <textarea
                                    name="description"
                                    className="form-control"
                                    placeholder="Food description"
                                    required
                                    style={{ resize: "none" }}
                                ></textarea>
                            </div>
                        </div>
                        <div className="mt-2">
                            <label htmlFor="price">Price:</label>
                            <div className="input-group">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Food price"
                                    min={0}
                                    name="price"
                                />
                            </div>
                        </div>
                        <div className="mt-2">
                            <label htmlFor="category">Category:</label>
                            <div className="input-group">
                                <select
                                    name="category"
                                    id="category"
                                    className="form-select"
                                >
                                    <option value="default">
                                        ---Select a category---
                                    </option>
                                </select>
                            </div>
                        </div>
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
                                        src={URL.createObjectURL(tempImg)}
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
                                    Food Image
                                </label>
                                <div
                                    className="mt-2 d-flex justify-content-center align-items-center"
                                    style={{
                                        border: "1px dashed black",
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
                                    <div>
                                        <i className="bi bi-plus fs-4"></i>
                                    </div>
                                </div>
                            </div>
                        )}
                        <input
                            type="file"
                            name="uploadImg"
                            className="uploadImg"
                            hidden
                            onChange={handleImageChange}
                        />
                        <div className="mt-2">
                            <button className="btn btn-primary w-100" name="add-item">Add Item</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddItem;
