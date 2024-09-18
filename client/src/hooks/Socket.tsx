import { useAuth } from "@/store/AuthContext";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

export const useSocket = () => {
    const { user } = useAuth();
    const [socketInstance, setSocketInstance] = useState(null);

    useEffect(() => {
        const createSocket = async () => {
            if (user && user._id) {
                const socket = io('http://localhost:3000', {
                    extraHeaders: {
                        Authorization: user._id,
                    },
                });

                setSocketInstance(socket);


                return () => {
                    if (socket) {
                        socket.disconnect();
                    }
                };
            } else {
                console.warn('User not authenticated or missing _id property. Socket not created.');
            }
        };

        createSocket();
    }, []);

    return socketInstance;
};