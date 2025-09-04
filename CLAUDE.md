# AI Design-to-Code Evaluation Platform

## Project Overview
Demo application with feature-rich pages built using different AI tools for comparison. Each feature/page will be implemented multiple times using different AI tools to evaluate their capabilities.

## AI Tools Under Evaluation
- **Builder.io** - Visual development platform with AI code generation
- **Animaa** - AI animation and interaction design tool  
- **v0 by Vercel** - AI UI component generator
- **Claude Code** - AI coding assistant

## Development Commands
```bash
npm run dev           # Development server
npm run build         # Production build
npm run start         # Start production server
npm run lint          # ESLint
npm run type-check    # TypeScript checking (to be added)
```

## Demo App Features
- **Dashboard** - Analytics dashboard with charts and metrics
- **E-commerce Product Page** - Product showcase with gallery, reviews, cart
- **Landing Page** - Hero section, features, testimonials, CTA
- **Forms** - Multi-step form with validation and animations
- **Data Tables** - Sortable, filterable tables with pagination
- **Interactive Components** - Modals, dropdowns, carousels

## Implementation Strategy
Each feature will be built in separate routes using different AI tools:
```
/dashboard/builder    # Built with Builder.io
/dashboard/v0        # Built with v0
/dashboard/claude    # Built with Claude Code
/dashboard/animaa    # Built with Animaa

/product/builder     # Same feature, different tool
/product/v0
/product/claude
/product/animaa
```

## Evaluation Criteria
- Code quality and maintainability
- Design fidelity
- Developer experience
- Performance
- Customization capabilities

## Best Practices
- Use TypeScript for type safety
- Follow Next.js 14 app router conventions
- Implement proper error handling
- Optimize for performance and accessibility
- Document evaluation processes