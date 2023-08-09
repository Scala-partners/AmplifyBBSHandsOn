import React, { useState, useEffect } from "react";
import { Amplify, API, graphqlOperation, Auth } from 'aws-amplify';
import { GRAPHQL_AUTH_MODE } from '@aws-amplify/api';

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsExports from './aws-exports';
import './App.css';
Amplify.configure(awsExports);

// GraphQL操作のインポート
import { listPosts } from './graphql/queries';
import { createPost } from './graphql/mutations';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [postContent, setPostContent] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const postData = await API.graphql(graphqlOperation(listPosts));
      setPosts(postData.data.listPosts.items);
    } catch (err) {
      console.error("Error fetching posts: ", err);
    }
  }


 return (
  <Authenticator>
    {({ signOut, user }) => {

      async function addPost() {
        try {    const session = await Auth.currentSession();  // 現在のユーザーセッションを取得
    const token = session.idToken.jwtToken;  
          console.log("postContent", postContent);
          if (!postContent) return;
          const newPost = {
            type: "POST",
            username: user.username,
            content: postContent
          };
          console.log("token🍎", token)
          await API.graphql({query: createPost, variables: 
          {input: newPost}, authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS});
          fetchPosts();
          setPostContent('');
        } catch (err) {
          console.error("Error creating post: ", err);
        }
      }

      return (
        <main>
          <h1>Hello {user.username}</h1>
          <button onClick={signOut}>Signout</button>

          <div className="postForm">
            <textarea
              value={postContent}
              onChange={e => setPostContent(e.target.value)}
              placeholder="Write your post"
            />
            <button onClick={addPost}>Post</button>
          </div>

          <div className="postsList">
            {posts.map(post => (
              <div key={post.id} className="post">
                <p>{post.content}</p>
              </div>
            ))}
          </div>
        </main>
      );
    }}
  </Authenticator>
);

}
