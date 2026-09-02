import { AtSign, KeyRound, LogIn, User, UserPlus } from "lucide-react";
import React from "react";
function AuthPanel({ authMode, authForm, onModeChange, onFormChange, onSubmit }) {
  return (
    <section className="auth-panel">
      <div className="mode-switch">
        <button className={authMode === "login" ? "selected" : ""} onClick={() => onModeChange("login")}>
          <LogIn size={16} />
          <span>Login</span>
        </button>
        <button
          className={authMode === "signup" ? "selected" : ""}
          onClick={() => onModeChange("signup")}
        >
          <UserPlus size={16} />
          <span>Signup</span>
        </button>
      </div>
      <form onSubmit={onSubmit} className="stack-form">
        {authMode === "signup" ? (
          <div className="input-with-icon">
            <User size={17} />
            <input
              value={authForm.username}
              onChange={(event) => onFormChange({ ...authForm, username: event.target.value })}
              placeholder="Username"
              minLength="2"
              required
            />
          </div>
        ) : null}
        <div className="input-with-icon">
          <AtSign size={17} />
          <input
            value={authForm.email}
            onChange={(event) => onFormChange({ ...authForm, email: event.target.value })}
            placeholder="Email address"
            type="email"
            required
          />
        </div>
        <div className="input-with-icon">
          <KeyRound size={17} />
          <input
            value={authForm.password}
            onChange={(event) => onFormChange({ ...authForm, password: event.target.value })}
            placeholder="Password"
            type="password"
            minLength="6"
            required
          />
        </div>
        <button className="primary-button" type="submit">
          {authMode === "signup" ? <UserPlus size={17} /> : <LogIn size={17} />}
          <span>{authMode === "signup" ? "Create account" : "Login"}</span>
        </button>
      </form>
    </section>
  );
}

export default AuthPanel;
