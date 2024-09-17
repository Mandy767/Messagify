import { useEffect, useState, useCallback } from "react";
import UserCard from "@/components/UserCard";
import { useHttpRequest } from "@/hooks/httpClient";
import { useAuth } from "@/store/AuthContext";
import { useNavbar } from "@/store/NavbarContext";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import dispatchMessage from "@/hooks/messageHandler";

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

    useEffect(() => {
        setIslanding(false);
    }, []);

    // Fetch all users
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

    // Fetch friends
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

    // Handle adding a friend
    const handleAddFriend = async (id: string) => {
        try {
            await sendRequest(`/api/user/addFriend`, {
                method: "POST",
                body: JSON.stringify({ "userId": user._id, "friendId": id })
            });
            dispatchMessage('success', 'Added Friend Successfully');
            fetchUsers(); // Refresh users list
        } catch (err) {
            dispatchMessage('error', 'Failed to add friend.');
            console.error(err);
        }
    };

    // Handle removing a friend
    const handleRemoveFriend = async (id: string) => {
        try {
            await sendRequest(`/api/user/removeFriend`, {
                method: "POST",
                body: JSON.stringify({ "userId": user._id, "friendId": id })
            });
            dispatchMessage('success', 'Friend removed successfully');
            fetchFriends(); // Refresh friends list
        } catch (err) {
            dispatchMessage('error', 'Failed to remove friend.');
            console.error(err);
        }
    };

    // Effect to fetch data when tab changes
    useEffect(() => {
        if (activeTab === 'all') {
            fetchUsers();
        } else if (activeTab === 'friends') {
            fetchFriends();
        }
    }, [activeTab]);

    const displayedPeople = activeTab === 'all' ? people : friends;

    return (
        <div className="flex flex-col h-screen p-6 bg-gray-50">
            {/* Tab Buttons */}
            <div className="mb-6">
                <div className="flex space-x-4">
                    <button
                        className={`py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-300 ${activeTab === 'all' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        onClick={() => setActiveTab('all')}
                    >
                        All Users
                    </button>
                    <button
                        className={`py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-300 ${activeTab === 'friends' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        onClick={() => setActiveTab('friends')}
                    >
                        Friends
                    </button>
                </div>
            </div>

            {/* User/Friend List */}
            <div className="flex-grow">
                <h2 className="text-3xl font-bold mb-6 text-blue-700">
                    {activeTab === 'all' ? 'All Users' : 'Friends'}
                </h2>

                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loader className="animate-spin text-blue-600" size={48} />
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
                                        <div className="flex-row space-x-4">
                                            <button
                                                onClick={() => navigate(`/chat/${user._id}/${person._id}`)}
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
