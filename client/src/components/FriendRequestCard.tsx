import { UserCheck, UserX } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useEffect, useState } from "react";

//@ts-ignore
const FriendRequestCard = ({ request, onAccept, onReject }) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulating a data fetch delay
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000); // Adjust the delay based on actual loading time

        return () => clearTimeout(timer); // Cleanup the timer on unmount
    }, []);

    if (isLoading) {
        // Return skeleton UI while loading
        return (
            <Card className="w-full max-w-sm mx-auto">
                <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16">
                            <Skeleton circle={true} height={64} width={64} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold">
                                <Skeleton width={100} />
                            </h3>
                            <div className="mt-2 space-y-2">
                                <Skeleton height={40} />
                                <Skeleton height={40} />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-sm mx-auto">
            <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16">
                        <img
                            src={`${import.meta.env.VITE_SERVER_ENDPOINT}/${request.sender.profilepic}`}
                            alt={request.sender.name}
                            className="w-full h-full object-cover rounded-full"
                        />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold">{request.sender.name}</h3>
                        <div className="mt-2 space-y-2">
                            <Button
                                onClick={() => onAccept(request._id)}
                                className="w-full flex items-center justify-center"
                                variant="default"
                            >
                                <UserCheck className="mr-2" size={18} />
                                Accept
                            </Button>
                            <Button
                                onClick={() => onReject(request._id)}
                                className="w-full flex items-center justify-center"
                                variant="destructive"
                            >
                                <UserX className="mr-2" size={18} />
                                Reject
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default FriendRequestCard;
