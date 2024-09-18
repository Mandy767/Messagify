
import React from 'react';
import { Dialog } from '@headlessui/react';
import { Button } from '../components/ui/button';

interface LogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onConfirm }) => {
    return (
        <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 flex items-center justify-center p-4 bg-gray-500 bg-opacity-50">
            <Dialog.Panel className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
                <Dialog.Title className="text-xl font-semibold text-gray-800 mb-4">Confirm Logout</Dialog.Title>
                <Dialog.Description className="text-gray-600 mb-6">
                    Are you sure you want to logout? You will be signed out of your account.
                </Dialog.Description>
                <div className="flex justify-end space-x-4">
                    <Button onClick={onClose} className="bg-gray-300 text-gray-700 hover:bg-gray-400 transition-colors">No</Button>
                    <Button onClick={onConfirm} className="bg-blue-500 text-white hover:bg-blue-600 transition-colors">Yes</Button>
                </div>
            </Dialog.Panel>
        </Dialog>
    );
};

export default LogoutModal;
