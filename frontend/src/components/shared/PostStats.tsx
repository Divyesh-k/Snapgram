import {
  useDeleteSavedPost,
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
};

const PostStats = ({ post, userId }: PostStatsProps) => {
  const likesList = post?.likes;

  const [likes, setLikes] = useState<string[]>(likesList);
  
  const [isSaved, setIsSaved] = useState(false);
  const [savedPostRecord, setSavedPostRecord] =
    useState<Models.Document | null>(null);

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost, isPending: isSavingPost } = useSavePost();
  const { mutate: deleteSavePost, isPending: isDeletingSaved } =
    useDeleteSavedPost();
  const { data: currentUser, isLoading: isLoadingUser } = useGetCurrentUser();

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
    }
  }, [currentUser, post]);

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

  if (isLoadingUser) {
    return <Loader />;
  }

  return (
    <div className={`flex justify-between items-center z-20 mt-4`}>
      <div className="flex gap-2 mr-5">
        <img
          src={`${
            checkIsLiked(likes, userId)
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }`}
          alt="like"
          width={20}
          height={20}
          onClick={handleLikePost}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>

      <div className="flex gap-2">
        {isSavingPost || isDeletingSaved ? (
          <Loader />
        ) : (
          <img
            src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
            alt="share"
            width={20}
            height={20}
            className="cursor-pointer"
            onClick={handleSavePost}
          />
        )}
      </div>
    </div>
  );
};

export default PostStats;
