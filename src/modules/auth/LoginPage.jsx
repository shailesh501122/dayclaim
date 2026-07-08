import { ArrowRight, BrainCircuit, Eye, LockKeyhole, ShieldCheck, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import './LoginPage.css';

export function LoginPage() {
  return (
    <main className="login-page">
      <section className="login-panel">
        <Link className="login-logo" to="/login">
          <span className="logo-mark">DC</span>
          <strong>DayClaim.ai</strong>
        </Link>

        <form className="login-form">
          <label>
            <span><UserRound size={14} /><input placeholder="Username" defaultValue="" /></span>
          </label>
          <label>
            <span><LockKeyhole size={14} /><input placeholder="Password" defaultValue="" type="password" /><Eye size={15} /></span>
          </label>
          <Link className="login-submit" to="/dashboard/business-metrics">
            Login <ArrowRight size={15} />
          </Link>
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
