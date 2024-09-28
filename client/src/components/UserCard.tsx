import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCircle, MessageCircle, UserPlus, UserMinus } from "lucide-react";
import { useEffect, useState } from "react";
import { useHttpRequest } from "@/hooks/httpClient";
import { useAuth } from "@/store/AuthContext";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

//@ts-ignore
const UserCard = ({ user, onAddFriend, onRemoveFriend, onMessage }) => {
    const [requested, setIsRequested] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Add loading state
    const sendRequest = useHttpRequest();
    const { user: mainuser } = useAuth();

    const fetchRequestedStatus = async () => {
        try {
            const data = await sendRequest(`/api/user/request/find/${mainuser._id}/${user._id}`, {
                method: "GET",
            });

            const status = data.data?.status;
            if (status === "pending") {
                setIsRequested(true);
            } else {
                setIsRequested(false);
            }

        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequestedStatus();
    }, []);

    if (isLoading) {

        return (
            <Card className="w-full max-w-sm mx-auto">
                <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                        <div className="relative w-16 h-16">
                            <Skeleton circle={true} height={64} width={64} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold">
                                <Skeleton width={100} />
                            </h3>
                            {user.isFriend ? (
                                <div className="mt-2 space-y-2">
                                    <Skeleton height={40} />
                                    <Skeleton height={40} />
                                </div>) : (<div className="mt-2 space-y-2">
                                    <Skeleton height={40} />

                                </div>)}

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
                    <div className="relative w-16 h-16">
                        <img
                            src={`${import.meta.env.VITE_SERVER_ENDPOINT}/${user.profilepic}`}
                            alt={user.name}
                            className="w-full h-full object-cover rounded-full"
                        />
                        {user.isFriend && (
                            <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1">
                                <UserCircle size={16} className="text-white" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold">{user.name}</h3>
                        <div className="mt-2 space-y-2">
                            {user.isFriend ? (
                                <>
                                    <Button
                                        onClick={() => onMessage(user._id)}
                                        className="w-full flex items-center justify-center"
                                        variant="outline"
                                    >
                                        <MessageCircle className="mr-2" size={18} />
                                        Message
                                    </Button>
                                    <Button
                                        onClick={() => onRemoveFriend(user._id)}
                                        className="w-full flex items-center justify-center"
                                        variant="destructive"
                                    >
                                        <UserMinus className="mr-2" size={18} />
                                        Remove Friend
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    onClick={() => {
                                        onAddFriend(user._id)
                                        setIsRequested(true)
                                    }}
                                    className="w-full flex items-center justify-center"
                                    variant="default"
                                    disabled={requested}
                                >
                                    {requested ? (<span>Requested</span>) :
                                        (<>
                                            <UserPlus className="mr-2" size={18} />
                                            Add Friend</>
                                        )}

                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default UserCard;
