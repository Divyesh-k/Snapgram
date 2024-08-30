/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import {
  useDeleteFollow,
  useAddFollow,
} from "@/lib/react-query/queriesAndMutation";
import { useCurrentUserContext } from '@/context/UserContext';
import { IUser } from "@/types";

interface PopupBoxProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  users: IUser[];
  onStatsUpdate: (action: 'follow' | 'unfollow') => void;
  currentUserId: string;
}

const PopupBox = ({
  isOpen,
  onClose,
  title,
  users,
  onStatsUpdate,
  currentUserId
}: PopupBoxProps) => {
  const { currentUser, refetchCurrentUser } = useCurrentUserContext();
  const { mutate: removeFollow, isPending: loadingRemoveFollow } = useDeleteFollow();
  const { mutate: addFollow, isPending: loadingAddFollow } = useAddFollow();

  if (!isOpen) return null;

  const handleUnfollow = (receiverId: string) => {
    removeFollow(
      // @ts-ignore
      { senderId: currentUser?._id, receiverId: receiverId },
      {
        onSuccess: () => {
          refetchCurrentUser();
          onStatsUpdate('unfollow');
        },
      }
    );
  };

  const handleFollow = (receiverId: string) => {
    addFollow(
      // @ts-ignore
      { senderId: currentUser?._id, receiverId: receiverId },
      {
        onSuccess: () => {
          refetchCurrentUser();
          onStatsUpdate('follow');
        },
      }
    );
  };

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const isFollowing = (userId: string) => {
    return currentUser?.following.some(
      (followedUser) => followedUser._id === userId
    );
  };

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 bg-dark-1 bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleModalClick}
    >
      <div className="bg-dark-2 rounded-3xl border border-dark-4 p-5 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="h3-bold">{title}</h2>
          <button onClick={onClose} className="text-white hover:text-white">
            &times;
          </button>
        </div>
        <div className="custom-scrollbar overflow-y-auto max-h-96">
          {users.map((user) => (
            <div
            // @ts-ignore
              key={user._id}
              className="flex items-center justify-between gap-3 py-3 border-b border-dark-4"
            >
              <div className="flex items-center gap-3">
                <img
                  src={
                    // @ts-ignore
                    user.profilePicture ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt={user.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="base-medium">{user.username}</p>
                  <p className="small-regular text-light-4">{user.email}</p>
                </div>
              </div>
              
              {// @ts-ignore
              currentUserId !== user._id && (
                <button
                  onClick={() =>
                    // @ts-ignore
                    isFollowing(user._id) ? handleUnfollow(user._id): handleFollow(user._id)
                  }
                  disabled={loadingRemoveFollow || loadingAddFollow}
                  className={`py-1 px-3 rounded-full ${
                    // @ts-ignore
                    !isFollowing(user._id)
                      ? "shad-button_primary"
                      : "shad-button_secondary"
                  }`}
                >
                  {
                  // @ts-ignore 
                  isFollowing(user._id) ? "Unfollow" : "Follow"}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopupBox;