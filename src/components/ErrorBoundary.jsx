import { Component } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export class ModuleErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Module failed to render', error, info);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) {
      return (
        <section className="section module-error">
          <AlertTriangle size={22} />
          <h2>This module failed to load</h2>
          <p className="muted">Something went wrong rendering this page. Other modules are unaffected.</p>
          <button className="ghost-button" onClick={() => this.setState({ error: null })} type="button">
            <RefreshCcw size={14} /> Try again
          </button>
        </section>
      );
    }
    return this.props.children;
  }
}
