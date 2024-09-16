import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';

const ChatWindow: React.FC = () => {
    const [message, setMessage] = useState('');

    const handleSendMessage = () => {
        // Logic to send message can be added here
        setMessage('');
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-2 bg-gray-100">
                {[...Array(10).keys()].map((_, index) => (
                    <div key={index} className="mb-2">
                        <div className="font-semibold">User {index + 1}</div>
                        <div className="bg-white p-2 rounded-md shadow-sm">Message {index + 1}</div>
                    </div>
                ))}
            </div>
            <div className="flex items-center border-t border-gray-300 p-2 bg-white">
                <input
                    type="text"
                    className="flex-1 p-2 border rounded-md"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button onClick={handleSendMessage} className="ml-2 text-blue-500">
                    <FaPaperPlane size={24} />
                </button>
            </div>
        </div>
    );
};

export default ChatWindow;
