const AdminComponents= ()=>{
    const adminComponents = [
        {
            path: "/admin",
            name: "Dashboard"
        },
        {
            path: "/",
            name: "Home"
        },
        {
            name: "All Products",
            path: "/admin/all-products"
        }
    ];
    return adminComponents;
}
export default AdminComponents;