import StoryBar from "@/components/Story/StoryBar";
import PostCard from "@/components/shared/PostCard";
import UserCard from "@/components/shared/UserCard";
import Loader from "@/components/shared/loader";
import { useCurrentUserContext } from "@/context/UserContext";
import {
  useGetRecentPosts,
  useGetUsers,
} from "@/lib/react-query/queriesAndMutation";

function Home() {
  const { data: posts, isPending: isPostLoading } = useGetRecentPosts();
  const { data: creators, isLoading: isUserLoading } = useGetUsers(10);
  const { currentUser: user } = useCurrentUserContext();

  if(isUserLoading && !user) {
    return <Loader />;
  }

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="m-1">
          <StoryBar />
        </div>
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {posts?.map(
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
                (post) => (
                <PostCard post={post} key={post._id} />
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="home-creators">
        <h3 className="h3-bold text-light-1">Top Creators</h3>
        {isUserLoading && !creators ? (
          <Loader />
        ) : (
          <ul className="grid 2xl:grid-cols-2 gap-6">
            {creators?.map(
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
              (creator) =>
                creator.username !== user?.username && (
                  <li key={creator?._id}>
                    <UserCard user={creator} />
                  </li>
                )
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Home;
