import React from 'react';

// Composant classe obligatoire : les hooks ne peuvent pas capturer les erreurs React.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback !== undefined) return this.props.fallback;
      return (
        <div style={{
          padding: '1rem',
          color: '#ff2e63',
          border: '1px dashed #ff2e63',
          borderRadius: '4px',
          fontSize: '0.75rem',
          fontFamily: "'Courier New', monospace",
        }}>
          ⚠️ MFE indisponible
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
