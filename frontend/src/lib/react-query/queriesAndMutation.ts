import {
  // useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  addFollow,
  createPost,
  createUserAccount,
  deleteFollow,
  deletePost,
  deleteSavedPost,
  deleteStory,
  deleteUpload,
  fetchMessages,
  getAllActiveStories,
  getCurrentUser,
  // getInfinitePosts,
  getPostById,
  getRecentPosts,
  getUserById,
  getUsers,
  likePost,
  savePost,
  saveStory,
  // searchPosts,
  signInAccount,
  signOutAccount,
  updatePost,
  updateUser,
  upload,
} from "../services/api";
import { INewPost, INewUser, IUpdatePost} from "@/types";
import { QUERY_KEYS } from "./queykeys";
// import { QUERY_KEYS } from "./queykeys"

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  });
};

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user),
    onError: (error) => {
      // Handle the error
      console.error("Error signing in:", error);
      return error; // This can be used to show error messages in the UI
    },
  });
};

export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: signOutAccount,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    mutationFn: (post: INewPost) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPosts,
    staleTime: 2 * 60 * 1000,
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      postId,
      likesArray,
    }: {
      postId: string;
      likesArray: string[];
    }) => likePost(postId, likesArray),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useSavePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, postId }: { userId: string; postId: string }) =>
      savePost(userId, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useDeleteSavedPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser,
    refetchOnWindowFocus: true,
    staleTime: Infinity,
  });
};

export const useGetPostById = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId,
  });
};

export const useUpdatePost = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (post: IUpdatePost) => updatePost(post),
    onSuccess: (data) => {
      client.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      });
    },
  });
};

export const useDeletePost = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, imageId }: { postId: string; imageId: string }) =>
      deletePost(postId, imageId),
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

// export const useGetPosts = () => {
//   return useInfiniteQuery({
//     queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
//     queryFn: getInfinitePosts,
//     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//     //@ts-expect-error
//     getNextPageParam: (lastPage) => {
//       // If the last page is empty, return null to indicate no more pages
//       if (lastPage && lastPage.documents.length === 0) return null;

//       // Get the ID of the last document in the current page
//       const lastId = lastPage?.documents[lastPage.documents.length - 1]?.$id;

//       // Return the lastId as the cursor for fetching the next page
//       return lastId;
//     },
//   });
// };

// export const useSearchPosts = (searchTerm: string) => {
//   return useQuery({
//     queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
//     queryFn: () => searchPosts(searchTerm),
//     enabled: !!searchTerm,
//   });
// };

export const useGetUsers = (limit?: number) => {
  return useQuery({
    queryKey: ["getUsers", limit],
    queryFn: () => getUsers(limit),
  });
};

export const useGetUserById = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
};

export const useUpdateUser = () => {
  const client = useQueryClient();
  return useMutation({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    mutationFn: (user) => updateUser(user),
    onSuccess: (data) => {
      client.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?._id],
      });
    },
  });
};

export const useAddFollow = () => {
  return useMutation({
    mutationFn: ({
      senderId,
      receiverId,
    }: {
      senderId: string;
      receiverId: string;
    }) => addFollow(senderId, receiverId),
    onSuccess: () => {
      console.log("Followed");
    },
  });
};

export const useDeleteFollow = () => {
  return useMutation({
    mutationFn: ({
      senderId,
      receiverId,
    }: {
      senderId: string;
      receiverId: string;
    }) => deleteFollow(senderId, receiverId),
    onSuccess: () => {
      console.log("Unfollowed");
    },
  });
};

//UPLOAD

export const useUpload = () => {
  return useMutation({
    mutationFn: (file: File) => upload(file),
    onSuccess: () => {
      console.log("Uploaded");
    },
  });
};

export const useRemoveUpload = () => {
  return useMutation({
    mutationFn: (fileId: string) => deleteUpload(fileId),
    onSuccess: () => {
      console.log("Uploaded File Deleted");
    },
  });
};

///Story save

export const useSaveStory = () => {
  return useMutation({
    mutationFn: ({
      mediaUrl,
      mediaType,
    }: {
      mediaUrl: string;
      mediaType: string;
    }) => saveStory(mediaUrl, mediaType),
    onSuccess: () => {
      console.log("Story Saved");
    },
  });
};

export const useDeleteStroy = () => {
  return useMutation({
    mutationFn: (storyId: string) => deleteStory(storyId),
    onSuccess: () => {
      console.log("Story Successfully Deleted");
    },
  });
};

export const useGetActiveStories = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_STORIES],
    queryFn: () => getAllActiveStories(),
  });
};

//chat queries

export const useGetChatMessages = (currentUserId: string, otherUserId: string) => {
  return useQuery({
    queryKey: ["chatMessages" , currentUserId , otherUserId],
    queryFn: () =>
      fetchMessages(currentUserId, otherUserId),
    enabled: !!currentUserId && !!otherUserId,
  });
};
