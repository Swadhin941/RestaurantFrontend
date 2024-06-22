import logo from "./logo.svg";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import Router from "./Components/Router/Router";
import { Toaster } from "react-hot-toast";

function App() {
    return (
        <div className="" style={{ height: "100vh" }}>
            <RouterProvider router={Router}></RouterProvider>
            <Toaster />
        </div>
    );
}

export default App;
