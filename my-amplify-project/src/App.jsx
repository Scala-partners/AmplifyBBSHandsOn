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

export default function App() {
  const [posts, setPosts] = useState([]);
  const [postContent, setPostContent] = useState("");
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

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
                            <div className="rule">
                              <h2>爆速開発掲示板</h2>
                              <p>爆速で開発を進めるためのノウハウを共有する掲示板です。</p>
                              <ul>
                                <li>荒らし行為は禁止です。ルールを守って健全に利用しましょう。</li>
                                <li>具体的な問題点や解決策を共有する際は、詳細を書き込んでください。</li>
                                <li>過去の投稿は検索機能を使用して探すことができます。</li>
                                <li>情報の正確さを第一に考え、信憑性の低い情報の共有は避けましょう。</li>
                              </ul>
                              <p>全てのユーザーが快適に利用できるようにご協力ください。</p>
                            </div>
                            <div className="postsList">
                                {posts.map((post, index) => (
                                    <div key={post.id} className="post">
                                        <h3>{index + 1}: {post.username} {formatDate(post.createdAt)}</h3>
                                        <p>{post.content}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="postForm">
                              <div className="userInfo">
                                <div className="inputGroup">
                                  <label htmlFor="name">名前:</label>
                                  <input type="text" id="name" placeholder="名無し" value={userName} onChange={(e) => setUserName(e.target.value)} />
                                </div>
                                <div className="inputGroup">
                                  <label htmlFor="email">Eメール:</label>
                                  <input type="email" id="email" placeholder="example@example.com" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
                                </div>
                              </div>
                              <textarea
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}
                                placeholder="本文"
                              />
                              <button onClick={addPost}>書き込む</button>
                            </div>

                        </main>
                    </div>
                );
            }}
    </Authenticator>
  );
}
