import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, UserMinus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const FriendRequestsPage = () => {
    const [friendRequests, setFriendRequests] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchFriendRequests();
    }, []);

    const fetchFriendRequests = async () => {
        try {
            // Replace '123' with the actual user ID, possibly from a auth context or state
            const response = await fetch('/api/request/:userId');
            if (!response.ok) {
                throw new Error('Failed to fetch friend requests');
            }
            const data = await response.json();
            setFriendRequests(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleResponse = async (requestId, response) => {
        try {
            const res = await fetch('/api/friend-requests/respond', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ requestId, response }),
            });
            if (!res.ok) {
                throw new Error('Failed to respond to friend request');
            }
            // Refresh the friend requests list
            fetchFriendRequests();
        } catch (err) {
            setError(err.message);
        }
    };

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Friend Requests</h1>
            {friendRequests.length === 0 ? (
                <p>No pending friend requests.</p>
            ) : (
                friendRequests.map((request) => (
                    <Card key={request._id} className="mb-4">
                        <CardHeader>
                            <h2 className="text-lg font-semibold">{request.sender.username}</h2>
                        </CardHeader>
                        <CardContent>
                            <p>Wants to be your friend</p>
                        </CardContent>
                        <CardFooter className="flex justify-end space-x-2">
                            <Button
                                variant="outline"
                                onClick={() => handleResponse(request._id, 'reject')}
                            >
                                <UserMinus className="mr-2 h-4 w-4" />
                                Reject
                            </Button>
                            <Button
                                variant="default"
                                onClick={() => handleResponse(request._id, 'accept')}
                            >
                                <UserPlus className="mr-2 h-4 w-4" />
                                Accept
                            </Button>
                        </CardFooter>
                    </Card>
                ))
            )}
        </div>
    );
};

export default FriendRequestsPage;