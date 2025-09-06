import React, { useState } from "react";
const API_BASE = process.env.REACT_APP_API_URL || "";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        throw new Error(data?.detail || "Đăng nhập thất bại");
      }
      localStorage.setItem("admin_logged", "1");
      localStorage.setItem("admin_user", JSON.stringify(data.user || {}));
      window.location.href = "/admin/tickets";
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{maxWidth: 420, margin: "56px auto"}}>
      <h2>Đăng nhập Admin</h2>
      <form onSubmit={submit} style={{display:"grid", gap: 10, marginTop: 16}}>
        <label>Tài khoản</label>
        <input value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="admin" />

        <label>Mật khẩu</label>
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" />

        {err && <div style={{color:"#b91c1c"}}>{err}</div>}

        <button className="btn primary" type="submit" disabled={loading || !username || !password}>
          {loading ? "Đang vào..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
}
