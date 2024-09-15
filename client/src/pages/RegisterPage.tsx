import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useHttpRequest } from "@/hooks/httpClient";
import dispatchMessage from "@/hooks/messageHandler";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
    const navigate = useNavigate();
    const sendRequest = useHttpRequest();
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmPassword] = useState("");

    const registerHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!username || !password || !confirmpassword) {
            dispatchMessage("warn", "Please fill in all the fields");
            return;
        }

        if (password !== confirmpassword) {
            dispatchMessage("warn", "Passwords didn't match");
            return;
        }

        try {
            const data = await sendRequest("/api/user/register", {
                method: "POST",
                body: JSON.stringify({
                    name: name,
                    username: username,
                    password: password,
                }),
            });

            if (data) {
                dispatchMessage("success", "Account created successfully. Please login.");
                navigate('/login');
            }
        } catch (err) {
            dispatchMessage("error", "An error occurred. Please try again.");
        }
    };

    return (
        <>
            <Navbar islanding={false} />
            <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-[#f5f7fa] to-[#c3cfe2] px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full bg-gradient-to-r from-[#f5f7fa] to-[#c3cfe2] p-8 rounded-lg shadow-lg border-gray-400 border-2">
                    <h2 className="text-center text-2xl font-bold text-gray-900">Create your account</h2>
                    <form
                        onSubmit={registerHandler}
                        className="mt-8 space-y-6"
                    >
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Name
                                </Label>
                                <Input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="mt-1 block w-full border-black"
                                />
                            </div>
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
                            <div>
                                <Label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                                    Confirm Password
                                </Label>
                                <Input
                                    type="password"
                                    id="confirm-password"
                                    value={confirmpassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm your password"
                                    className="mt-1 block w-full border-black"
                                />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-all duration-300"
                        >
                            Register
                        </Button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default RegisterPage;
