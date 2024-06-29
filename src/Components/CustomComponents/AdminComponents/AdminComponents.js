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
            path: "/admin/add-item",
            name: "Add Item"
        },
        {
            name: "All Products",
            path: "/admin/all-products"
        }
    ];
    return adminComponents;
}
export default AdminComponents;