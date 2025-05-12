# Security Policy

## Supported Versions

Currently, we're supporting security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of Running Finder seriously. If you believe you've found a security vulnerability, please follow these steps:

1. **Do not disclose the vulnerability publicly**
2. **Email us directly** at [team@runningfinder.com](mailto:team@runningfinder.com) with details about the vulnerability
3. **Include the following information** in your report:
   - Type of vulnerability
   - Full paths of source files related to the vulnerability
   - Steps to reproduce
   - Potential impact

## Security Best Practices for Contributors

If you're contributing to Running Finder, please follow these security best practices:

1. **Never commit credentials or secrets** to the repository
2. **Use environment variables** for all sensitive configuration
3. **Apply input validation** for all user inputs
4. **Follow secure coding practices** and avoid common vulnerabilities like XSS, CSRF, SQL injection, etc.
5. **Keep dependencies updated** to avoid known vulnerabilities

## Security Features

Running Finder implements several security features:

- **Authentication** via NextAuth.js with secure session handling
- **Database security** with parameterized queries via Drizzle ORM
- **Input validation** for all API endpoints
- **HTTPS** for all communications

## Third-Party Security Audits

We're committed to regular security reviews. If you're interested in conducting a security audit, please contact us at [team@runningfinder.com](mailto:team@runningfinder.com).

Thank you for helping keep Running Finder secure!
