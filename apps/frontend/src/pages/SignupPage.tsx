import AuthForm from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
    const { setToken } = useAuth();
    const navigate = useNavigate();

    return (
        <AuthForm
            mode="signup"
            onAuthSuccess={(token) => {
                setToken(token);
                navigate("/dashboard");
            }}
        />
    );
}