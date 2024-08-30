import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/loader";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutation";


const LikedPosts = () => {
  const { data: currentUser } = useGetCurrentUser();

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <>
      {currentUser.likedPosts.length === 0 && (
        <p className="text-light-4">No liked posts</p>
      )}

      <GridPostList posts={currentUser.likedPosts} showStats={false} />
    </>
  );
};

export default LikedPosts;
