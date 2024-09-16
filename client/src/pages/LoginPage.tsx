import { useEffect, useState } from "react";
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"

import dispatchMessage from "@/hooks/messageHandler";
import { useHttpRequest } from "@/hooks/httpClient";
import { useAuth } from "@/store/AuthContext";
import { useNavigate } from "react-router-dom";
import { useNavbar } from "@/store/NavbarContext";



function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const sendRequest = useHttpRequest()
    const navigate = useNavigate();
    const { login } = useAuth();
    const { setIslanding } = useNavbar()

    useEffect(() => {
        setIslanding(false);
    }, [setIslanding]);

    const loginHandler = async (e: any) => {
        e.preventDefault();

        if (!username || !password) {
            dispatchMessage("warn", "Please fill in all the fields");
            return;
        }

        try {
            let data = await sendRequest("/api/user/login", {
                method: "POST",
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            data = data.data;

            if (!data.message) {
                dispatchMessage("success", "Login successful");
                login(); // Set the user as authenticated
                navigate("/dashboard"); // Redirect to dashboard
            } else {
                dispatchMessage("error", data.message);
            }
        } catch (err) {
            dispatchMessage("error", "An error occurred during login");
        }
    };

    return (
        <>
            <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-[#f5f7fa] to-[#c3cfe2] px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full bg-gradient-to-r from-[#f5f7fa] to-[#c3cfe2] p-8 rounded-lg shadow-lg border-gray-400 border-2">
                    <h2 className="text-center text-2xl font-bold text-gray-900">Login to your account</h2>
                    <form
                        onSubmit={loginHandler}
                        className="mt-8 space-y-6"
                    >
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                    Username
                                </Label>
                                <Input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                    className="mt-1 block w-full border-black"
                                />
                            </div>
                            <div>
                                <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </Label>
                                <Input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="mt-1 block w-full border-black"
                                />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all duration-300"
                        >
                            Login
                        </Button>
                    </form>
                </div>
            </div>

        </>

    );
}

export default LoginPage;
