import { useState } from "react";
import axios from "axios";

import handleAxiosError from "../utils/handleAxiosError";

interface Props {
    mode: "login" | "signup";
    onAuthSuccess: (token: string) => void;
}

export default function AuthForm({ mode, onAuthSuccess }: Props) {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const endpoint = `/api/auth/${mode}`;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post(endpoint, mode === "login" ? { username, password } : { username, password, name, email });

            console.log(response.statusText);

            if (response.statusText === "Created" || response.statusText === "OK") {
                onAuthSuccess(response.data.token);
            } else {
                alert(response.data.message || "Authentication failed");
            }
        } catch (error: unknown) {
            handleAxiosError(error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10">
            <h1 className="text-xl font-semibold mb-4 text-center capitalize">{mode}</h1>
            <input
                className="w-full border p-2 mb-4"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                className="w-full border p-2 mb-4"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {mode === "signup" ? (
                <>
                    <input
                        className="w-full border p-2 mb-4"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        className="w-full border p-2 mb-4"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </>
            ) : null}
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
                {mode === "login" ? "Log In" : "Sign Up"}
            </button>
        </form>
    );
}