import { useEffect, useState } from "react";
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Lock, User } from "lucide-react"

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
            //@ts-ignore
            if (!data.message) {
                dispatchMessage("success", "Login successful");
                login();
                navigate("/dashboard");
                window.location.reload()
            } else {
                //@ts-ignore
                dispatchMessage("error", data.message);
            }
        } catch (err) {
            dispatchMessage("error", "An error occurred during login");
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 via-blue-300 to-blue-500 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <h2 className="text-2xl font-bold text-center text-gray-900">Welcome Back</h2>
                    <p className="text-sm text-center text-gray-600 mt-2">Please enter your details to sign in</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={loginHandler} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                                Username
                            </Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <Input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                    className="pl-10 w-full border-gray-300"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <Input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="pl-10 w-full border-gray-300"
                                />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
                        >
                            Sign In
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{" "}
                        <a href="/register" className="text-blue-600 hover:underline">
                            Sign up
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}

export default LoginPage;