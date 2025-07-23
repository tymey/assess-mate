import { Outlet } from "react-router-dom";

import NavBar from "../components/NavBar";

export default function AuthenticatedLayout() {
    return (
        <>
            <NavBar />
            <main className="p-6">
                <Outlet />
            </main>
        </>
    );
}