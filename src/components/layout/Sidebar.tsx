/**
 * @fileoverview Sidebar - Production-ready navigation sidebar
 * @description RBAC-aware collapsible sidebar with role-based menu sections
 * @accessibility WCAG AA+ compliant with keyboard navigation and screen reader support
 * @version 1.0.0
 */

import React, { useState } from 'react'

// Role definitions matching PILLAR requirements
export type UserRole = 
  | 'SUPER_ADMIN' | 'ADMIN' | 'CEO' | 'COO' | 'CFO' 
  | 'BOARD_MEMBER' | 'BOARD_SECRETARY' | 'PROGRAM_DIRECTOR' 
  | 'HR_MANAGER' | 'DEVELOPMENT_DIRECTOR' | 'GRANTS_MANAGER' 
  | 'SUPERVISOR' | 'CASE_WORKER' | 'SOCIAL_WORKER' 
  | 'INTAKE_SPECIALIST' | 'HOUSING_SPECIALIST' | 'RECEPTIONIST' 
  | 'VOLUNTEER' | 'CLIENT'

export interface NavigationItem {
  id: string
  label: string
  href: string
  icon: React.ReactNode
  badge?: string
  children?: NavigationItem[]
  visibleToRoles: UserRole[]
}

export interface SidebarProps {
  currentUserRole: UserRole
  currentPath?: string
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  onNavigate?: (href: string) => void
  className?: string
}

// Navigation structure with RBAC annotations
const navigationItems: NavigationItem[] = [
  // Overview - Executive dashboard
  {
    id: 'overview',
    label: 'Overview',
    href: '/overview',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    visibleToRoles: ['SUPER_ADMIN', 'ADMIN', 'CEO', 'COO', 'CFO', 'BOARD_MEMBER', 'BOARD_SECRETARY', 'PROGRAM_DIRECTOR', 'HR_MANAGER', 'DEVELOPMENT_DIRECTOR', 'GRANTS_MANAGER']
  },

  // Governance - Board and leadership
  {
    id: 'governance',
    label: 'Governance',
    href: '/governance',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    visibleToRoles: ['SUPER_ADMIN', 'ADMIN', 'CEO', 'COO', 'BOARD_MEMBER', 'BOARD_SECRETARY'],
    children: [
      {
        id: 'board-meetings',
        label: 'Board Meetings',
        href: '/governance/board-meetings',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        ),
        visibleToRoles: ['SUPER_ADMIN', 'ADMIN', 'CEO', 'COO', 'BOARD_MEMBER', 'BOARD_SECRETARY']
      },
      {
        id: 'motions',
        label: 'Motions & Voting',
        href: '/governance/motions',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        ),
        visibleToRoles: ['SUPER_ADMIN', 'ADMIN', 'CEO', 'COO', 'BOARD_MEMBER', 'BOARD_SECRETARY']
      }
    ]
  },

  // Accounts/Users/Roles - Admin roles only
  {
    id: 'accounts',
    label: 'Account Management',
    href: '/accounts',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    ),
    visibleToRoles: ['SUPER_ADMIN', 'ADMIN', 'CEO', 'COO', 'HR_MANAGER'],
    children: [
      {
        id: 'users',
        label: 'Users',
        href: '/accounts/users',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1z" />
          </svg>
        ),
        visibleToRoles: ['SUPER_ADMIN', 'ADMIN', 'CEO', 'COO', 'HR_MANAGER']
      },
      {
        id: 'roles',
        label: 'Roles & Permissions',
        href: '/accounts/roles',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        ),
        visibleToRoles: ['SUPER_ADMIN', 'ADMIN', 'CEO', 'COO']
      }
    ]
  },

  // Programs/Participants/Services - Program staff and leadership
  {
    id: 'programs',
    label: 'Programs & Services',
    href: '/programs',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    visibleToRoles: ['SUPER_ADMIN', 'ADMIN', 'CEO', 'COO', 'PROGRAM_DIRECTOR', 'SUPERVISOR', 'CASE_WORKER', 'SOCIAL_WORKER', 'INTAKE_SPECIALIST', 'HOUSING_SPECIALIST'],
    children: [
      {
        id: 'participants',
        label: 'Participants',
        href: '/programs/participants',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        ),
        visibleToRoles: ['SUPER_ADMIN', 'ADMIN', 'CEO', 'COO', 'PROGRAM_DIRECTOR', 'SUPERVISOR', 'CASE_WORKER', 'SOCIAL_WORKER', 'INTAKE_SPECIALIST', 'HOUSING_SPECIALIST']
      },
      {
        id: 'services',
        label: 'Services',
        href: '/programs/services',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        ),
        visibleToRoles: ['SUPER_ADMIN', 'ADMIN', 'CEO', 'COO', 'PROGRAM_DIRECTOR', 'SUPERVISOR', 'CASE_WORKER', 'SOCIAL_WORKER', 'INTAKE_SPECIALIST', 'HOUSING_SPECIALIST']
      }
    ]
  },

  // Cases/Clinical Notes/Housing - Direct service staff
  {
    id: 'cases',
    label: 'Case Management',
    href: '/cases',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    visibleToRoles: ['SUPER_ADMIN', 'ADMIN', 'PROGRAM_DIRECTOR', 'SUPERVISOR', 'CASE_WORKER', 'SOCIAL_WORKER', 'HOUSING_SPECIALIST'],
    children: [
      {
        id: 'clinical-notes',
        label: 'Clinical Notes',
        href: '/cases/clinical-notes',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        ),
        visibleToRoles: ['SUPER_ADMIN', 'ADMIN', 'PROGRAM_DIRECTOR', 'SUPERVISOR', 'CASE_WORKER', 'SOCIAL_WORKER']
      },
      {
        id: 'housing',
        label: 'Housing Services',
        href: '/cases/housing',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        ),
        visibleToRoles: ['SUPER_ADMIN', 'ADMIN', 'PROGRAM_DIRECTOR', 'SUPERVISOR', 'CASE_WORKER', 'HOUSING_SPECIALIST']
      }
    ]
  },

  // Tasks/Training/Compliance - Staff and supervisors
  {
    id: 'tasks',
    label: 'Tasks & Training',
    href: '/tasks',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    visibleToRoles: ['SUPER_ADMIN', 'ADMIN', 'CEO', 'COO', 'PROGRAM_DIRECTOR', 'HR_MANAGER', 'SUPERVISOR', 'CASE_WORKER', 'SOCIAL_WORKER', 'INTAKE_SPECIALIST', 'HOUSING_SPECIALIST', 'RECEPTIONIST'],
    badge: '3'
  },

  // Development/Grants - Fundraising and grant management
  {
    id: 'development',
    label: 'Development/Grants',
    href: '/development',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    visibleToRoles: ['SUPER_ADMIN', 'ADMIN', 'CEO', 'COO', 'CFO', 'BOARD_MEMBER', 'DEVELOPMENT_DIRECTOR', 'GRANTS_MANAGER'],
    children: [
      {
        id: 'donors',
        label: 'Donors',
        href: '/development/donors',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        ),
        visibleToRoles: ['SUPER_ADMIN', 'ADMIN', 'CEO', 'COO', 'DEVELOPMENT_DIRECTOR', 'GRANTS_MANAGER']
      },
      {
        id: 'grants',
        label: 'Grants',
        href: '/development/grants',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
        visibleToRoles: ['SUPER_ADMIN', 'ADMIN', 'CEO', 'COO', 'DEVELOPMENT_DIRECTOR', 'GRANTS_MANAGER']
      },
      {
        id: 'contracts',
        label: 'Contracts',
        href: '/development/contracts',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
        visibleToRoles: ['SUPER_ADMIN', 'ADMIN', 'CEO', 'COO', 'DEVELOPMENT_DIRECTOR', 'GRANTS_MANAGER']
      }
    ]
  },

  // HR - Human resources management
  {
    id: 'hr',
    label: 'HR',
    href: '/hr',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    visibleToRoles: ['SUPER_ADMIN', 'ADMIN', 'CEO', 'COO', 'CFO', 'HR_MANAGER']
  },

  // Finance/Accounting - Financial management
  {
    id: 'finance',
    label: 'Finance/Accounting',
    href: '/finance',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    visibleToRoles: ['SUPER_ADMIN', 'ADMIN', 'CEO', 'COO', 'CFO', 'BOARD_MEMBER']
  },

  // Volunteers - Volunteer management
  {
    id: 'volunteers',
    label: 'Volunteers',
    href: '/volunteers',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    visibleToRoles: ['SUPER_ADMIN', 'ADMIN', 'CEO', 'COO', 'PROGRAM_DIRECTOR', 'SUPERVISOR', 'RECEPTIONIST']
  },

  // Clients/Accounts - Client and account management
  {
    id: 'clients',
    label: 'Clients/Accounts',
    href: '/clients',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    ),
    visibleToRoles: ['SUPER_ADMIN', 'ADMIN', 'CEO', 'COO', 'PROGRAM_DIRECTOR', 'SUPERVISOR', 'CASE_WORKER', 'SOCIAL_WORKER', 'INTAKE_SPECIALIST', 'HOUSING_SPECIALIST']
  },

  // Reports & Analytics - Leadership and financial roles
  {
    id: 'reports',
    label: 'Reports',
    href: '/reports',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    visibleToRoles: ['SUPER_ADMIN', 'ADMIN', 'CEO', 'COO', 'CFO', 'BOARD_MEMBER', 'PROGRAM_DIRECTOR', 'DEVELOPMENT_DIRECTOR', 'SUPERVISOR']
  },

  // Forms - All staff roles
  {
    id: 'forms',
    label: 'Forms',
    href: '/forms',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    visibleToRoles: ['SUPER_ADMIN', 'ADMIN', 'CEO', 'COO', 'CFO', 'BOARD_MEMBER', 'BOARD_SECRETARY', 'PROGRAM_DIRECTOR', 'HR_MANAGER', 'DEVELOPMENT_DIRECTOR', 'GRANTS_MANAGER', 'SUPERVISOR', 'CASE_WORKER', 'SOCIAL_WORKER', 'INTAKE_SPECIALIST', 'HOUSING_SPECIALIST', 'RECEPTIONIST', 'VOLUNTEER']
  },

  // Notifications - All authenticated users
  {
    id: 'notifications',
    label: 'Notifications',
    href: '/notifications',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.868 19.132l5.5-5.5a1 1 0 011.414 0l5.5 5.5a1 1 0 01-1.414 1.414L12 17.414l-3.868 3.868a1 1 0 01-1.414-1.414z" />
      </svg>
    ),
    visibleToRoles: ['SUPER_ADMIN', 'ADMIN', 'CEO', 'COO', 'CFO', 'BOARD_MEMBER', 'BOARD_SECRETARY', 'PROGRAM_DIRECTOR', 'HR_MANAGER', 'DEVELOPMENT_DIRECTOR', 'GRANTS_MANAGER', 'SUPERVISOR', 'CASE_WORKER', 'SOCIAL_WORKER', 'INTAKE_SPECIALIST', 'HOUSING_SPECIALIST', 'RECEPTIONIST', 'VOLUNTEER']
  },

  // Settings - Individual settings for all, system settings for admins
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    visibleToRoles: ['SUPER_ADMIN', 'ADMIN', 'CEO', 'COO', 'CFO', 'BOARD_MEMBER', 'BOARD_SECRETARY', 'PROGRAM_DIRECTOR', 'HR_MANAGER', 'DEVELOPMENT_DIRECTOR', 'GRANTS_MANAGER', 'SUPERVISOR', 'CASE_WORKER', 'SOCIAL_WORKER', 'INTAKE_SPECIALIST', 'HOUSING_SPECIALIST', 'RECEPTIONIST', 'VOLUNTEER']
  }
]

export function Sidebar({
  currentUserRole,
  currentPath = '',
  isCollapsed = false,
  onToggleCollapse,
  onNavigate,
  className = ''
}: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  // Filter navigation items based on user role
  const visibleItems = navigationItems.filter(item =>
    item.visibleToRoles.includes(currentUserRole)
  )

  // Toggle expanded state for navigation groups
  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  // Check if current path matches navigation item
  const isActive = (href: string) => {
    return currentPath === href || currentPath.startsWith(href + '/')
  }

  // Handle navigation
  const handleNavigate = (href: string) => {
    onNavigate?.(href)
  }

  const sidebarClasses = [
    'flex flex-col bg-surface border-r border-surface-4',
    'transition-all duration-300',
    isCollapsed ? 'w-16' : 'w-64',
    'h-screen overflow-y-auto',
    className
  ].join(' ')

  return (
    <nav 
      className={sidebarClasses}
      aria-label="Main navigation"
      role="navigation"
    >
      {/* Sidebar header */}
      <div className="flex items-center justify-between p-4 border-b border-surface-4">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-lg font-semibold text-text">PILLAR</span>
          </div>
        )}
        
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-md text-muted hover:text-text hover:bg-surface-2 transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg 
              className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7" 
              />
            </svg>
          </button>
        )}
      </div>

      {/* Navigation items */}
      <div className="flex-1 py-4">
        <ul className="space-y-1 px-3">
          {visibleItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0
            const isExpanded = expandedItems.includes(item.id)
            const isItemActive = isActive(item.href)
            
            // Filter children based on user role
            const visibleChildren = item.children?.filter(child =>
              child.visibleToRoles.includes(currentUserRole)
            ) || []

            return (
              <li key={item.id}>
                {/* Main navigation item */}
                <div className="relative">
                  <button
                    onClick={() => {
                      if (hasChildren && visibleChildren.length > 0) {
                        toggleExpanded(item.id)
                      } else {
                        handleNavigate(item.href)
                      }
                    }}
                    className={[
                      'w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left',
                      'transition-all duration-200',
                      'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
                      isItemActive
                        ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                        : 'text-muted hover:text-text hover:bg-surface-2'
                    ].join(' ')}
                    aria-expanded={hasChildren ? isExpanded : undefined}
                    aria-current={isItemActive ? 'page' : undefined}
                  >
                    {/* Icon */}
                    <span className="flex-shrink-0">
                      {item.icon}
                    </span>

                    {/* Label and badge */}
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 font-medium">
                          {item.label}
                        </span>
                        
                        {item.badge && (
                          <span className="px-2 py-1 text-xs font-medium bg-primary-500/20 text-primary-400 rounded-full">
                            {item.badge}
                          </span>
                        )}
                        
                        {hasChildren && visibleChildren.length > 0 && (
                          <svg 
                            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </>
                    )}
                  </button>

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-surface-3 text-text text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                      {item.label}
                      {item.badge && (
                        <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary-500/20 text-primary-400 rounded">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Sub-navigation items */}
                {hasChildren && visibleChildren.length > 0 && isExpanded && !isCollapsed && (
                  <ul className="mt-2 ml-6 space-y-1 border-l border-surface-4 pl-4">
                    {visibleChildren.map((child) => {
                      const isChildActive = isActive(child.href)
                      
                      return (
                        <li key={child.id}>
                          <button
                            onClick={() => handleNavigate(child.href)}
                            className={[
                              'w-full flex items-center gap-3 px-3 py-2 rounded-md text-left text-sm',
                              'transition-all duration-200',
                              'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
                              isChildActive
                                ? 'bg-primary-500/10 text-primary-400'
                                : 'text-muted hover:text-text hover:bg-surface-2'
                            ].join(' ')}
                            aria-current={isChildActive ? 'page' : undefined}
                          >
                            <span className="flex-shrink-0">
                              {child.icon}
                            </span>
                            <span>{child.label}</span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </div>

      {/* Footer with role indicator */}
      {!isCollapsed && (
        <div className="p-4 border-t border-surface-4">
          <div className="text-xs text-muted">
            <span className="block">Current Role:</span>
            <span className="font-medium text-text">
              {currentUserRole.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
      )}
    </nav>
  )
}

// Usage examples for documentation:
/*
<Sidebar
  currentUserRole="PROGRAM_DIRECTOR"
  currentPath="/programs/participants"
  isCollapsed={sidebarCollapsed}
  onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
  onNavigate={(href) => router.push(href)}
/>

// Role visibility annotations for developers:
// - Dashboard: All authenticated roles
// - Account Management: SUPER_ADMIN, ADMIN, CEO, COO, HR_MANAGER  
// - Programs & Services: Program staff + leadership
// - Case Management: Direct service staff + supervisors
// - Tasks & Training: Most staff roles
// - Development: CEO, COO, CFO, BOARD_MEMBER, DEVELOPMENT_DIRECTOR, GRANTS_MANAGER
// - Volunteers: Leadership + receptionist
// - HR: HR_MANAGER + C-suite
// - Reports: Leadership + supervisors  
// - Governance: Board + C-suite
// - Settings: All authenticated (individual), admins (system)
*/