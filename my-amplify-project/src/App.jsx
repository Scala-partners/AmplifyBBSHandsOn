import React, { useState, useEffect } from "react";
import { Amplify, API, graphqlOperation, Auth } from "aws-amplify";
import { GRAPHQL_AUTH_MODE } from "@aws-amplify/api";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

import awsExports from "./aws-exports";
import "./App.css";
Amplify.configure(awsExports);

// GraphQL操作のインポート
import { createPost } from "./graphql/mutations";
import { PostsByCreatedat } from './graphql/queries';

import Header from './Header';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [postContent, setPostContent] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const postData = await API.graphql(graphqlOperation(PostsByCreatedat, {
        type: "POST",
        sortDirection: 'DESC'  // 最新の投稿から順に取得
      }));
      setPosts(postData.data.PostsByCreatedat.items);
    } catch (err) {
      console.error("Error fetching posts: ", err);
    }
  }
  
  function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}
  async function checkUser() {
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      setUser(currentUser);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSignOut() {
    try {
      await Auth.signOut();
      setUser(null);
    } catch (err) {
      console.error('Error signing out: ', err);
    }
  }

  return (
    <Authenticator>
                    {({ signOut, user }) => {
                async function addPost() {
                    try {
                        if (!postContent) return;
                        const newPost = {
                            type: "POST",
                            username: user.username,
                            content: postContent,
                        };
                        await API.graphql({
                            query: createPost,
                            variables: { input: newPost },
                            authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
                        });
                        fetchPosts();
                        setPostContent("");
                    } catch (err) {
                        console.error("Error creating post: ", err);
                    }
                }

                return (
                    <div className="App">
                        <header>
                            <h1>Hello {user.username}</h1>
                            <button onClick={signOut}>サインアウト</button>
                        </header>
                        <main>
                            <div className="postForm">
                                <textarea
                                    value={postContent}
                                    onChange={(e) => setPostContent(e.target.value)}
                                    placeholder=""
                                />
                                <button onClick={addPost}>書き込む</button>
                            </div>

                            <div className="postsList">
                                {posts.map((post, index) => (
                                    <div key={post.id} className="post">
                                        <h3>{index + 1}: {post.username} {formatDate(post.createdAt)}</h3>
                                        <p>{post.content}</p>
                                    </div>
                                ))}
                            </div>
                        </main>
                    </div>
                );
            }}
    </Authenticator>
  );
}
