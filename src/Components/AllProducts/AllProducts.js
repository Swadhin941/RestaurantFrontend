import React from 'react';
import AllCategory from './AllCategory/AllCategory';
import AllItem from './AllItem/AllItem';

const AllProducts = () => {
    return (
        <div className='container-fluid ps-0 pt-0'>
            <div className="row ">
                <div className="col-3 col-sm-3 col-md-3 col-lg-3 ps-0">
                    <AllCategory></AllCategory>
                </div>
                <div className="col-9 col-sm-9 col-md-9 col-lg-9">
                    <AllItem></AllItem>
                </div>
            </div>
        </div>
    );
};

export default AllProducts;