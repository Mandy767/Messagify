import { useEffect, useState, useCallback } from "react";
import UserCard from "@/components/UserCard";
import { useHttpRequest } from "@/hooks/httpClient";
import { useAuth } from "@/store/AuthContext";
import { useNavbar } from "@/store/NavbarContext";

import { useNavigate } from "react-router-dom";
import dispatchMessage from "@/hooks/messageHandler";
import PixelArtLoader from "@/components/Loader";



interface User {
    _id: string;
    name: string;
    profilepic: string;
    isFriend?: boolean;
}

type Tab = 'all' | 'friends';

function DashboardPage() {
    const navigate = useNavigate();
    const [people, setPeople] = useState<User[]>([]);
    const [friends, setFriends] = useState<User[]>([]);
    const [activeTab, setActiveTab] = useState<Tab>('all');
    const [loading, setLoading] = useState<boolean>(false);
    const sendRequest = useHttpRequest();
    const { user } = useAuth();
    const { setIslanding } = useNavbar();


    const handleClickMessages = (id) => {

        const recipient = id;
        navigate(`/chat/${user._id}/${recipient}`)

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

            const updatedFriends = await data.data.map((friend: User) => ({
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
    }, [activeTab]);

    const displayedPeople = activeTab === 'all' ? people : friends;

    return (
        <div className="flex flex-col h-screen items-center bg-gray-50 pt-10">
            <div className="mb-6 flex justify-center">
                <div className="flex space-x-4 ">
                    <button
                        className={`py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-300 ${activeTab === 'all' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        onClick={() => setActiveTab('all')}
                    >
                        All Users
                    </button>
                    <button
                        className={`py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-300 ${activeTab === 'friends' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        onClick={() => setActiveTab('friends')}
                    >
                        Friends
                    </button>
                </div>
            </div>

            <div className="flex-grow flex flex-col items-center overflow-y-auto">
                <h2 className="text-3xl font-bold mb-6 text-blue-700">
                    {activeTab === 'all' ? 'All Users' : 'Friends'}
                </h2>

                {loading ? (
                    <div className="flex justify-center h-full ">
                        <div className="flex flex-col justify-center items-center ">
                            <div className="justify-center">
                                <PixelArtLoader />
                            </div>

                            <div className="flex mt-10 ml-7 text-center">
                                <span>Yamete kudasai !!</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {displayedPeople.map((person) => (
                            <UserCard
                                key={person._id}
                                name={person.name}
                                profilePicture={`${import.meta.env.VITE_SERVER_ENDPOINT}/${person.profilepic}`}
                                className="transition-transform transform hover:scale-105 hover:shadow-lg"
                                actionButton={
                                    person.isFriend ? (
                                        <div className="flex flex-col space-y-3">
                                            <button
                                                onClick={() => handleClickMessages(person._id)}
                                                className="py-2 px-4 bg-blue-600 text-white rounded-lg"
                                            >
                                                Message
                                            </button>
                                            <button
                                                onClick={() => handleRemoveFriend(person._id)}
                                                className="py-2 px-4 bg-red-600 text-white rounded-lg"
                                            >
                                                Remove Friend
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleAddFriend(person._id)}
                                            className="py-2 px-4 bg-green-600 text-white rounded-lg"
                                        >
                                            Add Friend
                                        </button>
                                    )
                                }
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default DashboardPage;
