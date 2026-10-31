import { Component } from "react";

// Renders `fallback` instead of crashing the page (e.g. WebGL unavailable, a lazy chunk failing to load).
export default class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.warn("Section failed to render, showing fallback:", error);
  }

  render() {
    return this.state.failed ? this.props.fallback ?? null : this.props.children;
  }
}
