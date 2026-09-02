import React from "react";
import AuthPanel from "./components/AuthPanel.jsx";
import Composer from "./components/Composer.jsx";
import FeedHeader from "./components/FeedHeader.jsx";
import Layout from "./components/Layout.jsx";
import Pagination from "./components/Pagination.jsx";
import PostCard from "./components/PostCard.jsx";
import { API_URL, STORAGE_KEY } from "./config/api.js";

const getStoredSession = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (_error) {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

function App() {
  const [session, setSession] = React.useState(getStoredSession);
  const [view, setView] = React.useState("feed");
  const [authMode, setAuthMode] = React.useState("login");
  const [authForm, setAuthForm] = React.useState({ username: "", email: "", password: "" });
  const [posts, setPosts] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [composer, setComposer] = React.useState({ text: "", image: "" });
  const [commentText, setCommentText] = React.useState({});

  const request = React.useCallback(
    async (path, options = {}) => {
      const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
          ...options.headers
        }
      });

      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await response.json()
        : { message: "Server returned an unexpected response" };
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      return data;
    },
    [session]
  );

  const loadPosts = React.useCallback(
    async (nextPage = 1) => {
      setIsLoading(true);
      try {
        const data = await request(`/api/posts?page=${nextPage}&limit=6`);
        setPosts(data.posts);
        setTotalPages(data.totalPages);
        setPage(data.page);
      } catch (error) {
        setMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    },
    [request]
  );

  React.useEffect(() => {
    loadPosts(1);
  }, [loadPosts]);

  const saveSession = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setSession(data);
  };

  const handleAuth = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const path = authMode === "signup" ? "/api/auth/signup" : "/api/auth/login";
      const body =
        authMode === "signup"
          ? authForm
          : { email: authForm.email, password: authForm.password };
      const data = await request(path, {
        method: "POST",
        body: JSON.stringify(body)
      });
      saveSession(data);
      setAuthForm({ username: "", email: "", password: "" });
      setMessage(`Welcome ${data.user.username}`);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
    setView("feed");
    setMessage("Logged out");
  };

  const handleImageFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 1_500_000) {
      setMessage("Please choose an image under 1.5 MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setComposer((current) => ({ ...current, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const createPost = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const post = await request("/api/posts", {
        method: "POST",
        body: JSON.stringify(composer)
      });
      setPosts((current) => [post, ...current]);
      setComposer({ text: "", image: "" });
      setMessage("Post shared");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const replacePost = (updatedPost) => {
    setPosts((current) => current.map((post) => (post.id === updatedPost.id ? updatedPost : post)));
  };

  const toggleLike = async (postId) => {
    if (!session) {
      setMessage("Login to like posts");
      return;
    }

    try {
      const updatedPost = await request(`/api/posts/${postId}/like`, { method: "POST" });
      replacePost(updatedPost);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const addComment = async (event, postId) => {
    event.preventDefault();
    if (!session) {
      setMessage("Login to comment");
      return;
    }

    try {
      const updatedPost = await request(`/api/posts/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify({ text: commentText[postId] })
      });
      replacePost(updatedPost);
      setCommentText((current) => ({ ...current, [postId]: "" }));
    } catch (error) {
      setMessage(error.message);
    }
  };
  const handleDeletePost = async (postId) => {
  try {
    await request(`/api/posts/${postId}`, {
      method: "DELETE",
    });

    setPosts((prev) =>
      prev.filter((post) => post.id !== postId)
    );

    setMessage("Post deleted successfully");
  } catch (error) {
    setMessage(error.message);
  }
};

  const visiblePosts =
    view === "profile" && session
      ? posts.filter((post) => String(post.author.user) === String(session.user.id))
      : posts;

  return (
    <Layout session={session} view={view} onViewChange={setView} onLogout={handleLogout}>
      {message ? <div className="toast">{message}</div> : null}

      {!session ? (
        <AuthPanel
          authMode={authMode}
          authForm={authForm}
          onModeChange={setAuthMode}
          onFormChange={setAuthForm}
          onSubmit={handleAuth}
        />
      ) : view === "feed" ? (
        <Composer
          composer={composer}
          username={session.user.username}
          onComposerChange={setComposer}
          onImageFile={handleImageFile}
          onSubmit={createPost}
        />
      ) : null}

      <FeedHeader isLoading={isLoading} shownCount={visiblePosts.length} view={view} />

      <section className="feed-list">
        {visiblePosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            session={session}
            commentText={commentText[post.id] || ""}
            onCommentTextChange={setCommentText}
            onLike={toggleLike}
            onComment={addComment}
            onDelete={handleDeletePost}
          />
        ))}
        {!isLoading && visiblePosts.length === 0 ? (
          <div className="empty-state">
            {view === "profile"
              ? "You haven't posted anything on this page yet."
              : "No posts yet. Share the first update after logging in."}
          </div>
        ) : null}
      </section>

      {view === "feed" ? (
        <Pagination page={page} totalPages={totalPages} onPageChange={loadPosts} />
      ) : null}
    </Layout>
  );
}

export default App;
