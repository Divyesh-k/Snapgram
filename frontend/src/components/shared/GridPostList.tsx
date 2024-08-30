import { Models } from "appwrite";
import { Link } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
import PostStats from "./PostStats";
import Masonry from 'react-masonry-css';

//@ts-ignore
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useState, useMemo } from 'react';

type GridPostListProps = {
  posts: Models.Document[];
  showUser?: boolean;
  showStats?: boolean;
};

const GridPostList = ({
  posts,
  showUser = true,
  showStats = true,
}: GridPostListProps) => {
  const { user } = useUserContext();
  const [loadedImages, setLoadedImages] = useState<{ [key: string]: boolean }>({});

  const breakpointColumnsObj = useMemo(() => ({
    default: posts.length > 3 ? 4 : posts.length,
    1100: posts.length > 2 ? 3 : posts.length,
    700: posts.length > 1 ? 2 : 1,
    500: 1
  }), [posts.length]);

  const handleImageLoad = (postId: string) => {
    setLoadedImages(prev => ({ ...prev, [postId]: true }));
  };

  console.log("posts", posts);

  return (
    <div className={`grid-container ${posts.length === 1 ? 'single-image' : ''}`}>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {posts.map((post) => (
          post._id && 
          <div key={post._id} className="relative mb-4 group overflow-hidden">
            <Link to={`/posts/${post._id}`} className="grid-post_link">
              <LazyLoadImage
                src={`${import.meta.env.VITE_API_URL}/uploads/${post.imageUrl}`}
                alt="post"
                effect="blur"
                afterLoad={() => handleImageLoad(post._id)}
                className="w-full transition-transform duration-300 group-hover:scale-110"
                wrapperClassName="w-full"
              />
              {loadedImages[post._id] && (
                <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end">
                  <div className="p-2">
                    {showUser && (
                      <div className="flex items-center justify-start gap-2 flex-1 absolute top-4 left-4">
                        <img
                          src={
                            `${import.meta.env.VITE_API_URL}/uploads/${post.creator.imageUrl}`||
                            "/assets/icons/profile-placeholder.svg"
                          }
                          alt="creator"
                          className="w-8 h-8 rounded-full"
                        />
                        <p className="line-clamp-1 text-white">{post.creator.username}</p>
                      </div>
                    )}
                    {showStats && <PostStats post={post} userId={user.id} />}
                  </div>
                </div>
              )}
            </Link>
          </div>
        ))}
      </Masonry>
    </div>
  );
};

export default GridPostList;