/**
 * @fileoverview ErrorBoundary - Enterprise error boundary component
 * @description Catches JavaScript errors anywhere in the child component tree
 * @version 1.0.0 - Initial implementation with enterprise error handling
 * @requires React 16+ for error boundary functionality
 */

import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      error,
      errorInfo,
    })

    // Log error for monitoring (in production, send to error tracking service)
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div 
          className="enterprise-page"
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--spacing-8)',
            backgroundColor: 'var(--color-slate-50)'
          }}
        >
          <div 
            style={{
              maxWidth: '600px',
              padding: 'var(--spacing-8)',
              backgroundColor: 'white',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-error-600)',
              textAlign: 'center'
            }}
          >
            <div 
              style={{
                fontSize: '3rem',
                marginBottom: 'var(--spacing-6)',
                color: 'var(--color-error-600)'
              }}
            >
              ⚠️
            </div>
            
            <h1 className="heading-2" style={{ color: 'var(--color-error-600)' }}>
              Application Error
            </h1>
            
            <p className="body-base" style={{ marginBottom: 'var(--spacing-6)' }}>
              Something went wrong. Please refresh the page or contact support if the problem persists.
            </p>
            
            <button
              onClick={() => window.location.reload()}
              className="btn-base btn-primary"
              style={{
                minHeight: '2.75rem',
                fontSize: 'var(--font-size-base)',
                fontWeight: '500',
                padding: 'var(--spacing-3) var(--spacing-6)',
                backgroundColor: 'var(--color-primary-600)',
                color: 'white',
                borderRadius: 'var(--radius-lg)',
                border: 'none',
                gap: 'var(--spacing-2)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              Reload Application
            </button>
            
            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details 
                style={{ 
                  marginTop: 'var(--spacing-6)',
                  textAlign: 'left',
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-slate-600)'
                }}
              >
                <summary style={{ cursor: 'pointer', fontWeight: '500' }}>
                  Error Details (Development Only)
                </summary>
                <pre 
                  style={{
                    marginTop: 'var(--spacing-3)',
                    padding: 'var(--spacing-4)',
                    backgroundColor: 'var(--color-slate-100)',
                    borderRadius: 'var(--radius-base)',
                    overflow: 'auto',
                    fontSize: 'var(--font-size-xs)'
                  }}
                >
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary