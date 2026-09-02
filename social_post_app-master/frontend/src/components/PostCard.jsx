import { Heart, MessageCircle, Send, Trash2 } from "lucide-react";
import React from "react";
function PostCard({
  post,
  session,
  commentText,
  onCommentTextChange,
  onLike,
  onComment,
  onDelete,
  
}) {
  const liked = Boolean(session && post.likes.some((like) => like.user === session.user.id));
  const likeNames = post.likes.map((like) => like.username).join(", ");
  const commentNames = [...new Set(post.comments.map((comment) => comment.username))].join(", ");

  return (
    <article className="post-card">
      <header className="post-author">
        <div className="avatar small">{post.author.username[0]?.toUpperCase()}</div>
        <div>
          <h3>{post.author.username}</h3>
          <time>{new Date(post.createdAt).toLocaleString()}</time>
        </div>
      </header>
      {post.text ? <p className="post-text">{post.text}</p> : null}
      {post.image ? <img className="post-image" src={post.image} alt={`${post.author.username}'s post`} /> : null}

      <div className="stats">
        <span title={likeNames || "No likes yet"}>{post.likesCount} likes</span>
        <span title={commentNames || "No comments yet"}>{post.commentsCount} comments</span>
      </div>

    <div className="post-actions">
  <button className={liked ? "liked" : ""} onClick={() => onLike(post.id)}>
    <Heart size={18} fill={liked ? "currentColor" : "none"} />
    <span>{liked ? "Liked" : "Like"}</span>
  </button>

  <span>
    <MessageCircle size={18} />
    Comment
  </span>

  {session && session.user.id === post.author.user && (
    
    <button
      className="delete-btn"
      onClick={() => onDelete(post.id)}
    >
      <Trash2 size={18} />
      <span>Delete</span>
    </button>
  )}
</div>

      {post.comments.length ? (
        <div className="comments">
          {post.comments.slice(-2).map((comment) => (
            <p key={comment._id}>
              <strong>{comment.username}</strong> {comment.text}
            </p>
          ))}
        </div>
      ) : null}

      <form className="comment-form" onSubmit={(event) => onComment(event, post.id)}>
        <input
          value={commentText}
          onChange={(event) =>
            onCommentTextChange((current) => ({ ...current, [post.id]: event.target.value }))
          }
          placeholder={session ? "Write a comment..." : "Login to comment"}
          disabled={!session}
        />
        <button type="submit" disabled={!session || !commentText.trim()} title="Send comment" aria-label="Send comment">
          <Send size={16} />
        </button>
      </form>
    </article>
  );
}

export default PostCard;
