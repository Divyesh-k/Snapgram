const Chat = require("./models/Chat");
const {sendMessage , markMessageAsRead} = require("./controllers/chatController");

module.exports = (io) => {

  const socketToIdMap = new Map();

  io.on("connection", (socket) => {

    socket.on("register" , (socketData) => {
      if(socketData.userId != null && socketData.socketId != null){
        socketToIdMap.set(socketData.userId, socket.id);
      }
    })

    socket.on("set user" , (userId) => {
        console.log(userId);
        socketToIdMap.set( userId, socket.id);
    })

    socket.on('chat message', async (msg) => {
      try {
        const receiverSocketId = socketToIdMap.get(msg.receiver);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('chat message', savedMessage);
        }
        socket.emit('message sent', savedMessage);
        const savedMessage = await sendMessage(msg);
      } catch (error) {
        socket.emit('message error', { error: 'Failed to send message' });
      }
    });

    socket.on('mark as read', async (messageId) => {
      try {
        const updatedMessage = await markMessageAsRead(messageId);
        const senderSocketId = socketToIdMap.get(updatedMessage.sender.toString());
        if(senderSocketId){
          io.to(senderSocketId).emit('message read', updatedMessage._id);
        }
      }catch (error) {
        socket.emit('message error', { error: 'Failed to mark message as read' });
      }
    });


    socket.on("disconnect", () => {
      for(let [userId , socketId] of socketToIdMap){
        if(socketId === socket.id){
          socketToIdMap.delete(userId);
          break;
        }
      }
    });
  });
};
