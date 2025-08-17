# Enterprise Nonprofit Management System Guidelines

## 🎯 Design System Specifications

### Typography - Accessibility First
* **Base Font Size**: 16px minimum (WCAG AA compliance)
* **Font Family**: Inter, system-ui, -apple-system, sans-serif
* **Interactive Text**: Minimum 44px touch target size for buttons and clickable elements
* **Line Height**: 1.6 for body text, 1.2-1.4 for headings
* **Font Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Color Usage Standards
* **Primary Actions**: Blue (`#2563eb`) for main actions and navigation
* **Secondary Actions**: Gray (`#475569`) for supporting actions
* **Success States**: Green (`#059669`) for confirmations and success messages
* **Error States**: Red (`#dc2626`) for errors and destructive actions
* **HIPAA Indicators**: Amber (`#d97706`) for sensitive data and compliance notices

### Spacing System - 4px Base Unit
* **Base Unit**: 4px for consistent spacing throughout the application
* **Component Padding**: Minimum 16px (`var(--spacing-4)`) for internal component spacing
* **Section Gaps**: 24px (`var(--spacing-6)`) for visual separation between sections
* **Page Margins**: 32px (`var(--spacing-8)`) for outer container margins

### Component Standards
* **Touch Targets**: Minimum 44x44px for all interactive elements
* **Border Radius**: 8px (`var(--radius-lg)`) for cards and buttons
* **Shadows**: Subtle drop shadows for elevation (`0 1px 3px rgba(0,0,0,0.1)`)
* **Transitions**: 150ms ease-in-out for all hover and focus states

## 🔐 Security & Compliance Requirements

### Role-Based Access Control (RBAC)
Every component must implement role-based security with these user roles:
- `ADMIN` - System administrators with full access
- `CEO` / `COO` - Executive leadership
- `CASE_WORKER` - Direct client service providers
- `SUPERVISOR` - Team and department supervisors
- `SOCIAL_WORKER` - Licensed social work staff
- `INTAKE_SPECIALIST` - Client intake and assessment
- `HOUSING_SPECIALIST` - Housing program specialists

### HIPAA Compliance
* **PHI Data Handling**: All client data must be treated as Protected Health Information
* **Audit Logging**: Every access to client data must be logged with user ID, timestamp, and action
* **Visual Indicators**: Amber borders and backgrounds for forms/sections containing sensitive data
* **Data Retention**: Implement secure deletion and retention policies

### Error Handling Standards
* **Zero Runtime Errors**: All components must handle loading, error, and empty states
* **User-Friendly Messages**: Never expose technical errors to end users
* **Comprehensive Logging**: Log all errors with context for debugging
* **Graceful Degradation**: Components should fail safely with fallback UI

## 🏗️ Architecture Patterns

### Component Structure
Every component must follow this pattern:
1. **Header Documentation** - Purpose, version, requirements, HIPAA status
2. **RBAC Security Check** - Verify user permissions before rendering
3. **Props Interface** - TypeScript interfaces with user object required
4. **State Management** - Loading, error, and data states
5. **Event Handlers** - Proper error handling and user feedback
6. **Accessibility** - WCAG AA compliance with proper ARIA labels
7. **HIPAA Compliance** - Audit logging and visual indicators

### Layered Architecture
* **Presentation Layer**: React components with enterprise styling
* **Business Logic Layer**: Custom hooks and utility functions
* **Data Access Layer**: Supabase integration with role-based queries
* **Security Layer**: Authentication, authorization, and audit logging

### Responsive Design
* **Mobile First**: Design for 375px minimum width with progressive enhancement
* **Breakpoints**: 768px (tablet), 1024px (desktop), 1280px (large desktop)
* **Touch Targets**: Larger interactive elements on mobile (48px minimum)
* **Content Strategy**: Progressive disclosure and mobile-optimized layouts

## 📊 Data Management Standards

### Client Data Structure
```typescript
interface Client {
  id: string
  profile: {
    firstName: string
    lastName: string
    dateOfBirth: string
    ssn?: string // HIPAA protected
    phone: string
    email?: string
  }
  housing: {
    currentStatus: 'housed' | 'homeless' | 'at_risk' | 'transitional'
    previousHousing?: string
    barrierToHousing?: string[]
  }
  services: Service[]
  caseNotes: CaseNote[]
  documents: Document[]
  createdAt: string
  updatedAt: string
  caseWorkerId: string
}
```

### Audit Trail Requirements
All data modifications must include:
- User ID and role
- Timestamp (ISO 8601 format)
- Action type (CREATE, READ, UPDATE, DELETE)
- Resource accessed
- IP address (if available)
- Session information

## 🚀 Performance Standards

### Performance First
* **Bundle Size**: Maximum 500KB initial bundle
* **Loading Time**: Sub-3 second initial load on 3G networks
* **Image Optimization**: Responsive images with proper sizing
* **Code Splitting**: Route-based and component-based splitting
* **Caching Strategy**: Appropriate cache headers for static assets

### User Experience Metrics
* **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
* **Accessibility**: WCAG AA compliance score 95%+
* **Progressive Enhancement**: Core functionality works without JavaScript
* **Offline Support**: Basic functionality available offline (future phase)

## 🧪 Quality Assurance

### Code Quality Standards
* **TypeScript Strict Mode**: Zero `any` types, strict null checks
* **ESLint Configuration**: Zero warnings, consistent code style
* **Testing Coverage**: 80%+ unit test coverage for business logic
* **Code Review**: All changes require peer review before merge

### Testing Strategy
* **Unit Tests**: Business logic and utility functions
* **Integration Tests**: Component interactions and data flows
* **End-to-End Tests**: Critical user journeys and workflows
* **Accessibility Tests**: Automated a11y testing in CI pipeline

### Documentation Requirements
* **Component Documentation**: Props, usage examples, accessibility notes
* **API Documentation**: Endpoint specifications and security requirements
* **User Documentation**: Role-based feature guides and tutorials
* **Technical Documentation**: Architecture decisions and deployment guides

## 🎨 UI/UX Patterns

### Navigation Patterns
* **Role-Based Navigation**: Menu items based on user permissions
* **Breadcrumb Navigation**: Clear hierarchy for deep navigation
* **Quick Actions**: Frequently used actions prominently displayed
* **Search Functionality**: Global search with role-based filtering

### Form Design
* **Progressive Disclosure**: Multi-step forms for complex data entry
* **Real-Time Validation**: Immediate feedback on input errors
* **Save States**: Auto-save and manual save with clear indicators
* **Required Fields**: Clear marking and validation of required data

### Data Visualization
* **Dashboard Widgets**: Role-specific KPIs and metrics
* **Accessible Charts**: Screen reader compatible with data tables
* **Export Functionality**: CSV/PDF export for reports and compliance
* **Filtering Controls**: Advanced filtering with saved filter sets

## 🛠️ Development Workflow

### Branch Strategy
* **Main Branch**: Production-ready code with automated deployments
* **Development Branch**: Integration branch for feature development
* **Feature Branches**: Individual features with descriptive names
* **Hotfix Branches**: Critical fixes with expedited review process

### Code Standards
* **Naming Conventions**: camelCase for variables, PascalCase for components
* **File Organization**: Feature-based folder structure with shared utilities
* **Import Standards**: Absolute imports for components, relative for utilities
* **Component Exports**: Default exports for components, named for utilities