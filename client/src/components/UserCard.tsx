import React from "react";

interface UserCardProps {
    name: string;
    profilePicture: string;
    actionButton: React.ReactNode; // Add a prop for the action button
}

const UserCard: React.FC<UserCardProps> = ({ name, profilePicture, actionButton }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
            <img
                src={profilePicture}
                alt={name}
                className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-grow text-gray-800">
                <h3 className="text-lg font-semibold">{name}</h3>
                <div className="mt-2">
                    {actionButton}
                </div>
            </div>
        </div>
    );
};

export default UserCard;
