# Variables
COMPOSE_FILE := docker-compose.yml

# Tâches
.PHONY: up down build clean logs

# Démarrer les services en mode live avec les logs
up:
	@echo "Démarrage des services en mode live avec les logs..."
	docker-compose -f $(COMPOSE_FILE) up --build

# Arrêter les services
down:
	@echo "Arrêt des services..."
	docker-compose -f $(COMPOSE_FILE) down

# Reconstruire les services
build:
	@echo "Reconstruction des services..."
	docker-compose -f $(COMPOSE_FILE) build

# Nettoyer les volumes et les réseaux
clean:
	@echo "Nettoyage des volumes et des réseaux..."
	docker-compose -f $(COMPOSE_FILE) down -v --rmi all --remove-orphans

# Afficher les logs des services
logs:
	@echo "Affichage des logs des services..."
	docker-compose -f $(COMPOSE_FILE) logs -f
