/* eslint-disable @typescript-eslint/ban-ts-comment */

// import { Models } from "appwrite";
import { Link } from "react-router-dom";

import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import {
  useAddFollow,
  useDeleteFollow,
} from "@/lib/react-query/queriesAndMutation";
import { useCurrentUserContext } from "@/context/UserContext";

// @ts-ignore
const UserCard = ({ user }) => {
  const { mutateAsync: addFollow, isPending: followPending } = useAddFollow();
  const { mutateAsync: unFollow, isPending: unFollowPending } =
    useDeleteFollow();
  const [isFollowing, setIsFollowing] = useState(false);
  const { currentUser , refetchCurrentUser} = useCurrentUserContext();
  useEffect(() => {
    if (currentUser && user) {
      setIsFollowing(
        currentUser.following.some(
          (followedUser) => followedUser._id === user._id
        )
      );
    }
  }, [currentUser, user]);

  const followHandle = async () => {
    if (!currentUser || !user) return; // Prevent action if currentUser or user is not loaded

    if (!isFollowing) {
      if (!followPending) {
        await addFollow({ senderId: currentUser._id, receiverId: user._id });
        setIsFollowing(true);
      }
    } else {
      if (!unFollowPending) {
        await unFollow({ senderId: currentUser._id, receiverId: user._id });
        setIsFollowing(false)
      }
    }

    await refetchCurrentUser();
  };

  // You can use isFollowing to conditionally render the button text
  const buttonText = isFollowing ? "Following" : "Follow";

  return (
    <div className="user-card">
      <Link to={`/profile/${user._id}`}>
        <img
          src={
            user.profilePicture !== "default_profile.svg"
              ? `${import.meta.env.VITE_API_URL}/uploads/${user.profilePicture}`
              : "/assets/icons/profile-placeholder.svg"
          }
          alt="creator"
          className="rounded-full w-14 h-14 object-cover"
        />

        <div className="flex-center flex-col gap-1">
          <p className="base-medium text-light-1 text-center line-clamp-1">
            {user.username}
          </p>
        </div>
      </Link>
      <Button
        type="button"
        size="sm"
        className={
          buttonText == "Follow"
            ? "shad-button_primary px-5"
            : "shad-button_secondary px-5"
        }
        onClick={followHandle}
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default UserCard;
