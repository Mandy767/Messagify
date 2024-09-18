import React from "react";

interface UserCardProps {
    name: string;
    profilePicture: string;
    actionButton: React.ReactNode;
}

const UserCard: React.FC<UserCardProps> = ({ name, profilePicture, actionButton }) => {

    return (
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center space-y-4 transform transition duration-300 hover:scale-105 hover:shadow-lg hover:bg-gray-50">
            <img
                src={profilePicture}
                alt={name}
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 transition duration-300 hover:border-gray-400"
            />
            <div className="text-center text-gray-800">
                <h3 className="text-lg font-semibold">{name}</h3>
            </div>
            <div className="w-full mt-2 flex justify-center">
                {actionButton}
            </div>
        </div>
    );
};

export default UserCard;
