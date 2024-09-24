import React from 'react';
import useAxiosSecure from '../../CustomHook/useAxiosSecure/useAxiosSecure';
import toast from 'react-hot-toast';

const EditCommentModal = ({commentEdit, reload, setReload}) => {
    const [axiosSecure]= useAxiosSecure();

    const handleSubmit = (e)=>{
        e.preventDefault();
        const form =e.target;
        const comment = form.editComment.value;
        console.log(comment, commentEdit, reload);
        axiosSecure.put(`/feedback/edit-comment?user=${commentEdit?.email}`,{
            _id: commentEdit?.id,
            message: comment
        })
        .then(res=>res.data)
        .then(data=>{
            if(data.modifiedCount>=1){
                form.reset();
                toast.success("Comment updated successfully");
            }
        })
        .catch(error=>{
            toast.error(error.message);
        });
        
    }
    return (
        <div className='modal fade' data-bs-backdrop="static" data-bs-keyboard="false" id='EditCommentModal'>
            <div className="modal-dialog modal-dialog-centered modals-m">
                <div className="modal-content">
                    <div className="modal-header" style={{borderBottom:"0px"}}>
                        <button className='btn btn-close' data-bs-dismiss="modal" onClick={()=>setReload(!reload)}></button>
                    </div>
                    <div className="modal-body">
                        <h6 className='text-center'>Edit comment</h6>
                        <form onSubmit={handleSubmit}>
                            <div >
                                <textarea name="editComment" id="" rows={2} className='form-control' style={{resize:"none"}} autoComplete='off' required></textarea>
                            </div>
                            <div className='d-flex justify-content-end mt-2'>
                                <button type='submit' className='btn btn-sm btn-primary'>Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditCommentModal;