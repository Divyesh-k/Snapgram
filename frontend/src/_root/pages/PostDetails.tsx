import GridPostList from "@/components/shared/GridPostList";
import PostStats from "@/components/shared/PostStats";
import Loader from "@/components/shared/loader";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useCurrentUserContext } from "@/context/UserContext";
import {
  useDeletePost,
  useDeleteSavedPost,
  useGetPostById,
} from "@/lib/react-query/queriesAndMutation";
import { multiFormatDateString } from "@/lib/utils";
import { Link, useNavigate, useParams } from "react-router-dom";

const PostDetails = () => {
  const { id } = useParams();
  const { user } = useUserContext();
  const { currentUser } = useCurrentUserContext();
  const { data: post, isLoading } = useGetPostById(id || "");
  const { mutate: deletePost, isPending: isdeletePostLoading } =
    useDeletePost();

  const { mutate: deleteSavedPost, isPending: isdeleteSavedPostLoading } =
    useDeleteSavedPost();

  const navigate = useNavigate();

  // Filter user's posts to create suggested posts
  
  const suggestedPosts =
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    currentUser?.posts?.filter((userPost) => userPost._id !== id) || [];

  const handleDeletePost = () => {
    deletePost({ postId: post?._id ?? "", imageId: post?.imageId ?? "" });
    if (post != undefined) {
      if (post?.save) {
        // eslint-disable-next-line no-unsafe-optional-chaining
        for (const save of post?.save) {
          deleteSavedPost(save._id);
        }
      }
    }
    if (!isdeletePostLoading) {
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  };

  return (
    <div className="post_details-container">
      <div className="hidden md:flex max-w-5xl w-full">
        <Button
          variant="ghost"
          onClick={() => history.back()}
          className="shad-button_ghost"
        >
          <img
            src={"/assets/icons/back.svg"}
            alt="back"
            width={24}
            height={24}
          />
          <p className="small-medium lg:base-medium">Back</p>
        </Button>
      </div>

      {isLoading || !post ? (
        <Loader />
      ) : (
        <div className="post_details-card">
          <img
            src={`${import.meta.env.VITE_API_URL}/uploads/${post?.imageUrl}`}
            alt="creator"
            className="post_details-img"
          />

          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link
                to={`/profile/${post?.creator._id}`}
                className="flex items-center gap-3"
              >
                <img
                  src={
                    `${import.meta.env.VITE_API_URL}/uploads/${post?.creator.profilePicture}` ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
                />
                <div className="flex gap-1 flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                    {post?.creator.name}
                  </p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular ">
                      {multiFormatDateString(post?.$createdAt)}
                    </p>
                    •
                    <p className="subtle-semibold lg:small-regular">
                      {post?.location}
                    </p>
                  </div>
                </div>
              </Link>

              <div className="flex-center gap-4">
                <Link
                  to={`/update-post/${post?._id}`}
                  className={`${user.id !== post?.creator._id && "hidden"}`}
                >
                  <img
                    src={"/assets/icons/edit.svg"}
                    alt="edit"
                    width={24}
                    height={24}
                  />
                </Link>

                {isdeletePostLoading || isdeleteSavedPostLoading ? (
                  <Loader />
                ) : (
                  <Button
                    onClick={handleDeletePost}
                    variant="ghost"
                    className={`ost_details-delete_btn ${
                      user.id !== post?.creator._id && "hidden"
                    }`}
                  >
                    <img
                      src={"/assets/icons/delete.svg"}
                      alt="delete"
                      width={24}
                      height={24}
                    />
                  </Button>
                )}
              </div>
            </div>

            <hr className="border w-full border-dark-4/80" />

            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <p>{post?.caption}</p>
              <ul className="flex gap-1 mt-2">
                {post?.tags.map((tag: string, index: string) => (
                  <li
                    key={`${tag}${index}`}
                    className="text-light-3 small-regular"
                  >
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full">
              <PostStats post={post} userId={user.id} />
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl w-full mt-8">
        <h2 className="text-2xl font-bold mb-4">
          More from <span className="text-primary-500"> {currentUser?.username.toLocaleUpperCase()}</span>
        </h2>
        {suggestedPosts.length > 0 ? (
          <GridPostList posts={suggestedPosts} />
        ) : (
          <p>No other posts from this user.</p>
        )}
      </div>
    </div>
  );
};

export default PostDetails;
