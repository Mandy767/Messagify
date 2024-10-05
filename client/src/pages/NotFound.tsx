
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 via-blue-300 to-blue-500 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <AlertCircle className="text-red-500" size={64} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">404 - Page Not Found</h2>
                </CardHeader>
                <CardContent>
                    <p className="text-lg text-gray-600 mb-6">
                        Oops! The page you're looking for doesn't exist or has been moved.
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button
                        onClick={() => navigate("/")}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
                    >
                        Return to Home
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

export default NotFound;