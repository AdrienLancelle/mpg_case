# README

Ce projet utilise Docker Compose pour gérer les services. Le fichier Makefile fournit des commandes pratiques pour interagir avec ces services.

## Prérequis

- Docker et Docker Compose doivent être installés sur votre machine.
- Assurez-vous que le fichier `docker-compose.yml` est présent dans le répertoire racine du projet.
- Renomme .env.example en .env et remplit les valeurs manquantes avec ette commande : 
```bash
mv .env.example .env && echo "COUCHBASE_ADMINISTRATOR_USERNAME=admin
COUCHBASE_ADMINISTRATOR_PASSWORD=monpetitgazon
NODE_ENV=development
DB_HOST=couchbase://couchbase
DB_USERNAME=admin
DB_PASSWORD=monpetitgazon
DB_BUCKET=mpg
APP_PORT=3000" > .env
``` 



## Commandes Makefile

### Démarrer les services

Pour démarrer les services en mode live avec les logs, utilisez la commande suivante :

```bash
make up
```

Arrêter les services
Pour arrêter les services, utilisez la commande suivante :
```bash
make down
```
Reconstruire les services
Pour reconstruire les services, utilisez la commande suivante :
```bash
make build
```
Nettoyer les volumes et les réseaux
Pour nettoyer les volumes et les réseaux, utilisez la commande suivante :
```bash
make clean
```
Afficher les logs des services
Pour afficher les logs des services, utilisez la commande suivante :
```bash
make logs
```

🏗 Architecture CQRS dans ce projet
Ce projet suit un pattern CQRS strict avec une séparation claire entre les commandes (écriture) et les requêtes (lecture).

📌 Structure du code
Controller + DTO

Le contrôleur reçoit les requêtes HTTP et valide les données avec un DTO.
Il envoie ensuite une commande ou une requête à l'application.
Command / Query

Une Command (écriture) déclenche un changement d’état.
Une Query (lecture) récupère des données sans les modifier.
Handler

Chaque CommandHandler traite une commande et utilise le repository pour modifier l’état.
Chaque QueryHandler exécute une requête et retourne les données demandées.
Repository

Fournit un accès structuré aux données sans exposer directement l’ORM.
Sépare les opérations de lecture et d’écriture pour optimiser les performances.
⚡ Pourquoi ce choix ?
✅ Séparation stricte des responsabilités pour un code plus propre.
✅ Facilité d’optimisation des lectures et des écritures indépendamment.
✅ Compatible avec une architecture événementielle et évolutive.
