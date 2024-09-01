/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useRef } from "react";
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
  useGetCommentsByPost,
} from "@/lib/react-query/queriesAndMutation";
import { multiFormatDateString } from "@/lib/utils";
import { Link, useNavigate, useParams } from "react-router-dom";

const scrollbarStyles = {
  scrollbarWidth: "thin",
  scrollbarColor: "#5c5c7b #09090a",
  "&::-webkit-scrollbar": {
    width: "3px",
  },
  "&::-webkit-scrollbar-track": {
    background: "#09090a",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#5c5c7b",
    borderRadius: "50px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "#7878a3",
  },
};

const PostDetails = () => {
  const { id } = useParams();
  const { user } = useUserContext();
  const { currentUser } = useCurrentUserContext();
  const { data: post, isLoading } = useGetPostById(id || "");
  const { data: comments, isLoading: isLoadingComments } = useGetCommentsByPost(
    post?._id || ""
  );

  const { mutate: deletePost, isPending: isdeletePostLoading } =
    useDeletePost();

  const { mutate: deleteSavedPost, isPending: isdeleteSavedPostLoading } =
    useDeleteSavedPost();

  const navigate = useNavigate();
  const commentSectionRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom of the comment section when a new comment is added
  useEffect(() => {
    if (commentSectionRef.current) {
      commentSectionRef.current.scrollTop =
        commentSectionRef.current.scrollHeight;
    }
  }, [comments]);

  // Filter user's posts to create suggested posts
  const suggestedPosts =
    //@ts-ignore
    currentUser?.posts?.filter((userPost) => userPost._id !== id) || [];

  const handleDeletePost = () => {
    deletePost({ postId: post?._id ?? "", imageId: post?.imageId ?? "" });
    if (post != undefined) {
      if (post?.save) {
        //@ts-ignore
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
                    `${import.meta.env.VITE_API_URL}/uploads/${
                      post?.creator.profilePicture
                    }` || "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="w-8 h-8 lg:w-12 lg:h-12 rounded-full object-cover"
                />
                <div className="flex gap-1 flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                    {post?.creator.username}
                  </p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:base-regular">
                      {multiFormatDateString(post?.$createdAt)}
                    </p>
                    •
                    <p className="subtle-semibold lg:base-regular">
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
                    className={`post_details-delete_btn ${
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

            <div className="flex flex-1 w-full small-medium lg:base-regular">
              <span>{post?.caption}</span>
              <ul className="flex ml-2 small-medium lg:base-regular">
                {post?.tags.map((tag: string, index: string) => (
                  <li key={`${tag}${index}`} className="text-light-3">
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>

            <hr className="border w-full border-dark-4/80" />

            {/* Comments Section */}
            <div
              className="mt-4 overflow-y-scroll h-72"
              //@ts-ignore
              style={scrollbarStyles}
              ref={commentSectionRef}
            >
              {isLoadingComments ? (
                <Loader />
              ) : (
                <div
                  className={`comments-list ${comments ? "" : "h-56 w-10/12"} `}
                >
                  {comments &&
                    //@ts-ignore
                    comments.map((comment) => (
                      <div key={comment._id} className="comment-item mb-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              `${import.meta.env.VITE_API_URL}/uploads/${
                                comment.author.profilePicture
                              }` || "/assets/icons/profile-placeholder.svg"
                            }
                            alt="author"
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <span className="base-medium text-light-3">
                              {comment.author.username}
                            </span>
                            <span className="ml-3 text-light-1">
                              {comment.content}
                            </span>
                          </div>
                        </div>
                        <p className="text-light-1 small-regular">
                          {multiFormatDateString(comment.created_at)}
                        </p>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="w-full">
              <PostStats post={post} userId={user.id} comment={true} />
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl w-full mt-8">
        <h2 className="text-2xl font-bold mb-4">
          More from{" "}
          <span className="text-primary-500">
            {currentUser?.username.toLocaleUpperCase()}
          </span>
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
