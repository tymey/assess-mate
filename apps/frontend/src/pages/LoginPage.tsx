import AuthForm from "../components/AuthForm";

export default function LoginPage() {
    return (
        <AuthForm
            mode="login"
            onAuthSuccess={(token) => {
                localStorage.setItem("token", token);
                alert("Logged in!");
                // Redirect or set auth state here
            }}
        />
    );
}