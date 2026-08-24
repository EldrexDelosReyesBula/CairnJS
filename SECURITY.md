# Security Policy

The CairnJS project takes the security of our framework, ecosystem, and users seriously. This document outlines our security policies, supported versions, and how to report vulnerabilities responsibly.

---

## 🛡️ Supported Versions

We provide security updates and patches for the following versions:

| Major / Minor Version | Supported | Notes |
|---|---|---|
| `1.2.x` | ✅ Yes | Current active stable release |
| `1.1.x` | ✅ Yes | Critical security fixes only |
| `< 1.1.0` | ❌ No | Deprecated; please upgrade to `1.2.x` |

---

## 🔒 Reporting a Vulnerability

If you discover a security vulnerability within CairnJS, please **do NOT report it via public GitHub issues or discussions**.

Instead, follow our **Responsible Disclosure** process:

### 1. Private Submission
- Submit a report privately via **GitHub Security Advisories** on our repository:  
  `https://github.com/EldrexDelosReyesBula/CairnJS/security/advisories/new`
- Or email the maintainers directly at: **eldrexdelosreyesbula@gmail.com** with the subject `[SECURITY] CairnJS Vulnerability Report`.

### 2. Report Details
Please include:
- A detailed description of the vulnerability and affected modules (e.g. `src/state.js`, `src/wasm.js`, `src/dom.js`).
- Step-by-step reproduction instructions or a minimal Proof of Concept (PoC).
- Potential impact and severity assessment (e.g. XSS, prototype pollution, memory leak, denial of service).
- Any proposed remediation or patch if available.

---

## ⏱️ Response Timelines & SLA

Our security team adheres to the following response timeline:

- **Initial Response**: Within **48 hours** acknowledging receipt of your report.
- **Triage & Validation**: Within **5 business days** confirming the validity and severity.
- **Remediation & Patch**: A fix will be developed, tested against test suites, and prepared for release within **14 business days** (or sooner for critical exploits).
- **Public Disclosure**: Coordinated release with CVE assignment upon publication of the patched version.

---

## 🏆 Bug Bounties & Recognition

We deeply appreciate security researchers who spend time identifying and reporting vulnerabilities responsibly. Confirmed security contributors will be credited in our **CHANGELOG.md** and **Security Hall of Fame** (unless anonymity is requested).

---

## 🛡️ Best Security Practices for CairnJS Developers

When building applications with CairnJS:
1. **DOM Injection**: CairnJS DOM builders (`dom.js`) escape text nodes by default. Always use `safeHtml()` or sanitizers when injecting raw untrusted HTML.
2. **CSP Compliance**: CairnJS operates with **zero `eval()`** or unsafe runtime code generation, making it fully compatible with strict `Content-Security-Policy` (CSP) environments.
3. **WASM Bounds**: The Rust WASM engine (`src/wasm.js`) uses bounded shared memory array buffers with strict index validation.

Thank you for helping keep CairnJS and its community safe! 🔒
