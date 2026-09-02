import { Image, Send, X } from "lucide-react";
import React from "react";
function Composer({ composer, username, onComposerChange, onImageFile, onSubmit }) {
  return (
    <section className="composer">
      <div className="avatar">{username[0]?.toUpperCase()}</div>
      <form onSubmit={onSubmit}>
        <textarea
          value={composer.text}
          onChange={(event) => onComposerChange({ ...composer, text: event.target.value })}
          placeholder="Post an update, win, question, or task tip..."
          maxLength="800"
        />
        {composer.image ? (
          <div className="preview-wrap">
            <img src={composer.image} alt="Selected post preview" />
            <button
              type="button"
              className="remove-image-btn"
              onClick={() => onComposerChange({ ...composer, image: "" })}
            >
              <X size={15} />
              <span>Remove image</span>
            </button>
          </div>
        ) : null}
        <div className="composer-actions">
          <label className="ghost-button">
            <Image size={17} />
            <span>Image</span>
            <input type="file" accept="image/*" onChange={onImageFile} />
          </label>
          <button className="send-button" type="submit" title="Create post" aria-label="Create post">
            <Send size={18} />
          </button>
        </div>
      </form>
    </section>
  );
}

export default Composer;
