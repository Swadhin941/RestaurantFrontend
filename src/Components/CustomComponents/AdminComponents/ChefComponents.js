const ChefComponents = () => {
    const chefComponents = [
        {
            path: "/",
            name: "Home",
        },
        {
            name: "All Orders",
            path: "/admin/",
        },
        {
            name: "All Delivered",
            path: "/admin/all-delivered",
        },
    ];
    return chefComponents;
};
export default ChefComponents;