/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useUserContext } from "@/context/AuthContext";
import { multiFormatDateString } from "@/lib/utils";
import { Models } from "appwrite";
import PostStats from "./PostStats";
import { Link } from "react-router-dom";

// @ts-ignore
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

type PostCardProps = {
  post: Models.Document;
};

function PostCard({ post }: PostCardProps) {
  const { user } = useUserContext();

  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator._id}`}>
            <LazyLoadImage
              src={
                `${import.meta.env.VITE_API_URL}/uploads/${post?.creator?.profilePicture}` ||
              "/assets/icons/profile-placeholder.svg"
              }
              alt="profile"
              effect="blur"
              className="rounded-full w-12 lg:h-12"
            />
          </Link>
          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              {post.creator.name}
            </p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular">
                {multiFormatDateString(post.$createdAt)}
              </p>
              -
              <p className="subtle-semibold lg:small-regular">
                {post.location}
              </p>
            </div>
          </div>
        </div>
        <Link to={`/update-post/${post._id}`} className={`${user.id !== post.creator._id && "hidden"}`}>
          <img src="/assets/icons/edit.svg" alt="edit" width={20} height={20} />
        </Link>
      </div>

      <Link to={`/posts/${post._id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{post.caption}</p>
          <ul className="flex gap-1 mt-2">
            {post.tags.map((tag: string) => (
              <li key={tag} className="text-light-3">#{tag}</li>
            ))}
          </ul>
        </div>
        <LazyLoadImage
          src={`${import.meta.env.VITE_API_URL}/uploads/${post.imageUrl}` || '/assets/icons/profile-placeholder.svg'}
          alt="post image"
          effect="blur"
          wrapperClassName="w-full"
        />
      </Link>

      <PostStats post={post} userId={user.id} />
    </div>
  );
}

export default PostCard;