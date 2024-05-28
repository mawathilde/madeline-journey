
.DEFAULT_GOAL := help
.PHONY: help
help: ## Affiche cette aide
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

run-api: api/go.sum ## Lance l'API
	cd api && go run main.go

test-api: api/go.sum ## Lance les tests de l'API
	cd api && go test ./...

run-test-prod: ## Lance l'environnement de développement
	cd front && pnpm run build
	docker compose up -d

dev: ## Lance l'environnement de développement
	cd front && pnpm i
	docker compose -f docker-compose.dev.yml up

rm-dev: ## Arrête l'environnement de développement
	docker compose -f docker-compose.dev.yml down

# -----------------------------------
# Dépendances
# -----------------------------------

api/go.sum: api/go.mod ## Installe les dépendances de l'API
	cd api && go mod download