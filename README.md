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

## 📁 Project Structure

```
├── app/                 # Next.js App Router pages
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

## 📦 Deployment

### For Demo/Production on any machine:
1. Copy this entire project folder
2. Ensure Docker is installed
3. Run: `make demo`
4. Visit: http://localhost:3000

### For Development:
1. Clone the repository
2. Run: `make quick-start`
3. Start coding!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with `make demo`
5. Submit a pull request

## 📄 License

This project is part of Kawtar's finals and is for educational purposes.

---

**Quick Commands Summary:**
- `make demo` - 🚀 Start everything with Docker
- `make quick-start` - 💻 Start development
- `make help` - ❓ See all commands
