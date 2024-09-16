import React from 'react';

const ChatList: React.FC = () => {
    return (
        <div className="flex flex-col space-y-2">
            {[...Array(10).keys()].map((_, index) => (
                <div key={index} className="p-4 border-b border-gray-300 cursor-pointer hover:bg-gray-200">
                    <div className="font-semibold">User {index + 1}</div>
                    <div className="text-gray-600">Hello! This is a message from user {index + 1}.</div>
                </div>
            ))}
        </div>
    );
};

export default ChatList;
