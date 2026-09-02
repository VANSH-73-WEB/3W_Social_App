import { Home, LogOut, Sparkles, UserRound } from "lucide-react";
import React from "react";
function Layout({ children, session, view, onViewChange, onLogout }) {
  return (
    <main className="app-shell">
      <aside className="rail">
        <div className="brand-mark">
          <Sparkles size={22} />
        </div>
        <button
          className={`rail-button ${view === "feed" ? "active" : ""}`}
          title="Social feed"
          aria-label="Social feed"
          onClick={() => onViewChange("feed")}
        >
          <Home size={22} />
        </button>
        <button
          className={`rail-button ${view === "profile" ? "active" : ""}`}
          title={session ? "My posts" : "Login to view your profile"}
          aria-label="My posts"
          disabled={!session}
          onClick={() => onViewChange("profile")}
        >
          <UserRound size={22} />
        </button>
      </aside>

      <section className="phone-frame">
        <header className="topbar">
          <div>
            <p className="eyebrow">TaskPlanet Social</p>
            <h1>{view === "profile" ? "My Posts" : "Community Feed"}</h1>
          </div>
          {session ? (
            <button className="icon-button" onClick={onLogout} title="Logout" aria-label="Logout">
              <LogOut size={19} />
            </button>
          ) : null}
        </header>

        {children}
      </section>
    </main>
  );
}

export default Layout;
