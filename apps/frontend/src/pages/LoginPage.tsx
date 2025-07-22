import { useNavigate } from "react-router-dom";

import { setAuthToken } from "../api/axiosInstance";
import AuthForm from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
    const { setToken } = useAuth();
    const navigate = useNavigate();

    return (
        <AuthForm
            mode="login"
            onAuthSuccess={(token) => {
                setToken(token);
                setAuthToken(token);
                navigate("/dashboard");
            }}
        />
    );
}