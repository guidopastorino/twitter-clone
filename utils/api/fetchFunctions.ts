// Functions to handle data in the database

import { UserType, PostType } from '@/types/types'
import axios from 'axios'

// Fetch post data
export const fetchPostData = async (postId: string): Promise<PostType> => {
  const response = await axios.get(`/api/posts/${postId}`)
  return response.data
}

// Fetch user data
// 'id' could be the following fields: '_id' or 'username' in order to fetch data for a user
export const fetchUser = async (id: string) => {
  try {
    const response = await axios.get(`/api/users/${id}`)
    if (response.status !== 200) {
      throw new Error("Error fetching the user data")
    }
    return response.data
  } catch (error) {
    console.log(error instanceof Error ? error.message : "Unknown error")
  }
}

// Fetch users data
// Function to fetch users data by an array of user ids
// Returns an array of objects which represents data of each user 
export const fetchUsers = async (userIds: string[]) => {
  try {
    const params = userIds.map((id) => `userIds=${id}`).join('&');
    const response = await axios.get(`/api/users?${params}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

// Fetch post comments
// postId: Id of the post which contains the comments
export const fetchPostComments = async (postId: string) => {
  try {
    const response = await axios.get(`/api/posts/${postId}/comments`)
    if (response.status !== 200) {
      throw new Error("Error fetching the post's comments data")
    }
    return response.data
  } catch (error) {
    console.log(error instanceof Error ? error.message : "Unknown error")
  }
}

// Fetch user comments
export const fetchUserComments = async (userId: string) => {
  try {
    const response = await axios.get(`/api/users/${userId}/comments`)
    if (response.status !== 200) {
      throw new Error("Error fetching the user's comments data")
    }
    return response.data
  } catch (error) {
    console.log(error instanceof Error ? error.message : "Unknown error")
  }
}