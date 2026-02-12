# Frontend Cloud Monitor

Application React/TypeScript construite avec Vite pour afficher les données de l’endpoint `GET /health` exposé par l’API NestJS.

## Fonctionnalités

- Affiche le statut, le timestamp et l’uptime renvoyés par l’API.
- Rafraîchissement automatique toutes les 15 secondes + bouton « Rafraîchir maintenant ».
- Affichage du payload brut pour faciliter les démonstrations.

## Variables d’environnement

Copiez le fichier `.env.example` et ajustez l’URL :

```bash
cp .env.example .env
# puis modifier VITE_API_URL si besoin
```

## Développement local

```bash
npm install
npm run dev
# http://localhost:5173 interroge votre API (par défaut http://localhost:3000)
```

## Build Docker & déploiement Cloud Run

Le dossier contient un `Dockerfile` multi-stage (Node + Nginx) et une configuration `cloudbuild.front.yaml`.

```bash
# Build local avec votre URL API
docker build -t cloud-monitor-frontend --build-arg API_URL=https://monProjet.region.run.app .

# Lancer localement
docker run -p 8080:8080 cloud-monitor-frontend
```

Pour automatiser sur GCP :

1. Créez un dépôt Artifact Registry pour le front (`frontend-app-repo`).
2. Créez un trigger Cloud Build pointant vers `frontend/cloudbuild.front.yaml` déclenché sur `main`.
3. Renseignez les substitutions `_REPOSITORY`, `_SERVICE_NAME`, `_API_URL` si besoin.
4. Cloud Build construira l’image, la poussera sur Artifact Registry, puis déploiera sur Cloud Run (`monFront`).

Lors de la démo, rendez-vous sur `https://monFront.region.run.app` pour vérifier que les données correspondent aux dernières mises à jour de l’API.
