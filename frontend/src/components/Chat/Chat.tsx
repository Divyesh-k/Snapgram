import { useState } from "react";
import ChatList from "./ChatList";
import ChatWindow from "./ ChatWindow";

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div className="flex h-screen w-full bg-dark-1">
      <div className="w-1/3">
        <div className="h-full">
          <ChatList
            onSelectChat={setSelectedChat}
            selectedChat={selectedChat}
          />
        </div>
      </div>

      {/* Detail Column */}
      <div className="w-full bg-dark-1">
        {
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
        <ChatWindow selectedChat={selectedChat} />
        }
      </div>
    </div>
  );
};

export default Chat;
