import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaTrash,
  FaEdit,
  FaHeart,
  FaUserFriends,
  FaImage,
  FaPaperPlane,
} from "react-icons/fa";

const API_BASE = "https://fittrack-backend1.onrender.com/api";

const Community = () => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser")) || null;
    } catch {
      return null;
    }
  });

  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchPosts = async () => {
    try {
      const [postsRes, profileRes] = await Promise.all([
        axios.get(`${API_BASE}/community/posts`, getAuthConfig()),
        axios.get(`${API_BASE}/users/profile`, getAuthConfig()),
      ]);

      setPosts(postsRes.data.posts || []);
      setCurrentUser(profileRes.data.user || null);

      if (profileRes.data.user) {
        localStorage.setItem("currentUser", JSON.stringify(profileRes.data.user));
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load community");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePost = async () => {
    if (!text.trim() && !image) return;

    try {
      if (editingId) {
        const res = await axios.put(
          `${API_BASE}/community/posts/${editingId}`,
          {
            content: text,
            image,
          },
          getAuthConfig()
        );

        setPosts((prev) =>
          prev.map((p) => (p.id === editingId ? res.data.post : p))
        );
        setEditingId(null);
      } else {
        const res = await axios.post(
          `${API_BASE}/community/posts`,
          {
            content: text,
            image,
          },
          getAuthConfig()
        );

        setPosts((prev) => [res.data.post, ...prev]);
      }

      setText("");
      setImage(null);
      setImageName("");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save post");
    }
  };

  const handleEdit = (post) => {
    setText(post.content || "");
    setImage(post.image || null);
    setImageName(post.image ? "Selected image" : "");
    setEditingId(post.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/community/posts/${id}`, getAuthConfig());
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete post");
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await axios.post(
        `${API_BASE}/community/posts/${postId}/like`,
        {},
        getAuthConfig()
      );

      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? res.data.post : p))
      );
    } catch (error) {
      alert(error.response?.data?.message || "Failed to like post");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageName(file.name);

    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const clearSelectedImage = () => {
    setImage(null);
    setImageName("");
  };

  const handleCommentChange = (postId, value) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, newComment: value } : p))
    );
  };

  const handleCommentSubmit = async (postId, commentText) => {
    if (!commentText?.trim()) return;

    try {
      const res = await axios.post(
        `${API_BASE}/community/posts/${postId}/comments`,
        { text: commentText },
        getAuthConfig()
      );

      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...res.data.post, newComment: "" } : p
        )
      );
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add comment");
    }
  };

  const uniqueMembers = [
    ...new Set(posts.map((p) => p.userName).filter(Boolean))
  ];

  const totalComments = posts.reduce(
    (sum, post) => sum + (post.comments?.length || 0),
    0
  );

  const activePostsToday = posts.filter((p) => p.likes.length > 0).length;

  if (loading) {
    return (
      <p className="text-center mt-10 text-emerald-600 font-bold">
        Loading...
      </p>
    );
  }

  if (!currentUser) {
    return (
      <p className="text-red-500 text-center mt-10">
        No logged-in user found!
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100  p-4 md:p-6 overflow-x-hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-5 rounded-2xl shadow border border-zinc-200">
            <label className="block mb-3 font-semibold text-zinc-800">
              Post as {currentUser.name}
            </label>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share your progress..."
              className="w-full border rounded-xl p-3 mb-3 min-h-[110px] outline-none focus:ring-2 focus:ring-emerald-300"
            />

            <div className="flex flex-wrap items-center gap-3 mb-3">
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 cursor-pointer hover:bg-emerald-200 transition text-sm font-medium">
                <FaImage />
                Choose Image
                <input
                  type="file"
                  onChange={handleImageUpload}
                  className="hidden"
                  accept="image/*"
                />
              </label>

              {imageName && (
                <span className="text-sm text-zinc-600">{imageName}</span>
              )}

              {image && (
                <button
                  onClick={clearSelectedImage}
                  className="text-sm px-3 py-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
                >
                  Remove Image
                </button>
              )}
            </div>

            {image && (
              <img
                src={image}
                alt="preview"
                className="max-w-full max-h-96 rounded-xl mb-3 border"
              />
            )}

            <button
              onClick={handlePost}
              className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-500 text-white rounded-full text-sm font-semibold hover:bg-emerald-600 transition"
            >
              <FaPaperPlane />
              {editingId ? "Update Post" : "Post"}
            </button>
          </div>

          {posts.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl shadow border border-zinc-200 text-center text-zinc-500">
              No posts yet. Be the first to share your progress.
            </div>
          ) : (
            posts.map((post) => {
              const isLiked = post.likes.includes(currentUser.id);

              return (
                <div
                  key={post.id}
                  className="bg-white p-5 rounded-2xl shadow border border-zinc-200 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-zinc-800">{post.userName}</h3>

                    {post.userId === currentUser.id && (
                      <div className="flex gap-3 text-sm">
                        <FaEdit
                          onClick={() => handleEdit(post)}
                          className="cursor-pointer text-blue-500"
                        />
                        <FaTrash
                          onClick={() => handleDelete(post.id)}
                          className="cursor-pointer text-red-500"
                        />
                      </div>
                    )}
                  </div>

                  {post.content && (
                    <p className="text-gray-700 leading-relaxed">{post.content}</p>
                  )}

                  {post.image && (
                    <img
                      src={post.image}
                      alt="post"
                      className="w-full max-h-[600px] rounded-xl object-cover"
                    />
                  )}

                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition ${
                        isLiked
                          ? "bg-red-500 text-white"
                          : "bg-zinc-100 text-gray-700 hover:bg-zinc-200"
                      }`}
                    >
                      <FaHeart /> {post.likes.length}
                    </button>
                  </div>

                  <div className="mt-2 space-y-2">
                    {post.comments.map((c) => (
                      <div
                        key={c.id}
                        className="text-sm text-gray-700 bg-zinc-50 px-3 py-2 rounded-lg"
                      >
                        <b>{c.user}:</b> {c.text}
                      </div>
                    ))}

                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        className="flex-1 border p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                        value={post.newComment || ""}
                        onChange={(e) =>
                          handleCommentChange(post.id, e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && post.newComment?.trim()) {
                            handleCommentSubmit(post.id, post.newComment);
                          }
                        }}
                      />
                      <button
                        onClick={() =>
                          handleCommentSubmit(post.id, post.newComment)
                        }
                        className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="sticky top-6 h-fit space-y-4">
          <div className="bg-white p-5 rounded-2xl shadow border border-zinc-200 text-center">
            <FaUserFriends className="text-3xl mx-auto text-emerald-500" />
            <h3 className="font-bold mt-2 text-zinc-800">Community</h3>
            <p className="text-sm text-gray-600">Stay active and connected</p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow border border-zinc-200">
            <h4 className="font-semibold mb-3 text-zinc-800">Stats</h4>
            <p className="text-sm text-zinc-700">👥 Members: {uniqueMembers.length}</p>
            <p className="text-sm text-zinc-700">📝 Posts: {posts.length}</p>
            <p className="text-sm text-zinc-700">💬 Comments: {totalComments}</p>
            <p className="text-sm text-zinc-700">🔥 Active Today: {activePostsToday}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
