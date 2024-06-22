import React, { useState } from 'react';

const PopularDishes = () => {
    const [popularDishes, setPopularDishes]= useState([]);

    return (
        <div className="container-fluid ps-0 pe-0">
            <h4 className="text-center mt-2 mb-0 fw-bold" style={{ color: "#195A00" }}>
                Food Items
            </h4>
            <p className="my-0 text-center">Popular dishes</p>
            
        </div>
    );
};

export default PopularDishes;