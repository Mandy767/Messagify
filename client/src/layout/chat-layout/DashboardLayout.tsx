import React from 'react';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex flex-col lg:flex-row h-screen">
            <div className="lg:w-1/4 w-full lg:h-full bg-gray-200 p-4 overflow-y-auto">
                <ChatList />
            </div>
            <div className="lg:w-3/4 w-full lg:h-full flex flex-col">
                <div className="flex-1 p-4 overflow-y-auto bg-white">
                    <ChatWindow />
                </div>
                {children}
            </div>
        </div>
    );
};

export default DashboardLayout;
