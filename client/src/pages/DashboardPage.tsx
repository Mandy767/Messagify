import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { UserCircle, MessageCircle, UserPlus, UserMinus } from "lucide-react";
import { useHttpRequest } from "@/hooks/httpClient";
import { useAuth } from "@/store/AuthContext";
import { useNavbar } from "@/store/NavbarContext";
import dispatchMessage from "@/hooks/messageHandler";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface User {
    _id: string;
    name: string;
    profilepic: string;
    isFriend?: boolean;
}

type Tab = 'all' | 'friends';

const UserCard = ({ user, onAddFriend, onRemoveFriend, onMessage }) => (
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
                                onClick={() => onAddFriend(user._id)}
                                className="w-full flex items-center justify-center"
                                variant="default"
                            >
                                <UserPlus className="mr-2" size={18} />
                                Add Friend
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
);

function DashboardPage() {
    const navigate = useNavigate();
    const [people, setPeople] = useState<User[]>([]);
    const [friends, setFriends] = useState<User[]>([]);
    const [activeTab, setActiveTab] = useState<Tab>('all');
    const [loading, setLoading] = useState<boolean>(false);
    const sendRequest = useHttpRequest();
    const { user } = useAuth();
    const { setIslanding } = useNavbar();

    const handleClickMessages = (id: string) => {
        navigate(`/chat/${user._id}/${id}`);
    };

    useEffect(() => {
        setIslanding(false);
    }, []);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const data = await sendRequest("/api/user/users", { method: "GET" });
            setPeople(data.data);
        } catch (err) {
            dispatchMessage('error', 'Failed to fetch users.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchFriends = useCallback(async () => {
        setLoading(true);
        try {
            const data = await sendRequest(`/api/user/friends`, {
                method: "POST",
                body: JSON.stringify({ "userId": user._id })
            });
            const updatedFriends = data.data.map((friend: User) => ({
                ...friend,
                isFriend: true
            }));
            setFriends(updatedFriends);
        } catch (err) {
            dispatchMessage('error', 'Failed to fetch friends.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleAddFriend = async (id: string) => {
        try {
            await sendRequest(`/api/user/addFriend`, {
                method: "POST",
                body: JSON.stringify({ "userId": user._id, "friendId": id })
            });
            dispatchMessage('success', 'Added Friend Successfully');
            fetchUsers();
        } catch (err) {
            dispatchMessage('error', 'Failed to add friend.');
            console.error(err);
        }
    };

    const handleRemoveFriend = async (id: string) => {
        try {
            await sendRequest(`/api/user/removeFriend`, {
                method: "POST",
                body: JSON.stringify({ "userId": user._id, "friendId": id })
            });
            dispatchMessage('success', 'Friend removed successfully');
            fetchFriends();
        } catch (err) {
            dispatchMessage('error', 'Failed to remove friend.');
            console.error(err);
        }
    };

    useEffect(() => {
        if (activeTab === 'all') {
            fetchUsers();
        } else if (activeTab === 'friends') {
            fetchFriends();
        }
    }, [activeTab, fetchUsers, fetchFriends]);

    const displayedPeople = activeTab === 'all' ? people : friends;

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as Tab)}>
                <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="all">All Users</TabsTrigger>
                    <TabsTrigger value="friends">Friends</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                    <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">All Users</h2>
                </TabsContent>
                <TabsContent value="friends">
                    <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Friends</h2>
                </TabsContent>
            </Tabs>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {displayedPeople.map((person) => (
                        <UserCard
                            key={person._id}
                            user={person}
                            onAddFriend={handleAddFriend}
                            onRemoveFriend={handleRemoveFriend}
                            onMessage={handleClickMessages}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default DashboardPage;