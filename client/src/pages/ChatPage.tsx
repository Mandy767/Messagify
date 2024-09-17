import { Button } from '@/components/ui/button';
import { useHttpRequest } from '@/hooks/httpClient';
import { useAuth } from '@/store/AuthContext';
import { useNavbar } from '@/store/NavbarContext';
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';


const receiver = {
    username: 'User2',
    profilePicture: 'https://via.placeholder.com/40',
};

const socket = io('http://localhost:3000');

function ChatPage() {
    const { userId2: friendId } = useParams()
    const [friendData, setFriendData] = useState(null);
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const { user } = useAuth()
    const username = user.username;
    const sendRequest = useHttpRequest()
    const { setIslanding } = useNavbar();

    useEffect(() => {
        setIslanding(false);
    }, []);

    const fetchFriend = useCallback(async () => {
        if (!friendId) return;
        try {
            const data = await sendRequest(`/api/user/friend/${friendId}`, { method: "GET" });

            setFriendData(data.data)

        } catch (err) {
            console.error('Error fetching friend:', err);
        }
    }, []);

    useEffect(() => {
        fetchFriend()

        socket.on('receiveMessage', (data) => {
            setChat((prevChat) => [...prevChat, data]);
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, []);

    const handleSendMessage = () => {
        if (message.trim()) {
            const newMessage = {
                username,
                message,
                timestamp: new Date(),
            };
            // Emit the message to the server
            socket.emit('sendMessage', newMessage);
            setChat((prevChat) => [...prevChat, newMessage]);
            setMessage(''); // Clear the input after sending
        }
    };

    return (
        <div className="chat-page h-screen flex flex-col">
            {/* Navbar component for receiver info */}
            <div className="navbar bg-blue-600 text-white pl-5 p-4 pt-8 flex items-center">
                <img
                    src={`${import.meta.env.VITE_SERVER_ENDPOINT}/${friendData?.profilepic}`}
                    alt={friendData?.username}
                    className="rounded-full w-12 h-12 mr-4"
                />
                <div>
                    <div className="font-bold text-lg">{friendData?.username}</div>
                    <div className="text-sm text-gray-200">Online</div>
                </div>

            </div>

            <div className="chat-container p-4 flex-grow flex flex-col">
                <div className="chat-window border border-gray-300 rounded-lg p-4 mb-4 h-full overflow-y-scroll">
                    {chat.map((msg, index) => (
                        <div key={index} className={`message ${msg.username === username ? 'self-end' : 'self-start'} mb-2`}>
                            <div className="text-xs text-gray-500">{msg.username}</div>
                            <div className={`p-2 rounded-lg ${msg.username === username ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                                {msg.message}
                            </div>
                            <div className="text-xs text-gray-400">{new Date(msg.timestamp).toLocaleTimeString()}</div>
                        </div>
                    ))}
                </div>
                <div className="chat-input flex">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Type a message..."
                    />
                    <button
                        onClick={handleSendMessage}
                        className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChatPage;
