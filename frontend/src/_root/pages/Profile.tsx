import { useState, useEffect } from "react";
import {
  Link,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/loader";
import PopupBox from "@/components/shared/PopupBox";
import { Button } from "@/components/ui/button";
import {
  useAddFollow,
  useDeleteFollow,
  useGetUserById,
} from "@/lib/react-query/queriesAndMutation";
import LikedPosts from "./LikedPosts";
import { useCurrentUserContext } from "@/context/UserContext";

type StatBlockProps = {
  value: string | number;
  label: string;
  onClick?: () => void;
};

const StatBlock = ({ value, label, onClick }: StatBlockProps) => (
  <div className="flex-center gap-2 cursor-pointer" onClick={onClick}>
    <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
    <p className="small-medium lg:base-medium text-light-2">{label}</p>
  </div>
);

const Profile = () => {
  const { id } = useParams();
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
  const { data: user, isLoading, isError, error } = useGetUserById(id);

  const { pathname } = useLocation();
  const [follow, setFollow] = useState("Follow");
  const { currentUser, refetchCurrentUser } = useCurrentUserContext();
  const { mutateAsync: addFollow, isPending: loadingAddFollow } =
    useAddFollow();
  const { mutate: removeFollow, isPending: loadingRemoveFollow } =
    useDeleteFollow();

  const [showPopup, setShowPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupUsers, setPopupUsers] = useState([]);

  const [stats, setStats] = useState({ followers: 0, following: 0 });

  const navigate = useNavigate();

  
  useEffect(() => {
    if (currentUser && user) {
      setStats({
        followers: user.followers.length,
        following: user.following.length,
      });
      
      setFollow(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
        user.followers.some((follower) => follower._id === currentUser.id)
          ? "Following"
          : "Follow"
      );
    }
  }, [currentUser, user, follow]);

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  if (!user) {
    return <div>No user found</div>;
  }

  const handleFollow = async () => {
    if (follow === "Follow") {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
      await addFollow({ senderId: currentUser?._id, receiverId: user._id });
      setFollow("Following");
      setStats((prev) => ({ ...prev, followers: prev.followers + 1 }));
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
      await removeFollow({ senderId: currentUser?._id, receiverId: user._id });
      setFollow("Follow");
      setStats((prev) => ({ ...prev, followers: prev.followers - 1 }));
    }
    refetchCurrentUser();
  };

  const handleStatsUpdate = (action: "follow" | "unfollow") => {
    setStats((prev) => ({
      ...prev,
      following: action === "follow" ? prev.following + 1 : prev.following - 1,
    }));
  };

  const showFollowers = () => {
    setPopupTitle("Followers");
    setPopupUsers(user.followers);
    setShowPopup(true);
  };

  const showFollowing = () => {
    setPopupTitle("Following");
    setPopupUsers(user.following);
    setShowPopup(true);
  };

  const handleMessage = () => {
    navigate(`/chat`);
  }

  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={
              user.profilePicture !== "default_profile.svg"
                ? `${import.meta.env.VITE_API_URL}/uploads/${user.profilePicture}`
                : "assets/icons/profile-placeholder.svg"
            }
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full object-cover"
          />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {user.username}
              </h1>
            </div>

            <div className="flex gap-8 mt-8 items-center justify-center xl:justify-start flex-wrap z-20">
              <StatBlock value={user.posts.length} label="Posts" />
              <StatBlock
                value={stats.followers}
                label="Followers"
                onClick={showFollowers}
              />
              <StatBlock
                value={stats.following}
                label="Following"
                onClick={showFollowing}
              />
            </div>

            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
              {user.bio}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <div className={`${user._id !== currentUser?._id && "hidden"}`}>
              <Link
                to={`/update-profile/${currentUser?._id}`}
                className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${
                  user.id !== currentUser?._id && "hidden"
                }`}
              >
                <img
                  src={"/assets/icons/edit.svg"}
                  alt="edit"
                  width={20}
                  height={20}
                />
                <p className="flex whitespace-nowrap small-medium">
                  Edit Profile
                </p>
              </Link>
            </div>

            <div className={`${user._id === currentUser?._id && "hidden"}`}>
              <div className="flex flex-row gap-5">
                <Button
                  type="button"
                  className="shad-button_primary px-8"
                  onClick={handleFollow}
                >
                  {loadingAddFollow && loadingRemoveFollow ? (
                    <Loader />
                  ) : (
                    follow
                  )}
                </Button>

                <Button type="button" className="px-7 bg-off-white" onClick={handleMessage}>
                  <span className="text-black">Message</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Routes for the Posts and liked Posts */}
      {currentUser?._id === user._id && (
        <div className="flex max-w-5xl w-full">
          <Link
            to={`/profile/${id}`}
            className={`profile-tab rounded-l-lg ${
              pathname === `/profile/${id}` && "!bg-dark-3"
            }`}
          >
            <img
              src={"/assets/icons/posts.svg"}
              alt="posts"
              width={20}
              height={20}
            />
            Posts
          </Link>
          <Link
            to={`/profile/${id}/liked-posts`}
            className={`profile-tab rounded-r-lg ${
              pathname === `/profile/${id}/liked-posts` && "!bg-dark-3"
            }`}
          >
            <img
              src={"/assets/icons/like.svg"}
              alt="like"
              width={20}
              height={20}
            />
            Liked Posts
          </Link>
        </div>
      )}

      <Routes>
        <Route
          index
          element={<GridPostList posts={user.posts} showUser={false} />}
        />
        <Route path="/liked-posts" element={<LikedPosts />} />
      </Routes>

      <Outlet />

      {showPopup && (
        <PopupBox
          isOpen={showPopup}
          users={popupUsers}
          onClose={() => setShowPopup(false)}
          title={popupTitle}
          onStatsUpdate={handleStatsUpdate}
          currentUserId={user.id}
        />
      )}
    </div>
  );
};

export default Profile;
