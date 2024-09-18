import { useHttpRequest } from '@/hooks/httpClient';
import { useSocket } from '@/hooks/Socket';
import { useAuth } from '@/store/AuthContext';
import { useNavbar } from '@/store/NavbarContext';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Send } from 'lucide-react';

function ChatPage() {

    const { userId2: friendId } = useParams();
    const [friendData, setFriendData] = useState(null);
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const { user } = useAuth();
    const sendRequest = useHttpRequest();
    const { setIslanding } = useNavbar();
    const socket = useSocket();
    const chatContainerRef = useRef(null);

    useEffect(() => {
        setIslanding(false);
    }, []);

    const fetchFriend = useCallback(async () => {
        if (!friendId) return;
        try {
            const data = await sendRequest(`/api/user/friend/${friendId}`, { method: "GET" });
            setFriendData(data.data);
        } catch (err) {
            console.error('Error fetching friend:', err);
        }
    }, []);


    const requestPastMessages = useCallback(async () => {
        try {
            const data = await sendRequest(`/api/message/messages/${user._id}/${friendId}`, { method: "GET" });
            setChat(data.data.messages)


        } catch (err) {
            console.error('Error fetching friend:', err);
        }
    }, []);

    useEffect(() => {
        fetchFriend();

        requestPastMessages();

        if (socket) {
            console.log('socket connected')

            socket.on('receive_message', (data) => {
                setChat((prevChat) => [...prevChat, data]);
            });


            return () => {
                socket.off('receive_message');

            };
        } else {
            console.log('socket not connected')
        }
    }, [socket]);


    useEffect(() => {
        scrollToBottom();
    }, [chat]);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };
    const handleSendMessage = () => {
        if (message.trim()) {
            const newMessage = {
                sender: user._id,
                recipient: friendId,
                content: message,
                createdAt: new Date().toLocaleString()
            };


            if (socket) {
                socket.emit('send_message', newMessage);
                //@ts-ignore
                setChat((prevChat) => [...prevChat, newMessage]);
                setMessage('');
            }
        }
    };


    const groupMessagesByDate = (messages) => {
        const groups = {};
        messages.forEach((msg) => {
            const date = new Date(msg.createdAt).toLocaleDateString();
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(msg);
        });
        return groups;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
    };

    const groupedMessages = groupMessagesByDate(chat);

    return (
        <div className="flex flex-col h-screen bg-gray-100 pt-3">
            <div className="bg-white border-b border-gray-300 p-4 flex items-center">
                <img
                    src={`${import.meta.env.VITE_SERVER_ENDPOINT}/${friendData?.profilepic}`}
                    alt={friendData?.username}
                    className="w-8 h-8 rounded-full mr-3"
                />
                <span className="font-semibold">{friendData?.username}</span>
            </div>

            <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4">
                {Object.entries(groupedMessages).reverse().map(([date, messages]) => (
                    <div key={date}>
                        <div className="flex justify-center my-4">
                            <span className="bg-gray-200 text-gray-600 text-sm font-medium px-3 py-1 rounded-full">
                                {formatDate(date)}
                            </span>
                        </div>
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.sender !== user._id ? 'justify-start' : 'justify-end'} mb-4`}
                            >
                                <div
                                    className={`max-w-[70%] rounded-2xl px-4 py-2 break-words ${msg.sender === user._id
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-300 text-black'
                                        }`}
                                >
                                    <p>{msg.content}</p>
                                    <span className="text-xs opacity-70 mt-1 block">
                                        {new Date(msg.createdAt).toLocaleTimeString('en-US', {
                                            hour: 'numeric',
                                            minute: 'numeric',
                                            hour12: true,
                                        })}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div className="bg-white border-t border-gray-300 p-4">
                <div className="flex items-center bg-gray-100 rounded-full">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="flex-grow bg-transparent px-4 py-2 focus:outline-none"
                        placeholder="Message..."
                    />
                    <button
                        onClick={handleSendMessage}
                        className="p-2 text-blue-500 hover:text-blue-700 focus:outline-none"
                    >
                        <Send size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChatPage;
