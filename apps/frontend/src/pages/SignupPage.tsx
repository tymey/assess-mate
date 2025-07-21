import AuthForm from "../components/AuthForm";

export default function SignupPage() {
    return (
        <AuthForm
            mode="signup"
            onAuthSuccess={(token) => {
                localStorage.setItem("token", token);
                alert("Signed up and logged in!");
                // Redirect or set auth state here
            }}
        />
    );
}