import { useGetUsers } from "@/lib/react-query/queriesAndMutation";
import Loader from "../shared/loader";
import { useCurrentUserContext } from "@/context/UserContext";

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
const ChatList = ({ onSelectChat, selectedChat }) => {
  const { data: users, isPending: isUserLoading } = useGetUsers();
  const { currentUser } = useCurrentUserContext();

  // @ts-ignore
  const chats = users?.filter((user) => user._id !== currentUser?._id);

  if (isUserLoading) return <Loader />;

  return (
    <div className="h-full flex flex-col mt-12 gap-5 w-12/12 m-auto ml-5">
      <div className="flex gap-2 w-full max-w-5xl p-5">
        <img
          src="/assets/icons/chat.svg"
          width={36}
          height={36}
          alt="edit"
          className="invert-white"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Chats</h2>
      </div>
      <div className="flex-1 overflow-y-auto mt-5">
        {chats.map(
          // @ts-ignore
          (chat) => (
          <div
            key={chat.id}
            className={`flex items-center p-4 cursor-pointer mt-3 ${
              selectedChat === chat.id ? "bg-dark-4" : "hover:bg-dark-3"
            }`}
            onClick={() => onSelectChat(chat._id)}
          >
            <div className="w-12 h-12 rounded-full bg-gray-500 mr-4 overflow-hidden">
              <img
                src={`${import.meta.env.VITE_API_URL}/uploads/${chat.profilePicture}`}
                alt=""
                className="w-12 h-12 object-cover"
              />
            </div>
            <div>
              <h3 className="text-white font-semibold">{chat.username}</h3>
              {/* <p className="text-gray-400 text-sm">{chat.username}</p> */}
            </div>
            {/* {chat.online && (
              <div className="w-3 h-3 bg-green-500 rounded-full ml-auto"></div>
            )} */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
