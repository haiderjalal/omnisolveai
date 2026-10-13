"use client";

import { Component, type ReactNode } from "react";

interface CanvasBoundaryProps {
  children: ReactNode;
  /** Called once if rendering the 3D scene throws (e.g. WebGL is unavailable). */
  onError: () => void;
}

interface CanvasBoundaryState {
  failed: boolean;
}

/**
 * Error boundary around the 3D canvas. If WebGL cannot start (blocked, unsupported, context
 * lost at creation) the page quietly falls back to the static globe instead of showing an error.
 */
export class CanvasBoundary extends Component<CanvasBoundaryProps, CanvasBoundaryState> {
  state: CanvasBoundaryState = { failed: false };

  static getDerivedStateFromError(): CanvasBoundaryState {
    return { failed: true };
  }

  componentDidCatch(): void {
    this.props.onError();
  }

  render(): ReactNode {
    return this.state.failed ? null : this.props.children;
  }
}
