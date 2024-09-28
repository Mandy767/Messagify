const FriendRequest = require("../models/friendrequest");
const User = require("../models/user");

exports.getFriendRequests = async (userId) => {
  try {
    const requests = await FriendRequest.find({
      receiver: userId,
      status: "pending",
    }).populate("sender", "name profilepic");

    const formattedRequests = requests.map((request) => ({
      _id: request._id,
      sender: {
        _id: request.sender._id,
        name: request.sender.name,
        profilepic: request.sender.profilepic,
      },
      createdAt: request.createdAt,
    }));

    return formattedRequests;
  } catch (error) {
    console.error("Error in getFriendRequests service:", error);
    throw new Error("Failed to retrieve friend requests");
  }
};

exports.createFriendRequest = async (senderId, receiverId) => {
  const existingRequest = await FriendRequest.findOne({
    sender: senderId,
    receiver: receiverId,
  });
  if (existingRequest) {
    throw new Error("Friend request already sent");
  }
  const newRequest = new FriendRequest({
    sender: senderId,
    receiver: receiverId,
  });
  return newRequest.save();
};

exports.getRequestsBySenderReceiverid = async (senderId, receiverId) => {
  const existingRequest = await FriendRequest.findOne({
    sender: senderId,
    receiver: receiverId,
  });

  return existingRequest;
};

exports.respondToFriendRequest = async (requestId, response) => {
  const request = await FriendRequest.findById(requestId);
  if (!request) {
    throw new Error("Friend request not found");
  }

  if (response === "accept") {
    await User.findByIdAndUpdate(request.sender, {
      $addToSet: { friends: request.receiver },
    });
    await User.findByIdAndUpdate(request.receiver, {
      $addToSet: { friends: request.sender },
    });
    request.status = "accepted";
    await FriendRequest.findByIdAndDelete(requestId);
  } else if (response === "reject") {
    request.status = "rejected";
  } else {
    throw new Error("Invalid response");
  }

  return request.save();
};
