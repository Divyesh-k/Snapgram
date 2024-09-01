import {
  useCreateComment,
  useDeleteSavedPost,
  useGetCommentsByPost,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from "@/lib/react-query/queriesAndMutation";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";
import Loader from "@/components/shared/loader";
import React, { useEffect, useState } from "react";

type PostStatsProps = {
  post: Models.Document;
  userId: string;
  comment: boolean;
};

const PostStats = ({ post, userId, comment = false }: PostStatsProps) => {
  const likesList = post?.likes;
  const [likes, setLikes] = useState<string[]>(likesList);
  const [isSaved, setIsSaved] = useState(false);
  const [savedPostRecord, setSavedPostRecord] =
    useState<Models.Document | null>(null);
  const [commentText, setCommentText] = useState("");

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost, isPending: isSavingPost } = useSavePost();
  const { mutate: deleteSavePost, isPending: isDeletingSaved } =
    useDeleteSavedPost();
  const { data: currentUser, isLoading: isLoadingUser } = useGetCurrentUser();

  const { mutateAsync: addComment } = useCreateComment();
  const { data: comments, refetch: commentRefetch } = useGetCommentsByPost(
    post?._id || ""
  );
  console.log("Comments:", comments);
  const [totalComments, setTotalComments] = useState<number>(
    comments?.length || 0
  );

  useEffect(() => {
    if (currentUser && post) {
      let savedPost = null;
      for (const save of currentUser.saves) {
        if (save.post == post._id) {
          savedPost = save;
          break;
        }
      }
      setSavedPostRecord(savedPost);
      setIsSaved(!!savedPost);

      commentRefetch();
      setTotalComments(comments?.length || 0);
    }
  }, [currentUser, post]);

  useEffect(() => {
    setTotalComments(comments?.length || 0);
  }, [comments]);

  const handleLikePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();
    let likesArray = [...likes];
    if (likesArray.includes(userId)) {
      likesArray = likesArray.filter((Id) => Id !== userId);
    } else {
      likesArray.push(userId);
    }
    setLikes(likesArray);
    likePost({ postId: post?._id, likesArray });
  };

  const handleSavePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();
    if (savedPostRecord) {
      deleteSavePost(savedPostRecord._id);
      setSavedPostRecord(null);
      setIsSaved(false);
    } else {
      savePost({ userId: userId, postId: post._id });
      setIsSaved(true);
    }
  };

  const handleCommentSubmit = async () => {
    console.log("Submitting comment:", commentText);

    // Optimistically update the totalComments count
    setTotalComments((prevCount) => prevCount + 1);

    try {
      await addComment({
        post_id: post._id,
        content: commentText,
        author: currentUser._id,
        parent_id: post._id,
      });

      // Clear the comment input after submission
      setCommentText("");

      // Refetch comments to ensure consistency
      commentRefetch();
      console.log("Comment added successfully");
    } catch (error) {
      console.error("Error adding comment:", error);

      // Revert the optimistic update in case of an error
      setTotalComments((prevCount) => prevCount - 1);
    }
  };

  if (isLoadingUser) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center z-20 mt-4">
        <div className="flex gap-4">
          <div className="flex gap-2 items-center">
            <img
              src={
                checkIsLiked(likes, userId)
                  ? "/assets/icons/liked.svg"
                  : "/assets/icons/like.svg"
              }
              alt="like"
              width={20}
              height={20}
              onClick={handleLikePost}
              className="cursor-pointer"
            />
            <p className="small-medium lg:base-medium">{likes.length}</p>
          </div>
          {comment && (
            <div className="flex gap-2 items-center">
              <img
                src="/assets/icons/comment.svg"
                alt="comment"
                width={20}
                height={20}
                className="cursor-pointer"
              />
              <p className="small-medium lg:base-medium">
                {totalComments || 0}
              </p>
            </div>
          )}
        </div>
        <div className="flex">
          {isSavingPost || isDeletingSaved ? (
            <Loader />
          ) : (
            <img
              src={
                isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"
              }
              alt="save"
              width={20}
              height={20}
              className="cursor-pointer"
              onClick={handleSavePost}
            />
          )}
        </div>
      </div>
      <div className="mt-6 flex items-center rounded-lg">
        <img
          src={
            `${import.meta.env.VITE_API_URL}/uploads/${
              currentUser?.profilePicture
            }` || "/assets/icons/profile-placeholder.svg"
          }
          alt="user avatar"
          className="w-8 h-8 rounded-full ml-2 gap-2 object-cover"
        />
        <input
          type="text"
          placeholder="Write your comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="flex-grow bg-transparent text-light-1 placeholder-light-4 p-2 outline-none bg-dark-4 break-words"
        />
        <button
          onClick={handleCommentSubmit}
          className=" text-light-1 px-4 py-2 rounded-r-lg"
        >
          <img src="/assets/icons/send.svg" alt="send" width={20} height={20} />
        </button>
      </div>
    </div>
  );
};

export default PostStats;
