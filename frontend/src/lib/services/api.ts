/* eslint-disable @typescript-eslint/ban-ts-comment */
import { INewUser } from "@/types";
// import { account, appwriteConfig, databases, storage } from "./config";
// import { ID, Query } from "appwrite";

const apiUrl = import.meta.env.VITE_API_URL;

export async function createUserAccount(user: INewUser) {
  try {
    const response = await fetch(`${apiUrl}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        email: user.email,
        password: user.password,
        username: user.username,
      }),
    });

    if (!response.ok) {
      throw new Error("Account creation failed");
    }

    const newUser = await response.json(); // Assuming server responds with the created user object

    // You may optionally handle additional logic here, such as saving user data to local storage or performing other actions

    return newUser;
  } catch (error) {
    console.error("Error creating user account:", error);
    throw error; // Rethrow the error to handle it further up the call stack
  }
}

// ============================== SAVE USER TO DB
// export async function saveUserToDB(user: {
//   accountId: string;
//   email: string;
//   name: string;
//   imageUrl: URL;
//   username?: string;
// }) {
//   try {
//     const newUser = await databases.createDocument(
//       appwriteConfig.databaseId,
//       appwriteConfig.userCollectionId,
//       ID.unique(),
//       user
//     );

//     return newUser;
//   } catch (error) {
//     console.log(error);
//   }
// }

// ============================== SIGN IN
export async function signInAccount(user: { email: string; password: string }) {
  try {
    const response = await fetch(`${apiUrl}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return new Error(errorData.message || "Failed to sign in");
    }

    const { token } = await response.json();

    localStorage.setItem("token", token);

    return token;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
}

export async function signOutAccount() {
  try {
    localStorage.removeItem("token");
    return { status: "ok" };
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
}

// // ============================== GET ACCOUNT
// export async function getAccount() {
//   try {
//     const currentAccount = await account.get();

//     return currentAccount;
//   } catch (error) {
//     console.log(error);
//   }
// }

// Example function to fetch current user from backend
export async function getCurrentUser() {
  try {
    const token = getJWTToken(); // Get JWT token from local storage

    if (!token) {
      throw new Error("Token not found");
    }

    const response = await fetch(`${apiUrl}/auth/current-user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });

    if (!response.ok) {
      throw new Error("Error fetching current user");
    }

    const currentUser = await response.json();
    console.log("CurrentUser", currentUser);
    return currentUser;
  } catch (error) {
    console.error("Fetch current user error:", error);
    return null;
  }
}

export async function createPost(post: {
  file: File[];
  userId: string;
  caption: string;
  location: string;
  tags: string;
}) {
  // Assume you have a function to get the JWT token
  const token = getJWTToken();

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    // First, upload the file
    const formData = new FormData();
    formData.append("file", post.file[0]);

    const uploadResponse = await fetch(`${apiUrl}/upload/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Access-Control-Allow-Origin": "*",
      },
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error("File upload failed");
    }

    const uploadResult = await uploadResponse.json();
    const fileUrl = uploadResult.fileUrl;
    const fileId = uploadResult.fileId;

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Create post
    const postResponse = await fetch(`${apiUrl}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,

        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: fileId,
        location: post.location,
        tags: tags,
      }),
    });

    if (!postResponse.ok) {
      // If post creation fails, attempt to delete the uploaded file
      await fetch(`${apiUrl}/upload/${fileId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,

          "Access-Control-Allow-Origin": "*",
        },
      });
      throw new Error("Post creation failed");
    }

    const newPost = await postResponse.json();
    return newPost;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}

// Helper function to get JWT token (implement this based on your auth system)
function getJWTToken(): string | null {
  // This is just an example. Replace with your actual method of retrieving the token.
  return localStorage.getItem("token");
}

// ============================== UPLOAD FILE
// export async function uploadFile(file: File) {
//   try {
//     const uploadedFile = await storage.createFile(
//       appwriteConfig.storageId,
//       ID.unique(),
//       file
//     );

//     return uploadedFile;
//   } catch (error) {
//     console.log(error);
//   }
// }

// ============================== GET FILE URL
// export function getFilePreview(fileId: string) {
//   try {
//     const fileUrl = storage.getFilePreview(
//       appwriteConfig.storageId,
//       fileId,
//       2000,
//       2000,
//       "top",
//       100
//     );

//     if (!fileUrl) throw Error;

//     return fileUrl;
//   } catch (error) {
//     console.log(error);
//   }
// }

// ============================== DELETE FILE
// export async function deleteFile(fileId: string) {
//   try {
//     await storage.deleteFile(appwriteConfig.storageId, fileId);

//     return { status: "ok" };
//   } catch (error) {
//     console.log(error);
//   }
// }

// Define the async function to fetch recent posts
export async function getRecentPosts() {
  const url = `${apiUrl}/posts/`;

  try {
    // Make the GET request to the backend API
    const response = await fetch(url);

    // Check if the response is okay (status in the range 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the JSON response
    const data = await response.json();

    // Return the recent posts data
    console.log("Recent posts:", data);
    return data;
  } catch (error) {
    // Handle any errors that occurred during the fetch
    console.error("Error fetching recent posts:", error);
    throw error;
  }
}

// ============================== LIKE / UNLIKE POST
export async function likePost(postId: string, likesArray: string[]) {
  try {
    const token = getJWTToken();
    console.log(postId, likesArray);
    const response = await fetch(`${apiUrl}/posts/updateLikes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,

        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ postId, likesArray }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const updatedPost = await response.json();
    return updatedPost;
  } catch (error) {
    console.error("Error:", error);
  }
}

// ============================== SAVE POST
export async function savePost(userId: string, postId: string) {
  const authToken = getJWTToken();

  const response = await fetch(`${apiUrl}/save/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,

      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ userId, postId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to save post");
  }

  return await response.json();
}
// ============================== DELETE SAVED POST
export async function deleteSavedPost(savedRecordId: string) {
  const token = getJWTToken(); // Assuming you store the auth token in localStorage

  try {
    const response = await fetch(`${apiUrl}/save/${savedRecordId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",

        "Access-Control-Allow-Origin": "*",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete saved post");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting saved post:", error);
    throw error;
  }
}

export async function getPostById(postId: string) {
  const token = getJWTToken();
  const url = `${apiUrl}/posts/${postId}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,

        "Access-Control-Allow-Origin": "*",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Post not found");
      } else {
        throw new Error("Something went wrong");
      }
    }

    const post = await response.json();
    return post;
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    throw error;
  }
}

// @ts-ignore
export async function updatePost(post) {
  const token = getJWTToken();

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };

    if (post.file.length > 0) {
      // Upload the new file
      const formData = new FormData();
      formData.append("file", post.file[0]);

      const uploadResponse = await fetch(`${apiUrl}/upload/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,

          "Access-Control-Allow-Origin": "*",
        },
        body: formData,
      });

      console.log("uploaded", uploadResponse);

      if (!uploadResponse.ok) {
        throw new Error("File upload failed");
      }

      const uploadResult = await uploadResponse.json();
      image = {
        imageUrl: uploadResult.fileUrl,
        imageId: uploadResult.fileId,
      };
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Update the post
    const updateResponse = await fetch(`${apiUrl}/posts/${post.postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,

        "Access-Control-Allow-Origin": "*",
      },

      body: JSON.stringify({
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }),
    });

    if (!updateResponse.ok) {
      if (post.file.length > 0) {
        // If update fails, delete the uploaded file
        await fetch(`${apiUrl}/upload/${image.imageId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,

            "Access-Control-Allow-Origin": "*",
          },
        });
      }
      throw new Error("Post update failed");
    }

    const updatedPost = await updateResponse.json();
    return updatedPost;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
}

export async function deletePost(postId: string, imageId: string) {
  const token = getJWTToken();

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    // Delete the post
    const postResponse = await fetch(`${apiUrl}/posts/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,

        "Access-Control-Allow-Origin": "*",
      },
    });

    if (!postResponse.ok) {
      throw new Error("Failed to delete post");
    }

    // Delete the associated image
    const imageResponse = await fetch(`${apiUrl}/upload/${imageId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,

        "Access-Control-Allow-Origin": "*",
      },
    });

    if (!imageResponse.ok) {
      console.warn("Failed to delete associated image");
    }

    return await postResponse.json();
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}
// export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
//   const queries: string[] = [Query.orderDesc("$updatedAt"), Query.limit(10)];

//   if (pageParam) {
//     queries.push(Query.cursorAfter(pageParam.toString()));
//   }

//   try {
//     const posts = await databases.listDocuments(
//       appwriteConfig.databaseId,
//       appwriteConfig.postCollectionId,
//       queries
//     );

//     if (!posts) throw Error;
//     return posts;
//   } catch (error) {
//     console.log(error);
//   }
// }

// export async function searchPosts(searchTerm: string) {
//   try {
//     const posts = await databases.listDocuments(
//       appwriteConfig.databaseId,
//       appwriteConfig.postCollectionId,
//       [Query.search("caption", searchTerm)]
//     );
//     if (!posts) throw Error;
//     return posts;
//   } catch (error) {
//     console.log(error);
//   }
// }

//////////////////////////////////////////////////////////// users

//get top users
export async function getUsers(limit?: number) {
  try {
    const response = await fetch(`${apiUrl}/users/all?limit=${limit}`);
    if (!response.ok) {
      return new Error("Failed to fetch users");
    }
    const users = await response.json();
    console.log("Users", users);
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error; // Propagate error to caller
  }
}

//Get User By Id
export async function getUserById(userId: string) {
  const url = `${apiUrl}/users/${userId}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",

      "Access-Control-Allow-Origin": "*",
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok: " + response.statusText);
  }
  const user = await response.json();
  console.log("User", user);
  return user;
}

export async function updateUser(user: {
  userId: string;
  email: string;
  file: File[];
  username?: string;
  bio: string;
}) {
  // Assume you have a function to get the JWT token
  const token = getJWTToken();

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    // First, upload the file
    const formData = new FormData();
    formData.append("file", user.file[0]);

    const uploadResponse = await fetch(`${apiUrl}/upload/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,

        "Access-Control-Allow-Origin": "*",
      },
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error("File upload failed");
    }

    const uploadResult = await uploadResponse.json();
    const fileUrl = uploadResult.fileUrl;
    const fileId = uploadResult.fileId;

    // Create post
    const userResponse = await fetch(`${apiUrl}/users/${user.userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,

        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        username: user.username,
        email: user.email,
        bio: user.bio,
        profilePicture: fileUrl,
      }),
    });

    if (!userResponse.ok) {
      // If post creation fails, attempt to delete the uploaded file
      await fetch(`${apiUrl}/upload/${fileId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,

          "Access-Control-Allow-Origin": "*",
        },
      });
      throw new Error("Post creation failed");
    }

    const newPost = await userResponse.json();
    return newPost;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}

export async function addFollow(senderId: string, receiverId: string) {
  const token = getJWTToken(); // Assume you have a function to get the JWT token

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await fetch(`${apiUrl}/follow/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,

        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ senderId, receiverId }),
    });

    if (!response.ok) {
      throw new Error("Failed to follow user");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error following user:", error);
    throw error;
  }
}

// ============================== Delete Follow
export async function deleteFollow(senderId: string, receiverId: string) {
  const token = getJWTToken();
  try {
    const response = await fetch(`${apiUrl}/follow/unfollow`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Assuming you are using Bearer token for authentication

        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ senderId, receiverId }),
    });

    if (!response.ok) {
      throw new Error("Failed to unfollow user");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

//===================================uploading content

export async function upload(file: File) {
  const token = getJWTToken();

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${apiUrl}/upload/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,

        "Access-Control-Allow-Origin": "*",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("File upload failed");
    }

    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

// New delete function
export async function deleteUpload(fileId: string) {
  const token = getJWTToken();

  try {
    const response = await fetch(`${apiUrl}/upload/${fileId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",

        "Access-Control-Allow-Origin": "*",
      },
    });

    if (!response.ok) {
      throw new Error("File deletion failed");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
}

//////////////////Story UPload and Delete Functionality
// Function to save a new story

const API_BASE_URL = `${apiUrl}/stories`;

export async function saveStory(mediaUrl: string, mediaType: string) {
  const token = getJWTToken();

  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,

        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ mediaUrl, mediaType }),
    });

    if (!response.ok) {
      throw new Error("Failed to save story");
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving story:", error);
    throw error;
  }
}

// Function to delete a story
// @ts-ignore
export async function deleteStory(storyId) {
  const token = getJWTToken();
  try {
    const response = await fetch(`${API_BASE_URL}/${storyId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,

        "Access-Control-Allow-Origin": "*",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete story");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting story:", error);
    throw error;
  }
}

// Function to get user's stories
export async function getUserStories() {
  const token = getJWTToken();
  try {
    const response = await fetch(`${API_BASE_URL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,

        "Access-Control-Allow-Origin": "*",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user stories");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user stories:", error);
    throw error;
  }
}

// Function to get all active stories
export async function getAllActiveStories() {
  try {
    const response = await fetch(`${API_BASE_URL}/all`);

    if (!response.ok) {
      throw new Error("Failed to fetch all active stories");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching all active stories:", error);
    throw error;
  }
}

//function for the all chat messages
// api.ts
export const fetchMessages = async (userId: string, otherUserId: string) => {
  console.log("ids in the api", userId, otherUserId);
  const response = await fetch(`${apiUrl}/chat/${userId}/${otherUserId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch messages");
  }
  return response.json();
};


export async function getCommentsByPost(postId: string) {
  try {
    const response = await fetch(`${apiUrl}/comments/${postId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch comments");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
}

export async function createComment(comment: { post_id: string; content: string , author : string, parent_id : string}) {
  const token = getJWTToken();
  try {
    const response = await fetch(`${apiUrl}/comments/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(comment),
    });

    if (!response.ok) {
      return new Error("Failed to create comment");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
}