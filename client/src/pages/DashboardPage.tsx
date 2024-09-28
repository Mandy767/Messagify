import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useHttpRequest } from "@/hooks/httpClient";
import { useAuth } from "@/store/AuthContext";
import { useNavbar } from "@/store/NavbarContext";
import dispatchMessage from "@/hooks/messageHandler";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import FriendRequestCard from "@/components/FriendRequestCard";
import UserCard from "@/components/UserCard"

interface User {
    _id: string;
    name: string;
    profilepic: string;
    isFriend?: boolean;
}

interface FriendRequest {
    _id: string;
    sender: User;
}

type Tab = 'all' | 'friends' | 'requests';
//@ts-ignore


function DashboardPage() {
    const navigate = useNavigate();
    const [people, setPeople] = useState<User[]>([]);
    const [friends, setFriends] = useState<User[]>([]);
    const [activeTab, setActiveTab] = useState<Tab>('all');
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);

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
        // setLoading(true);
        try {
            const data = await sendRequest("/api/user/users", { method: "GET" });
            setPeople(data.data);
        } catch (err) {
            dispatchMessage('error', 'Failed to fetch users.');
            console.error(err);
        }
    }, []);

    const fetchFriends = useCallback(async () => {
        // setLoading(true);
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
        }
    }, []);

    const handleSendFriendRequest = async (id: string) => {
        try {
            await sendRequest(`/api/user/request/send`, {
                method: "POST",
                body: JSON.stringify({ "userId": user._id, "friendId": id })
            });
            dispatchMessage('success', 'Friend request sent successfully');
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


    const fetchFriendRequests = useCallback(async () => {
        // setLoading(true);
        try {
            const data = await sendRequest(`/api/user/request/${user._id}`, {
                method: "GET"
            });

            setFriendRequests(data.data);
        } catch (err) {
            dispatchMessage('error', 'Failed to fetch friend requests.');
            console.error(err);
        }
    }, []);


    const handleAcceptFriendRequest = async (requestId: string) => {
        try {
            await sendRequest(`/api/user/request/respond`, {
                method: "POST",
                body: JSON.stringify({ "requestId": requestId, "response": "accept" })
            });
            dispatchMessage('success', 'Friend request accepted');
            fetchFriendRequests();
            fetchFriends();
        } catch (err) {
            dispatchMessage('error', 'Failed to accept friend request.');
            console.error(err);
        }
    };

    const handleRejectFriendRequest = async (requestId: string) => {
        try {
            await sendRequest(`/api/user/request/respond`, {
                method: "POST",
                body: JSON.stringify({ "requestId": requestId, "response": "reject" })
            });
            dispatchMessage('success', 'Friend request rejected');
            fetchFriendRequests();
        } catch (err) {
            dispatchMessage('error', 'Failed to reject friend request.');
            console.error(err);
        }
    };

    useEffect(() => {
        if (activeTab === 'all') {
            fetchUsers();
        } else if (activeTab === 'friends') {
            fetchFriends();
        }
        else if (activeTab === 'requests') {
            fetchFriendRequests();
        }
    }, [activeTab, fetchUsers, fetchFriends, fetchFriendRequests]);

    // const displayedPeople = activeTab === 'all' ? people : friends;

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as Tab)}>
                <TabsList className="grid w-full grid-cols-3 mb-8">
                    <TabsTrigger value="all">All Users</TabsTrigger>
                    <TabsTrigger value="friends">Friends</TabsTrigger>
                    <TabsTrigger value="requests">Friend Requests</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                    <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">All Users</h2>
                </TabsContent>
                <TabsContent value="friends">
                    <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Friends</h2>
                </TabsContent>
                <TabsContent value="requests">
                    <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Friend Requests</h2>
                </TabsContent>
            </Tabs>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {activeTab === 'requests' ? (
                    friendRequests?.map((request) => (
                        <FriendRequestCard
                            key={request._id}
                            request={request}
                            onAccept={handleAcceptFriendRequest}
                            onReject={handleRejectFriendRequest}
                        />
                    ))
                ) : (
                    (activeTab === 'all' ? people : friends).map((person) => (
                        <UserCard
                            key={person._id}
                            user={person}
                            onAddFriend={handleSendFriendRequest}
                            onRemoveFriend={handleRemoveFriend}
                            onMessage={handleClickMessages}
                        />
                    ))
                )}
            </div>

        </div>
    );
}

export default DashboardPage;