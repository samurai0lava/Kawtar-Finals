# Makefile for Kawtar Finals Next.js Project

# Variables
PROJECT_NAME = kawtar-finals
DOCKER_IMAGE = $(PROJECT_NAME):latest
CONTAINER_NAME = $(PROJECT_NAME)-app

# Default target
.DEFAULT_GOAL := help

# Development commands
.PHONY: install dev build start clean

install: ## Install dependencies
	@echo "Installing dependencies..."
	npm install --legacy-peer-deps

dev: ## Start development server
	@echo "Starting development server..."
	npm run dev

build: ## Build the project for production
	@echo "Building project..."
	npm run build

start: ## Start production server (requires build first)
	@echo "Starting production server..."
	npm run start

lint: ## Run linter
	@echo "Running linter..."
	npm run lint

# Docker commands
.PHONY: docker-build docker-run docker-stop docker-clean docker-up docker-down

docker-build: ## Build Docker image
	@echo "Building Docker image..."
	docker build -t $(DOCKER_IMAGE) .

docker-run: ## Run Docker container
	@echo "Running Docker container..."
	docker run -d -p 3000:3000 --name $(CONTAINER_NAME) $(DOCKER_IMAGE)

docker-stop: ## Stop Docker container
	@echo "Stopping Docker container..."
	docker stop $(CONTAINER_NAME) || true
	docker rm $(CONTAINER_NAME) || true

docker-clean: docker-stop ## Clean Docker images and containers
	@echo "Cleaning Docker images..."
	docker rmi $(DOCKER_IMAGE) || true
	docker system prune -f

docker-up: ## Start with docker-compose
	@echo "Starting with docker-compose..."
	docker-compose up --build -d

docker-down: ## Stop docker-compose
	@echo "Stopping docker-compose..."
	docker-compose down

docker-logs: ## Show docker-compose logs
	@echo "Showing logs..."
	docker-compose logs -f

# Quick commands
.PHONY: demo setup quick-start

demo: docker-up ## Quick demo - build and run with Docker
	@echo "🚀 Demo started! Visit http://localhost:3000"
	@echo "Run 'make docker-down' to stop"

setup: install ## Setup project for development
	@echo "✅ Project setup complete!"
	@echo "Run 'make dev' to start development server"

quick-start: ## Quick start for development
	@echo "🚀 Starting development server..."
	npm install --legacy-peer-deps && npm run dev

# Utility commands
.PHONY: status clean-all help

status: ## Show running containers
	@echo "Docker containers:"
	@docker ps --filter name=$(CONTAINER_NAME)
	@echo "\nDocker images:"
	@docker images | grep $(PROJECT_NAME) || echo "No project images found"

clean-all: docker-clean ## Clean everything (Docker + node_modules)
	@echo "Cleaning node_modules..."
	rm -rf node_modules
	rm -rf .next
	@echo "✅ Cleaned everything!"

help: ## Show this help message
	@echo "Kawtar Finals - Next.js Project"
	@echo "================================"
	@echo "Available commands:"
	@awk 'BEGIN {FS = ":.*##"; printf "\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  %-18s %s\n", $$1, $$2 } /^##@/ { printf "\n%s\n", substr($$0, 5) }' $(MAKEFILE_LIST)
	@echo ""
	@echo "Quick commands:"
	@echo "  make demo        - Build and run with Docker (recommended for demos)"
	@echo "  make quick-start - Install and start development server"
	@echo "  make setup       - Install dependencies only"
	@echo ""
