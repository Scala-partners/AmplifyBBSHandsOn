import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  /**
   * useStateは、Reactアプリ内で動的なデータ（stateと呼ばれる）を保存・管理するための機能。
   * useStateを使うと、2つの値が返されます。
   * 1つ目は、データ（state）そのもの。
   * 2つ目は、そのデータを更新するための関数。
   * "posts"はデータ（state）を参照するための変数で、初期値として空の配列[]が設定されています。
   * "setPosts"は、"posts"のデータを更新するための関数です。
   * この関数を使って、後から"posts"の値を変更することができます。
   */
  const [posts, setPosts] = useState([]);
  const [postContent, setPostContent] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentContent, setCommentContent] = useState("");
  const [showCommentPopup, setShowCommentPopup] = useState(false);
  const [openPosts, setOpenPosts] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");


  //useEffectは、特定のタイミングで何かの処理を実行するための機能です。
  // 以下のコードは、アプリが画面に表示されたときに、fetchPostsという関数を実行するためのものです。
  useEffect(() => {
    fetchPosts();
  }, []);

  // コメントを書き込むポップアップを表示するための関数
  const openCommentPopup = (post) => {
    setSelectedPost(post);
    setShowCommentPopup(true);
  };

  /**
   * 日付をわかりやすい形式に変換するための関数
   * 例: 2023-08-22T08:11:23.128Z -> 2023年8月22日 17:11
   */
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

  // コメントの表示を切り替えるための関数
  const toggleComments = (postId) => {
    if (openPosts.includes(postId)) {
      setOpenPosts(openPosts.filter((id) => id !== postId));
    } else {
      setOpenPosts([...openPosts, postId]);
    }
  };

  // 書き込みに対してコメントを投稿するための関数
  const addCommentToPost = (post, user) => {
    if (commentContent.trim()) {
      setCommentContent("");
      setShowCommentPopup(false);
    }
  };

  // 書き込みを行うための関数
  const addPost = (user) => {
    if (postContent.trim()) {
      setPostContent("");
    }
  };


  // 掲示板に投稿された内容を取得する
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
    ];
    setPosts(mockPosts);
  };

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
                  <button onClick={() => addCommentToPost()}>
                    追加
                  </button>
                  <button onClick={() => setShowCommentPopup(false)}>
                    閉じる
                  </button>
                </div>
              )}
      </main>
    </div>
  );
}

export default App;