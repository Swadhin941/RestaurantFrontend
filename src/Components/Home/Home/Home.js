import React from 'react';
import TopBanner from '../TopBanner/TopBanner';
import FoodCategory from '../FoodCategory/FoodCategory';
import PopularDishes from '../PopularDishes/PopularDishes';
import AllCategories from '../AllCategories/AllCategories';
import useTitle from '../../CustomHook/useTitle/useTitle';

const Home = () => {
    useTitle("Home- Foodie");
    return (
        <div className='container-fluid ps-0 pe-0'>
            <TopBanner></TopBanner>
            <PopularDishes></PopularDishes>
            <FoodCategory></FoodCategory>
            <AllCategories></AllCategories>
        </div>
    );
};

export default Home;