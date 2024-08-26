import React, { useContext, useEffect, useState } from "react";
import { SharedData } from "../SharedData/SharedContext";
import "./Profile.css";
import ChangePasswordModal from "../Modals/ChangePasswordModal/ChangePasswordModal";
import useAxiosSecure from "../CustomHook/useAxiosSecure/useAxiosSecure";
import toast from "react-hot-toast";
import useTitle from "../CustomHook/useTitle/useTitle";

const Profile = () => {
    useTitle("Profile- Foodie");
    const { user } = useContext(SharedData);
    const [allTrx, setAllTrx] = useState([]);
    const [axiosSecure] = useAxiosSecure();
    const [tempImg, setTempImg] = useState(null);

    useEffect(() => {
        if (user) {
            axiosSecure
                .get(`/api/all-transactions?user=${user?.email}`)
                .then((res) => res.data)
                .then((data) => {
                    if (data) {
                        setAllTrx(data);
                    }
                })
                .catch((error) => {
                    toast.error(error.message);
                });
        }
    }, [user]);

    const handleImgChange = (e) => {
        const files = e.target.files[0];
        // console.log(files);
        if (
            files.type.split("/")[1] === "png" ||
            files.type.split("/")[1] === "jpg" ||
            files.type.split("/")[1] === "jpeg" ||
            files.type.split("/")[1] === "webp"
        ) {
            setTempImg(e.target.files[0]);
        } else {
            toast.error("Please select a valid image file (png, jpg, jpeg)");
            return;
        }
    };

    const handleCancel = () => {
        document.querySelector("#imgFile").value = null;
        setTempImg(null);
    };

    const handleSave = () => {
        const formData = new FormData();
        formData.append("image", tempImg);
        fetch(
            `https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_imgBB}`,
            {
                method: "POST",
                body: formData,
            }
        )
        .then(res=>res.json())
        .then(imgData=>{
            if(imgData.success){
                axiosSecure.put()
            }
        })
        .catch(error=>{
            toast.error(error.message);
        })
    };

    return (
        <div className="container-fluid">
            <div className="profile-content-div">
                <div
                    className="profile-content-img-container"
                    onClick={() => document.querySelector("#imgFile").click()}
                >
                    <img
                        src={
                            tempImg
                                ? URL.createObjectURL(tempImg)
                                : user?.imgLink ||
                                  `https://i.ibb.co/bmVqbdY/empty-person.jpg`
                        }
                        alt=""
                    />
                </div>
                <input
                    type="file"
                    name="imgFile"
                    id="imgFile"
                    hidden
                    onChange={handleImgChange}
                />
            </div>
            {tempImg && (
                <div className="d-flex justify-content-center">
                    <button className="btn btn-success btn-sm border border-0">
                        Save
                    </button>
                    <button
                        className="btn btn-danger btn-sm ms-5 border border-0"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                </div>
            )}
            <div className="profile-content-info">
                <div>
                    <h4
                        className="m-0 w-100 text-center"
                        style={{ fontSize: "2rem" }}
                    >
                        {user?.fullName}
                    </h4>
                    <span className="d-inline-block w-100 text-center">
                        {user?.email}
                    </span>
                    <button
                        className="btn btn-success w-100 btn-sm border border-0"
                        data-bs-toggle="modal"
                        data-bs-target="#ChangePasswordModal"
                    >
                        Change password
                    </button>
                </div>
            </div>
            <ChangePasswordModal></ChangePasswordModal>
        </div>
    );
};

export default Profile;
