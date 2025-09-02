<!-- filepath: /home/samurai0lava/Kawtar-Finals/README.md -->
# Kawtar Finals - Next.js E-commerce Project

A modern e-commerce web application built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed on your machine
- Make (for using the Makefile commands)

### Running the Application

This project includes a Makefile for easy deployment and development. Here are the main commands:

#### 🐳 Docker Commands (Recommended for Demo)

```bash
# Quick demo - Build and run the entire application in Docker
make demo
```

This single command will:
- Build the Docker image
- Start the container using docker-compose
- Make the app available at http://localhost:3000

```bash
# Stop the Docker demo
make docker-down

# View logs from the running container
make docker-logs

# Check container status
make status
```

#### 🛠️ Development Commands

```bash
# Setup for local development
make setup

# Start development server (with hot reload)
make quick-start

# Or step by step:
make install    # Install dependencies
make dev        # Start development server
```

#### 🔧 Other Useful Commands

```bash
# Build for production (local)
make build

# Start production server (local)
make start

# Clean everything (Docker containers, images, node_modules)
make clean-all

# Show all available commands
make help
```

## 🐳 Docker Deployment

### Method 1: Using Make (Recommended)
```bash
# One command to rule them all
make demo
```

### Method 2: Manual Docker Commands
```bash
# Build and run with docker-compose
docker-compose up --build -d

# Or build and run manually
docker build -t kawtar-finals .
docker run -p 3000:3000 kawtar-finals
```

## 🔐 FIDO Authentication Implementation

This project includes a complete FIDO2/WebAuthn authentication system for 3D Secure payments.

### FIDO Features
- **FIDO2/WebAuthn** - Modern passwordless authentication
- **3D Secure Integration** - EMV 3DS v2.2 compliance
- **Strong Customer Authentication (SCA)** - PSD2 compliant
- **Multi-factor Authentication** - Biometrics, PIN, security keys
- **Cross-platform Support** - Works on desktop and mobile

### FIDO Implementation Location
```
app/fido-auth/page.tsx          # Main FIDO authentication page
├── Registration Flow           # Lines 102-196 - WebAuthn credential creation
├── Authentication Flow         # Lines 198-312 - WebAuthn credential verification
└── 3DS Integration            # Secure payment authorization
```

### FIDO Authentication Flow
1. **Registration Phase**:
   - WebAuthn credential creation
   - Biometric/PIN enrollment
   - Security key binding

2. **Authentication Phase**:
   - WebAuthn credential verification
   - 3D Secure transaction authorization
   - EMV 3DS compliance validation

3. **Browser Support**:
   - Chrome 67+ ✅
   - Firefox 60+ ✅
   - Safari 14+ ✅
   - Edge 18+ ✅

### Integration with Backend

#### Current Implementation (Frontend Simulation)
The FIDO authentication currently runs as a **frontend-only simulation** for demo purposes.

#### Backend Integration Points
Replace these simulated API calls with real backend endpoints:

**1. Registration API Integration:**
```tsx
// Current: Line 155 in app/fido-auth/page.tsx
await new Promise(resolve => setTimeout(resolve, 1000))

// Replace with:
const response = await fetch('/api/fido/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    credentialId,
    publicKey: credential.response.publicKey,
    userId,
    attestation: credential.response.attestationObject
  })
})
```

**2. Authentication API Integration:**
```tsx
// Current: Line 253 in app/fido-auth/page.tsx
await new Promise(resolve => setTimeout(resolve, 1500))

// Replace with:
const response = await fetch('/api/fido/authenticate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    transactionId: txId,
    assertionData,
    amount: txAmount,
    challengeResponse: assertion.response
  })
})
```

#### Required Backend API Endpoints

Create these API routes in your `app/api/` directory:

```
app/api/fido/
├── register/
│   ├── begin/route.ts      # POST - Start registration, return challenge
│   └── complete/route.ts   # POST - Complete registration, verify credential
├── authenticate/
│   ├── begin/route.ts      # POST - Start authentication, return challenge
│   └── complete/route.ts   # POST - Complete authentication, verify assertion
└── 3ds/
    ├── authenticate/route.ts # POST - Process 3DS with FIDO assertion
    └── status/[txId]/route.ts # GET - Check transaction status
```

#### Environment Variables for FIDO Backend
```env
# .env.local
FIDO_RP_ID=localhost                    # Relying Party ID
FIDO_RP_NAME="Tech Store - FIDO 3DS Hub" # Relying Party Name
FIDO_ORIGIN=http://localhost:3000       # Application origin
DATABASE_URL=...                        # For storing credentials
FIDO_TIMEOUT=60000                      # Authentication timeout
```

#### FIDO Security Features
- **AAL2 Compliance** - Authenticator Assurance Level 2
- **User Verification** - Biometric or PIN required
- **Credential Protection** - Hardware-backed security
- **Anti-Phishing** - Origin binding protection
- **Replay Protection** - Challenge-response mechanism

### Testing FIDO Authentication

#### Device Requirements
- **Biometric Authentication**: Face ID, Touch ID, Fingerprint, Windows Hello
- **Security Keys**: USB-A/C, NFC, Bluetooth FIDO2 keys
- **Platform Authenticators**: Built-in device authenticators

#### Testing Flow
1. Navigate to `/fido-auth` or complete a checkout
2. Click "Setup FIDO Security" to register
3. Follow browser prompts for biometric/PIN setup
4. Test authentication with "Authenticate with FIDO"
5. Complete 3D Secure payment authorization

#### Troubleshooting FIDO
- **Ensure HTTPS** (or localhost for development)
- **Check browser compatibility** (Chrome, Firefox, Safari, Edge)
- **Verify device capabilities** (biometric sensors, security key support)
- **Try different authenticators** (built-in vs external security keys)

## 📁 Project Structure

```
├── app/                 # Next.js App Router pages
│   ├── fido-auth/      # 🔐 FIDO authentication system
│   │   └── page.tsx    # Main FIDO implementation
│   └── api/            # API routes (ready for backend integration)
├── components/          # Reusable React components
├── lib/                # Utility functions and configurations
├── public/             # Static assets
├── hooks/              # Custom React hooks
├── styles/             # Global styles
├── Dockerfile          # Docker configuration
├── docker-compose.yml  # Docker Compose configuration
├── Makefile           # Easy command shortcuts
└── package.json       # Dependencies and scripts
```

## 🛡️ Technologies Used

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Authentication**: FIDO2/WebAuthn
- **Payment Security**: EMV 3D Secure v2.2
- **Compliance**: PSD2 SCA, AAL2
- **Containerization**: Docker & Docker Compose
- **Package Manager**: npm with legacy peer deps support

## 🚨 Troubleshooting

### Common Issues

1. **Port 3000 already in use**
   ```bash
   make docker-down  # Stop any running containers
   make demo         # Try again
   ```

2. **Permission issues with Docker**
   ```bash
   sudo make demo    # Run with sudo if needed
   ```

3. **Dependencies issues**
   ```bash
   make clean-all    # Clean everything
   make setup        # Reinstall dependencies
   ```

4. **FIDO Authentication Issues**
   ```bash
   # Check browser support
   # Chrome 67+, Firefox 60+, Safari 14+, Edge 18+
   
   # Ensure HTTPS (or localhost)
   # Check for biometric sensors or security keys
   # Clear browser data if authentication fails
   ```

## 📦 Deployment

### For Demo/Production on any machine:
1. Copy this entire project folder
2. Ensure Docker is installed
3. Run: `make demo`
4. Visit: http://localhost:3000
5. Test FIDO authentication at: http://localhost:3000/fido-auth

### For Development:
1. Clone the repository
2. Run: `make quick-start`
3. Start coding!
4. Test FIDO features with HTTPS or localhost

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with `make demo`
5. Test FIDO authentication flow
6. Submit a pull request

## 📄 License

This project is part of Kawtar's finals and is for educational purposes.

---

**Quick Commands Summary:**
- `make demo` - 🚀 Start everything with Docker
- `make quick-start` - 💻 Start development
- `make help` - ❓ See all commands

**FIDO Demo URLs:**
- Main App: http://localhost:3000
- FIDO Auth: http://localhost:3000/fido-auth
- Complete Flow: Complete a purchase to trigger 3D