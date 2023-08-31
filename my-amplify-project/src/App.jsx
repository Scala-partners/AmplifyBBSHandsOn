import React, { useState, useEffect } from "react";
import { Amplify, API, graphqlOperation } from "aws-amplify";
import { GRAPHQL_AUTH_MODE } from "@aws-amplify/api";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import awsExports from "./aws-exports";
import "./App.css";
import { createPost, createComment } from "./graphql/mutations";
import { postsByCreatedat, listComments } from "./graphql/queries";

Amplify.configure(awsExports);

function App({ signOut, user }) {
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

  // テキスト内の改行をHTMLの<br>タグに変換するための関数
  const textWithBreaks = (text) => ({ __html: text.replace(/\n/g, "<br />") });

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
  const addCommentToPost = async (post, user) => {
    if (commentContent.trim()) {
      try {
        const newComment = {
          content: commentContent,
          postCommentsId: post.id,
          owner: user.username,
        };
        console.log("newComment", newComment);
        await API.graphql({
          query: createComment,
          variables: { input: newComment },
          authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
        });
        fetchPosts();
        setCommentContent("");
        setShowCommentPopup(false);
      } catch (err) {
        console.error("Error creating comment: ", err);
      }
    }
  };

  // 書き込みを行うための関数
  const addPost = async (user) => {
    try {
      if (!postContent) return;
      const newPost = {
        type: "POST", // GSIのためのおまじない
        username: name || user.username,
        content: postContent,
        email: email,
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
  };

  // 掲示板に投稿された内容を取得する
  const fetchPosts = async () => {
    try {
      // 最新の書き込みを取得する。
      const postData = await API.graphql(
        graphqlOperation(
          postsByCreatedat,
          {
            type: "POST",
            sortDirection: "DESC",
          },
          GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS
        )
      );

      // 取得した投稿とコメントの情報をReactのstateに保存
      setPosts(postData.data.PostsByCreatedat.items);
    } catch (err) {
      // エラーが発生した場合、エラーメッセージを表示。
      console.error("Error fetching posts: ", err);
    }
  };

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
                  {post.comments.items
                    .sort(
                      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
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
          <button onClick={() => addPost(user)}>書き込む</button>
        </div>
        {showCommentPopup && (
          <div className="commentPopup">
            <h4>コメントを追加 - {selectedPost.username}</h4>
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="コメント内容"
            />
            <button onClick={() => addCommentToPost(selectedPost, user)}>
              追加
            </button>
            <button onClick={() => setShowCommentPopup(false)}>閉じる</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default withAuthenticator(App);
