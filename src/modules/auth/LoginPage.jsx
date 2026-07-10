import { useState } from 'react';
import { ArrowRight, BrainCircuit, Eye, EyeOff, LockKeyhole, ShieldCheck, UserRound } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import './LoginPage.css';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from
    ? `${location.state.from.pathname}${location.state.from.search}`
    : '/dashboard/business-metrics';

  async function handleSubmit(event) {
    event.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Enter a username and password to continue.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await login(username.trim(), password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-panel">
        <Link className="login-logo" to="/login">
          <span className="logo-mark">DC</span>
          <strong>DayClaim.ai</strong>
        </Link>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <label>
            <span>
              <UserRound size={14} />
              <input
                autoComplete="username"
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Username"
                value={username}
              />
            </span>
          </label>
          <label>
            <span>
              <LockKeyhole size={14} />
              <input
                autoComplete="current-password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
              />
              <button
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                type="button"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </span>
          </label>

          {error && <span className="field-error">{error}</span>}

          <button className="login-submit" disabled={submitting} type="submit">
            {submitting ? 'Signing in…' : <>Login <ArrowRight size={15} /></>}
          </button>
        </form>

        <button className="reset-link" type="button">Reset Password</button>
      </section>

      <section className="hero-copy">
        <div className="premium-band">
          <div className="product-brand">
            <span className="brand-chip">DayClaim.ai</span>
            <span className="brand-status">AI Revenue Cycle Workspace</span>
          </div>
          <h2>Premium AR follow-up intelligence for high-performing RCM teams.</h2>
          <div className="metric-row-login">
            <span><strong>42%</strong> fewer manual touches</span>
            <span><strong>18d</strong> faster ageing recovery</span>
            <span><strong>24/7</strong> workflow visibility</span>
          </div>
        </div>

        <div className="welcome-panel">
          <h1>Welcome to <b>DayClaim.ai</b></h1>
          <p>
            Unleashing artificial intelligence, machine learning, and workflow automation
            on revenue cycle management to improve collections, reduce denials, and accelerate profitability.
          </p>
          <div className="welcome-actions">
            <button type="button">Explore Platform</button>
            <span><BrainCircuit size={15} /> AI-assisted denial routing</span>
            <span><ShieldCheck size={15} /> Governed operations</span>
          </div>
        </div>
      </section>

      <footer className="login-footer">Copyright (c) DayClaim.ai 2026. All Rights Reserved.</footer>
    </main>
  );
}
