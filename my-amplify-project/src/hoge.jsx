import React, { useState, useEffect } from "react";
import "./App.css";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import awsExports from "./aws-exports";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [postContent, setPostContent] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentContent, setCommentContent] = useState("");
  const [showCommentPopup, setShowCommentPopup] = useState(false);
  const [openPosts, setOpenPosts] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const openCommentPopup = (post) => {
    setSelectedPost(post);
    setShowCommentPopup(true);
  };

  const textWithBreaks = (text) => ({ __html: text.replace(/\n/g, "<br />") });

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const toggleComments = (postId) => {
    if (openPosts.includes(postId)) {
      setOpenPosts(openPosts.filter((id) => id !== postId));
    } else {
      setOpenPosts([...openPosts, postId]);
    }
  };

  const addCommentToPost = (post, user) => {
    if (commentContent.trim()) {
      setCommentContent("");
      setShowCommentPopup(false);
    }
  };

  const addPost = (user) => {
    if (postContent.trim()) {
      setPostContent("");
    }
  };

  const fetchPosts = () => {
    // モックデータ
    const mockPosts = [
      {
        id: "1",
        username: "User1",
        createdAt: new Date().toISOString(),
        content: "モックの書き込みです",
        comments: [
          {
            id: "c1",
            owner: "Commenter1",
            createdAt: new Date().toISOString(),
            content: "モックのコメントです",
          },
        ],
      },
      // 他のモックデータを追加
    ];
    setPosts(mockPosts);
  };
  return (
    <Authenticator>
      {({ signOut, user }) => {
        return (
          <div className="App">
            <header>
              <h1>Hello User</h1>
            </header>
            <main>
              <div className="rule">
                <h2>爆速開発掲示板</h2>
                <p>爆速で開発を進めるためのノウハウを共有する掲示板です。</p>
                <ul>
                  <li>
                    荒らし行為は禁止です。ルールを守って健全に利用しましょう。
                  </li>
                  <li>
                    具体的な問題点や解決策を共有する際は、詳細を書き込んでください。
                  </li>
                  <li>過去の投稿は検索機能を使用して探すことができます。</li>
                  <li>
                    情報の正確さを第一に考え、信憑性の低い情報の共有は避けましょう。
                  </li>
                </ul>
                <p>全てのユーザーが快適に利用できるようにご協力ください。</p>
              </div>
              <div className="postsList">
                {posts.map((post, index) => (
                  <div key={post.id} className="post">
                    <h3>
                      {index + 1}: {post.username} {formatDate(post.createdAt)}
                    </h3>
                    <p>{post.content}</p>
                    <div className="postButtons">
                      <button onClick={() => toggleComments(post.id)}>
                        {openPosts.includes(post.id)
                          ? "コメントを閉じる"
                          : "コメントを表示"}
                      </button>
                      <button onClick={() => openCommentPopup(post)}>
                        コメントを追加
                      </button>
                    </div>
                    {openPosts.includes(post.id) && (
                      <div className="postComments">
                        {post.comments
                          .sort(
                            (a, b) =>
                              new Date(a.createdAt) - new Date(b.createdAt)
                          )
                          .map((comment) => (
                            <div key={comment.id} className="singleComment">
                              <span className="commentUser">
                                {comment.owner || "名無し"}
                              </span>
                              <span className="commentDate">
                                {formatDate(comment.createdAt)}
                              </span>
                              <p
                                dangerouslySetInnerHTML={textWithBreaks(
                                  comment.content
                                )}
                              ></p>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="postForm">
                <div className="userInfo">
                  <div className="inputGroup">
                    <label htmlFor="name">名前:</label>
                    <input
                      type="text"
                      id="name"
                      placeholder="名無し"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="inputGroup">
                    <label htmlFor="email">Eメール:</label>
                    <input
                      type="email"
                      id="email"
                      placeholder="example@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="本文"
                />
                <button onClick={() => addPost()}>書き込む</button>
              </div>
              {showCommentPopup && (
                <div className="commentPopup">
                  <h4>コメントを追加 - {selectedPost.username}</h4>
                  <textarea
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="コメント内容"
                  />
                  <button onClick={() => addCommentToPost()}>追加</button>
                  <button onClick={() => setShowCommentPopup(false)}>
                    閉じる
                  </button>
                </div>
              )}
            </main>
          </div>
        );
      }}
    </Authenticator>
  );
}
