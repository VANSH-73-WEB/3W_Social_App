import { Rss } from "lucide-react";
import React from "react";
function FeedHeader({ isLoading, shownCount, view }) {
  return (
    <div className="feed-header">
      <h2>
        <Rss size={15} />
        <span>{view === "profile" ? "Your posts" : "Latest posts"}</span>
      </h2>
      <span>{isLoading ? "Syncing..." : `${shownCount} shown`}</span>
    </div>
  );
}

export default FeedHeader;
