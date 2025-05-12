# Contributing to Running Finder

First off, thank you for considering contributing to Running Finder! It's people like you that make it such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by the Running Finder Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to [project maintainers](https://github.com/Joelheile/RunningFinder/issues).

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

Before creating bug reports, please check [this list](https://github.com/Joelheile/RunningFinder/issues) as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion, including completely new features and minor improvements to existing functionality.

Before creating enhancement suggestions, please check [this list](https://github.com/Joelheile/RunningFinder/issues) as you might find out that you don't need to create one. When you are creating an enhancement suggestion, please include as many details as possible.

### Pull Requests

The process described here has several goals:

- Maintain the project's quality
- Fix problems that are important to users
- Engage the community in working toward the best possible Running Finder
- Enable a sustainable system for the project's maintainers to review contributions

Please follow these steps to have your contribution considered by the maintainers:

1. Follow all instructions in [the template](PULL_REQUEST_TEMPLATE.md)
2. Follow the [styleguides](#styleguides)
3. After you submit your pull request, verify that all status checks are passing

## Styleguides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line
- Consider starting the commit message with an applicable type prefix:
  - `feat:` for new features
  - `fix:` for bug fixes
  - `docs:` for documentation changes
  - `style:` for formatting changes
  - `refactor:` for code refactoring
  - `test:` for test-related changes
  - `chore:` for build process or tool changes

### JavaScript/TypeScript Styleguide

- Use functional and declarative programming patterns
- Avoid classes and object-oriented approaches
- Prefer iteration and modularization over code duplication
- Use camelCase for variables and functions
- Use PascalCase for components and component files
- Use descriptive variable names with auxiliary verbs (e.g., isLoading, hasError)
- Keep functions small and focused on a single responsibility

### React/UI Styleguide

- Use declarative TSX for React components
- Prefer React Server Components (RSC) when possible
- Minimize 'use client', 'useState', and 'useEffect'
- Follow Shadcn and Tailwind CSS conventions for components and styling
- Implement responsive design with a mobile-first approach

### CSS Styleguide

- Keep Tailwind classes concise
- Group related classes for improved readability
- Use Tailwind's utility classes instead of custom CSS

## Development Setup

To set up the project for local development:

1. Fork and clone the repository
2. Run `pnpm install` to install dependencies
3. Copy `.env.example` to `.env.local` and set up your environment variables
4. Run `pnpm dev` to start the development server

## Testing

Before submitting a pull request, make sure all tests pass:

```bash
pnpm tests
```

Also, add new tests for your changes when applicable.

## Additional Notes

### Issue and Pull Request Labels

This section lists the labels we use to help us track and manage issues and pull requests.

- `bug` - Issues that represent a bug or problem in the codebase
- `enhancement` - Issues that represent new feature requests
- `documentation` - Issues related to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed

Thank you for contributing to Running Finder!
