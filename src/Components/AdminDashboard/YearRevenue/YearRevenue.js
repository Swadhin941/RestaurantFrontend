import React, { useContext, useEffect, useState } from "react";
import useAxiosSecure from "../../CustomHook/useAxiosSecure/useAxiosSecure";
import { SharedData } from "../../SharedData/SharedContext";
import toast from "react-hot-toast";
import { Bar, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    Title,
    Tooltip,
    ArcElement,
} from "chart.js/auto";
import Spinner from "../../Spinner/Spinner";

ChartJS.register(CategoryScale, Title);
const YearRevenue = () => {
    const [allYear, setAllYear] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [axiosSecure] = useAxiosSecure();
    const [monthlyRevenue, setMonthlyRevenue] = useState(null);
    const [userRevenue, setUserRevenue] = useState(null);
    const [monthName, setMonthName] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);

    const { user } = useContext(SharedData);
    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const temp = [];
        let tempStore = currentYear;
        while (tempStore >= 2020) {
            temp.push(tempStore);
            tempStore--;
        }
        setAllYear(temp);
        let tempMonth = 0;
        const tempMonthList = [];
        while (tempMonth < 12) {
            const month = new Date(
                new Date().getFullYear(),
                tempMonth
            ).toLocaleString("default", { month: "long" });
            tempMonthList.push(month);
            tempMonth++;
        }
        setMonthName(tempMonthList);
    }, []);

    useEffect(() => {
        if (selectedYear !== 0 && user) {
            setDataLoading(true);
            console.log(selectedYear);
            axiosSecure
                .post(`/admin/yearly-revenue-by-month?user=${user?.email}`, {
                    year: selectedYear,
                })
                .then((res) => res.data)
                .then(({ data, data2 }) => {
                    if (data && data2) {

                        const monthlyRevenueXLabel = [...monthName];
                        const monthlyRevenueYLabel = [...Array(12).fill(0)];
                        const userRevenueXLabel = [];
                        const userRevenueYLabel = [];
                        data.forEach((element) => {
                            const findIndex = monthlyRevenueXLabel.findIndex(
                                (findValue) => findValue === element.month
                            );
                            monthlyRevenueYLabel[findIndex] = element.revenue;
                        });
                        data2.forEach((element) => {
                            userRevenueXLabel.push(element.user);
                            userRevenueYLabel.push(element.revenue);
                        });
                        setMonthlyRevenue({
                            labels: [...monthlyRevenueXLabel],
                            datasets: [
                                {
                                    label: "Monthly revenue",
                                    data: [...monthlyRevenueYLabel],
                                    backgroundColor: [
                                        "rgb(255, 131, 0)",
                                        "rgb(32, 168, 232)",
                                        "rgb(30, 204, 204)",
                                        "rgb(255, 191, 0)",
                                        "rgb(221, 255, 0)",
                                        "rgb(178, 234, 56)",
                                        "rgb(94, 234, 56)",
                                        "rgb(45, 252, 59)",
                                        "rgb(45, 252, 173)",
                                        "rgb(36, 211, 242)",
                                        "rgb(36, 142, 242)",
                                        "rgb(21, 67, 234)",
                                    ],
                                },
                            ],
                        });
                        setUserRevenue({
                            labels: [...userRevenueXLabel],
                            datasets: [
                                {
                                    label: "User revenue",
                                    data: [...userRevenueYLabel],
                                    backgroundColor: "rgb(30, 204, 204)",
                                },
                            ],
                        });
                    }
                    setDataLoading(false);
                })
                .catch((error) => {
                    toast.error(error.message);
                    setDataLoading(false);
                });
        }
    }, [selectedYear, user]);

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-end">
                <div style={{ width: "200px" }}>
                    <select
                        name="revenueYear"
                        id="revenueYear"
                        className="form-select"
                        defaultValue={new Date().getFullYear()}
                        onChange={(e) =>
                            setSelectedYear(parseInt(e.target.value))
                        }
                    >
                        {allYear.map((item, index) => (
                            <option value={item} key={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {dataLoading ? (
                <Spinner></Spinner>
            ) : (
                <div className="row">
                    <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                        <Pie options={{}} data={monthlyRevenue}></Pie>
                    </div>
                    <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                        <Bar options={{}} data={userRevenue}></Bar>
                    </div>
                </div>
            )}
        </div>
    );
};

export default YearRevenue;
