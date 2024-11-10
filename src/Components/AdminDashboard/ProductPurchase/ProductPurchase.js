import React, { useContext, useEffect, useState } from "react";
import { SharedData } from "../../SharedData/SharedContext";
import useAxiosSecure from "../../CustomHook/useAxiosSecure/useAxiosSecure";
import toast from "react-hot-toast";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    Title,
} from "chart.js/auto";
import Spinner from "../../Spinner/Spinner";

ChartJS.register(CategoryScale, LinearScale, PointElement, Title);

const ProductPurchase = () => {
    const [allData, setAllData] = useState([]);
    const { user } = useContext(SharedData);
    const [chartData, setChartData] = useState(null);
    const [dataLoading, setDataLoading] = useState(true);
    const [axiosSecure] = useAxiosSecure();
    useEffect(() => {
        if (user?.role === "admin") {
            setDataLoading(true);
            axiosSecure
                .get(`/admin/product-purchase?user=${user?.email}`)
                .then((res) => res.data)
                .then((data) => {
                    if (data.length > 0) {
                        console.log(data);
                        setAllData(data);
                        let temp = [];
                        let temp2 = [];
                        data.forEach((element) => {
                            temp.push(element.name);
                            temp2.push(element.quantity);
                        });
                        setChartData({
                            labels: [...temp],
                            datasets: [
                                {
                                    label: "Top purchased products",
                                    data: [...temp2],
                                    backgroundColor: "rgb(30, 204, 204)",
                                    borderColor: "rgb(30, 204, 204)",
                                    borderWidth: 1,
                                    tension: 0.1,
                                },
                            ],
                        });
                        setDataLoading(false);
                    }
                })
                .catch((error) => {
                    toast.error(error.message);
                    setDataLoading(false);
                });
        }
    }, [user]);


    return (
        <div className="container-fluid">
            {dataLoading ? (
                <Spinner></Spinner>
            ) : (
                <Line options={{}} data={chartData}></Line>
            )}
        </div>
    );
};

export default ProductPurchase;
