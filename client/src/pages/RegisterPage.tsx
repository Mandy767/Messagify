import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { User, Lock, Mail, Image } from "lucide-react";
import { useHttpRequest } from "@/hooks/httpClient";
import dispatchMessage from "@/hooks/messageHandler";
import { useNavigate } from "react-router-dom";
import { useNavbar } from "@/store/NavbarContext";

function RegisterPage() {
    const navigate = useNavigate();
    const sendRequest = useHttpRequest();
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [profilePic, setProfilePic] = useState<File | null>(null);
    const { setIslanding } = useNavbar();

    useEffect(() => {
        setIslanding(false);
    }, [setIslanding]);

    const registerHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!name || !username || !password || !confirmPassword) {
            dispatchMessage("warn", "Please fill in all the fields");
            return;
        }

        if (password !== confirmPassword) {
            dispatchMessage("warn", "Passwords don't match");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("username", username);
        formData.append("password", password);
        if (profilePic) {
            formData.append("profilepic", profilePic);
        }

        try {
            const data = await sendRequest("/api/user/register", {
                method: "POST",
                body: formData,
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
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 via-blue-300 to-blue-500 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <h2 className="text-2xl font-bold text-center text-gray-900">Create Your Account</h2>
                    <p className="text-sm text-center text-gray-600 mt-2">Join our community today</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={registerHandler} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                                Name
                            </Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <Input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="pl-10 w-full border-gray-300"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                                Username
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <Input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Choose a username"
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
                                    placeholder="Create a password"
                                    className="pl-10 w-full border-gray-300"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">
                                Confirm Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <Input
                                    type="password"
                                    id="confirm-password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm your password"
                                    className="pl-10 w-full border-gray-300"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="profile-pic" className="text-sm font-medium text-gray-700">
                                Profile Picture
                            </Label>
                            <div className="relative">
                                <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <Input
                                    type="file"
                                    id="profile-pic"
                                    accept="image/*"
                                    onChange={(e) => setProfilePic(e.target.files?.[0] || null)}
                                    className="pl-10 w-full border-gray-300"
                                />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
                        >
                            Create Account
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <a href="/login" className="text-blue-600 hover:underline">
                            Sign in
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}

export default RegisterPage;