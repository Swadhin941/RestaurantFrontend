import React from "react";
import "./AdminDashboard.css";
import ProductPurchase from "./ProductPurchase/ProductPurchase";
import YearRevenue from "./YearRevenue/YearRevenue";

const AdminDashboard = () => {
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                    <ProductPurchase></ProductPurchase>
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                    <YearRevenue></YearRevenue>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
