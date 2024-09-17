import { useEffect, useState, useCallback } from "react";
import UserCard from "@/components/UserCard";
import { useHttpRequest } from "@/hooks/httpClient";
import { useAuth } from "@/store/AuthContext";
import { useNavbar } from "@/store/NavbarContext";
import { Loader } from "lucide-react";

interface User {
    id: string;
    name: string;
    profilePicture: string;
    isFriend?: boolean;
}

type Tab = 'all' | 'friends';

function DashboardPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [activeTab, setActiveTab] = useState<Tab>('all');
    const [loading, setLoading] = useState<boolean>(false);
    const sendRequest = useHttpRequest();
    const { user } = useAuth();
    const { setIslanding } = useNavbar();

    useEffect(() => {
        setIslanding(false);
    }, []);

    const fetchUsers = useCallback(async () => {
        setLoading(true); // Start loading
        try {
            const data = await sendRequest("/api/user/users", {
                method: "GET",
            });
            setUsers(data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false); // End loading
        }
    }, []);

    const fetchFriends = useCallback(async () => {
        setLoading(true); // Start loading
        try {
            const data = await sendRequest(`/api/user/friends`, {
                method: "POST",
                body: JSON.stringify({ "userId": user._id })
            });

            const updatedUsers = data.data.map((user: User) => ({
                ...user,
                isFriend: true
            }));

            setUsers(updatedUsers);
            console.log(updatedUsers)

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (activeTab === 'all') {
            fetchUsers();
        } else if (activeTab === 'friends') {
            fetchFriends();
        }
    }, []);

    return (
        <div className="flex flex-col h-screen p-6 bg-gray-50">
            <div className="mb-6">
                <div className="flex space-x-4">
                    <button
                        className={`py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-300 ${activeTab === 'all' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        onClick={() => {
                            fetchUsers();
                            setActiveTab('all');
                        }}
                    >
                        All Users
                    </button>
                    <button
                        className={`py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-300 ${activeTab === 'friends' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        onClick={() => {
                            fetchFriends();
                            setActiveTab('friends');
                        }}
                    >
                        Friends
                    </button>
                </div>
            </div>
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
                        {users.map((user) => (
                            <UserCard
                                key={user.id}
                                name={user.name}
                                profilePicture={import.meta.env.VITE_SERVER_ENDPOINT + user.profilePicture}
                                className="transition-transform transform hover:scale-105 hover:shadow-lg"
                                actionButton={
                                    activeTab === 'friends' && user?.isFriend ? (
                                        <button className="py-2 px-4 bg-blue-600 text-white rounded-lg">Message</button>
                                    ) : (
                                        <button className="py-2 px-4 bg-green-600 text-white rounded-lg">Add Friend</button>
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
