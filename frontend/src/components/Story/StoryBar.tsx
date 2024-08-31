import { useEffect, useMemo, useState } from "react";
import StoryItem from "./StoryItem";
import StoryUploadModal from "./StoryUploadModal";
import StoryViewer from "./StoryViewer";
import { useCurrentUserContext } from "@/context/UserContext";
import { useGetUsers } from "@/lib/react-query/queriesAndMutation";
import Loader from "../shared/loader";

/* eslint-disable @typescript-eslint/ban-ts-comment */
const StoryBar = () => {
  const { data: users, isLoading, refetch } = useGetUsers();
  const { currentUser, refetchCurrentUser } = useCurrentUserContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingStories, setViewingStories] = useState(false);
  const [initialUserIndex, setInitialUserIndex] = useState(0);
  const [curretUserStory , setCurrentUserStory] = useState(false);

  useEffect(() => {
    // @ts-ignore
    if(currentUser?.stories.length > 0){ 
      setCurrentUserStory(true)
    }
  }, [])

  const storiesUsers = useMemo(() => {
    if (isLoading || !users) return [];

    const currentUserIndex = users.findIndex(
      // @ts-ignore
      (user) => user._id === currentUser?._id
    );

    if (currentUserIndex === -1) {
      return users;
    }

    // @ts-ignore
    const filteredUsers = users.filter((user) => user._id !== currentUser?._id && user.stories.length > 0);
    const updatedUsers = [users[currentUserIndex], ...filteredUsers];
    return updatedUsers;
  }, [users, currentUser, isLoading]);


  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // @ts-ignore
  const handleUpload = async (file) => {
    console.log("File uploaded:", file);
    // Assuming the upload is successful
    await refetchCurrentUser();
    await refetch();
    handleCloseModal();
  };

  // @ts-ignore
  const handleStoryClick = (index) => {
    setInitialUserIndex(index);
    setViewingStories(true);
  };

  const handleAddStory = () => {
    setIsModalOpen(true);
  };

  if(!currentUser) {
    refetchCurrentUser();
    return <Loader/>
  }
  

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex p-4">
        {storiesUsers.map(
        // @ts-ignore
        (user, index) => (
          <StoryItem
            key={user._id}
            user={user}
            isCurrentUser={user._id === currentUser?._id}
            onClick={() => handleStoryClick(index)}
            onAddStory={handleAddStory}
            currentUserStory={curretUserStory}
          />
        ))}
      </div>

      {isModalOpen && (
        <StoryUploadModal
          onClose={handleCloseModal}
          onUpload={handleUpload}
        />
      )}

      {viewingStories && (
        <StoryViewer
          users={storiesUsers}
          initialUserIndex={initialUserIndex}
          onClose={() => setViewingStories(false)}
        />
      )}
    </div>
  );
};

export default StoryBar;