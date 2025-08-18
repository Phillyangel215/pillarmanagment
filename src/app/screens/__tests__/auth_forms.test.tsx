import { describe, it, expect } from 'vitest'
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { Auth_Login } from '@/app/screens/Auth_Login'
import Auth_Register from '@/app/screens/Auth_Register'
import Auth_Reset from '@/app/screens/Auth_Reset'

describe('Auth screens smoke', () => {
  it('renders login form', () => {
    render(<Auth_Login />)
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument()
  })

  it('renders register form', () => {
    render(<Auth_Register />)
    expect(screen.getByText(/Create account/i)).toBeInTheDocument()
  })

  it('renders reset form', () => {
    render(<Auth_Reset />)
    expect(screen.getByText(/Reset password/i)).toBeInTheDocument()
  })
})

