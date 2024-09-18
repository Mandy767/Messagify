import { useHttpRequest } from '@/hooks/httpClient';
import { useSocket } from '@/hooks/Socket';
import { useAuth } from '@/store/AuthContext';
import { useIsOnline } from '@/store/IsOnlineContext';
import { useNavbar } from '@/store/NavbarContext';
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';


function ChatPage() {

    const { userId2: friendId } = useParams();
    const [friendData, setFriendData] = useState(null);
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const { user } = useAuth();
    const username = user.username;
    const sendRequest = useHttpRequest();
    const { setIslanding } = useNavbar();
    const socket = useSocket();
    const { isonline } = useIsOnline()

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


    return (
        <div className="chat-page h-screen flex flex-col ">
            {/* Navbar component for receiver info */}
            <div className="navbar bg-blue-600 text-white pl-5 p-4 pt-8 flex items-center ">
                <img
                    src={`${import.meta.env.VITE_SERVER_ENDPOINT}/${friendData?.profilepic}`}
                    alt={friendData?.username}
                    className="rounded-full w-12 h-12 mr-4"
                />
                <div>
                    <div className="font-bold text-lg">{friendData?.username}</div>
                </div>
            </div>

            <div className="chat-container p-4 flex-grow overflow-y-scroll flex flex-col">
                <div className="chat-window border border-gray-300 rounded-lg p-4 mb-4 h-full overflow-y-scroll">
                    {chat.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender !== user._id ? 'justify-start' : 'justify-end'} mb-2`}>
                            <div className='flex flex-col space-y-1 max-w-xs'>
                                {/* Message bubble */}
                                <div className={`p-2 rounded-lg ${msg.sender === user._id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                                    {msg.content}
                                </div>
                                {/* Timestamp */}
                                <div className={`text-xs text-gray-500 ${msg.sender === user._id ? 'text-right' : 'text-left'}`}>
                                    {new Date(msg.createdAt).toLocaleTimeString('en-US', {
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        hour12: true
                                    })}
                                </div>
                            </div>
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
