import React from 'react';

const ConfirmModal = ({setDeleteState}) => {
    const handleConfirm= ()=>{
        setDeleteState(true);
    }
    const handleCancel= ()=>{
        setDeleteState(false);
    }
    return (
        <div className='modal fade' id='ConfirmModal' data-bs-keyboard="false" data-bs-backdrop="static">
            <div className="modal-dialog modal-sm modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-body">
                        <div className='text-center'>Are your sure want to remove this?</div>
                        <div className='mt-3 d-flex justify-content-between'>
                            <button className='btn btn-success btn-sm' data-bs-dismiss="modal" onClick={()=>handleConfirm()}>Confirm</button>
                            <button className='btn btn-danger btn-sm' data-bs-dismiss="modal" onClick={()=>handleCancel()}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;