import React, { useContext, useState } from 'react';
import ReactStars from 'react-stars'
import ClockLoader from "react-spinners/ClockLoader";
import useAxiosSecure from '../../CustomHook/useAxiosSecure/useAxiosSecure';
import toast from 'react-hot-toast';
import { SharedData } from '../../SharedData/SharedContext';

const FeedbackModal = ({setFeedbackData}) => {
    const {user}= useContext(SharedData);
    const [dataLoading, setDataLoading]= useState(false);
    const [ratingValue, setRatingValue]= useState(0);
    const [axiosSecure]= useAxiosSecure();
    const handleRating = (ratingChanged)=>{
        setRatingValue(ratingChanged);
    }

    const handleSubmit= (e)=>{
        e.preventDefault();
        setDataLoading(true);
        const form = e.target;
        const message = form.feedbackDescription.value;
        if(ratingValue <=0){
            setDataLoading(false);
            toast.error("Please select a rating");
            return;
        }
        const data = {
            message : message,
            email: user?.email,
            fullName: user?.fullName,
            imgLink: user?.imgLink,
            ratingValue: ratingValue
        }
        setFeedbackData(data);
        form.reset();
        setDataLoading(false);
    }

    return (
        <div
            className="modal fade"
            id="FeedbackModal"
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
                    <h6 className='text-center' style={{fontWeight:"600"}}>Feedback</h6>
                        <form className="form" onSubmit={handleSubmit}>
                            <div className="d-flex justify-content-center">
                                <ReactStars
                                    count={5}
                                    onChange={handleRating}
                                    size={24}
                                    color2={"#ffd700"}
                                />
                            </div>
                            <div className="mt-2">
                                <textarea
                                    rows={2}
                                    name="feedbackDescription"
                                    id=""
                                    className="form-control"
                                    style={{ resize: "none" }}
                                    autoComplete="off"
                                    required
                                ></textarea>
                            </div>
                            <div className="mt-3">
                                <button className="btn btn-primary w-100" disabled={dataLoading}>
                                    {dataLoading ? (
                                        <ClockLoader
                                            size={24}
                                            color={"white"}
                                        />
                                    ) : (
                                        "Post feedback"
                                    )}{" "}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedbackModal;