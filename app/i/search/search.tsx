'use client';

import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface User {
  _id: string;
  username: string;
  fullname: string;
}

interface Post {
  _id: string;
  description: string;
}

const SearchPageClient = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (query) {
      const getData = async () => {
        try {
          const response = await axios.get(`/api/search?q=${encodeURIComponent(query)}`);
          const { users, posts } = response.data.results;
          setUsers(users);
          setPosts(posts);
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      };

      getData();
    }
  }, [query]);

  return (
    <div>
      <h1>Search results for "{query}"</h1>
      <div>
        <h2>Users</h2>
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user._id}>
              <Link href={`/i/${user.username}`}>{user.username}</Link>
            </div>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </div>
      <div>
        <h2>Posts</h2>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id}>
              <p>{post.description}</p>
            </div>
          ))
        ) : (
          <p>No posts found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPageClient;
