import { Models } from "appwrite";
import Loader from "@/components/shared/loader";
import GridPostList from "@/components/shared/GridPostList";
import { useGetCurrentUser, useGetRecentPosts } from "@/lib/react-query/queriesAndMutation";

const Saved = () => {
  const { data: currentUser } = useGetCurrentUser();

  // const savePosts = currentUser?.saves
  //   .map((savePost: Models.Document) => ({
  //     ...savePost.post,
  //     creator: {
  //       imageUrl: currentUser.imageUrl,
  //     },
  //   }))
  //   .reverse();

  //   console.log(savePosts);

  const { data : AllPosts  } = useGetRecentPosts();

  const savePosts = currentUser?.saves
    .map((savePost: Models.Document) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
      const post = AllPosts?.find((post) => post._id.toString() == savePost.post.toString());
      return {
        ...post,
        creator: {
          imageUrl: currentUser.imageUrl,
        },
      };
    })
    .reverse();

  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full max-w-5xl">
        <img
          src="/assets/icons/save.svg"
          width={36}
          height={36}
          alt="edit"
          className="invert-white"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
      </div>

      {!currentUser ? (
        <Loader />
      ) : (
        <ul className="w-full flex justify-center max-w-5xl gap-9">
          {savePosts.length === 0 ? (
            <p className="text-light-4">No available posts</p>
          ) : (
            <GridPostList posts={savePosts} showStats={true} />
          )}
        </ul>
      )}
    </div>
  );
};

export default Saved;