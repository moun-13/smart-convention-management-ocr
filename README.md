<div align="center">

# Smart Convention Management OCR

**Plateforme complete de gestion intelligente des conventions administratives, integrant un service d'extraction de donnees via IA et OCR.**

[![Frontend](https://img.shields.io/badge/Frontend-Next.js_16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Backend](https://img.shields.io/badge/Backend-Laravel_12-FF2D20?style=for-the-badge&logo=laravel)](https://laravel.com/)
[![OCR Service](https://img.shields.io/badge/OCR_Service-FastAPI-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![AI](https://img.shields.io/badge/AI-Python_3.9+-3776AB?style=for-the-badge&logo=python)](https://www.python.org/)
![License](https://img.shields.io/badge/Licence-MIT-blue?style=for-the-badge)

</div>

---

## A propos

**Smart Convention Management OCR** est une application de gestion des conventions administratives. Elle centralise les conventions, leurs pieces jointes, les partenaires, les programmes, les domaines, les provinces et les statistiques de suivi.

Le projet ajoute un service OCR/IA capable d'analyser des documents PDF ou DOCX, d'extraire le texte, puis de detecter automatiquement les informations importantes pour pre-remplir les formulaires de convention.

## Objectifs

- Digitaliser le cycle de vie des conventions administratives.
- Reduire la saisie manuelle grace a l'extraction OCR et IA.
- Centraliser les donnees metier: secteurs, domaines, programmes, provinces, porteurs de projets et partenaires.
- Fournir un tableau de bord pour le suivi et la prise de decision.
- Garder une architecture claire en separant l'interface, l'API metier et le traitement OCR.

---

## Fonctionnalites

- **Authentification securisee** avec Laravel Sanctum.
- **Gestion des roles**: administrateur, editeur et decideur.
- **Gestion des conventions**: creation, consultation, modification, suppression selon les permissions.
- **Gestion referentielle**: secteurs, domaines, programmes, provinces, types de conventions, porteurs de projets et partenaires.
- **Gestion documentaire**: upload, consultation, telechargement et rattachement des pieces jointes.
- **Extraction OCR intelligente**: analyse de documents PDF/DOCX en arabe et en francais.
- **Pipeline IA**: OCR, NLP, fuzzy matching, post-traitement et enrichissement LLM si necessaire.
- **Tableau de bord**: statistiques globales pour les decideurs.

---

## Architecture

Le projet conserve une architecture en trois parties:

```text
smart-convention-management-ocr/
|
|-- frontend/       Interface utilisateur Next.js
|-- laravel-api/    API REST, authentification et logique metier Laravel
`-- ocr-service/    Micro-service FastAPI pour OCR, NLP et extraction IA
```

Vue d'ensemble des echanges:

```text
+-------------------+        REST API         +-------------------+
|                   | <---------------------> |                   |
|     Frontend      |                         |    Laravel API    |
|     Next.js 16    |                         |    Laravel 12     |
|                   |                         |                   |
+-------------------+                         +---------+---------+
                                                        |
                                                        | HTTP multipart
                                                        v
                                              +-------------------+
                                              |                   |
                                              |    OCR Service    |
                                              |     FastAPI       |
                                              |                   |
                                              +-------------------+
```

### Pipeline OCR

1. L'utilisateur ajoute un document depuis l'interface Next.js.
2. Le frontend envoie la demande a l'API Laravel.
3. Laravel valide les droits et transmet le fichier au service FastAPI.
4. FastAPI valide le fichier et accepte les formats `.pdf` et `.docx`.
5. Pour les PDF, le service convertit les pages en images, applique le pretraitement, puis execute l'OCR.
6. Pour les DOCX, le service extrait directement le texte du document.
7. Le texte est analyse avec NLP, regex metier, fuzzy matching et post-traitement.
8. Si des champs importants restent manquants, un extracteur LLM peut completer le resultat.
9. Le resultat JSON est renvoye a Laravel, puis exploite par le frontend.
10. Le service OCR met les resultats en cache par hash de fichier pour eviter les traitements repetes.

---

## Technologies

### Frontend

- **Next.js 16** avec App Router
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Radix UI / shadcn**
- **React Query**
- **Axios**
- **React Hook Form**
- **Recharts**
- **Lucide React / React Icons**

### Backend

- **Laravel 12**
- **PHP 8.2+**
- **Laravel Sanctum**
- **Eloquent ORM**
- **Migrations et seeders Laravel**
- **SQLite, MySQL ou PostgreSQL** selon la configuration `.env`

### Service OCR et IA

- **FastAPI**
- **Uvicorn**
- **Python 3.9+**
- **EasyOCR**
- **OpenCV**
- **PDF2Image**
- **Pillow**
- **Transformers / Torch**
- **RapidFuzz**
- **Regex**
- **PyArabic**
- **python-docx**

---

## Structure du projet

```text
frontend/
|-- app/                  Pages et routes Next.js
|-- components/           Composants UI reutilisables
|-- context/              Contextes React
|-- hooks/                Hooks personnalises
|-- lib/                  Utilitaires applicatifs
|-- services/             Clients API
|-- types/                Types TypeScript
`-- utils/                Fonctions utilitaires

laravel-api/
|-- app/Http/Controllers/Api/   Controleurs REST
|-- app/Models/                 Modeles Eloquent
|-- database/                   Migrations, factories et seeders
|-- routes/api.php              Routes API
|-- config/                     Configuration Laravel
`-- storage/                    Stockage local des fichiers

ocr-service/
|-- main.py               Application FastAPI
|-- Services/             OCR, NLP, matching, post-traitement et LLM
|-- utils/                Conversion PDF et utilitaires
|-- tests/                Scripts et tests d'evaluation OCR
|-- results_cache/        Cache local des extractions
`-- requirements.txt      Dependances Python
```

---

## Prerequis

- Node.js 20+ et npm
- PHP 8.2+ et Composer
- Python 3.9+
- Une base de donnees compatible Laravel: SQLite, MySQL ou PostgreSQL
- Poppler installe et disponible dans le `PATH` pour la conversion PDF via `pdf2image`

---

## Installation

### 1. Cloner le projet

```bash
git clone https://github.com/moun-13/smart-convention-management-ocr.git
cd smart-convention-management-ocr
```

### 2. Installer le frontend

```bash
cd frontend
npm install
```

### 3. Installer l'API Laravel

```bash
cd ../laravel-api
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
```

Configurez ensuite la base de donnees dans `laravel-api/.env` si vous n'utilisez pas SQLite.

### 4. Installer le service OCR

```bash
cd ../ocr-service
python -m venv venv
```

Activation Windows:

```bash
venv\Scripts\activate
```

Activation Linux/macOS:

```bash
source venv/bin/activate
```

Installation des dependances:

```bash
pip install -r requirements.txt
```

---

## Lancement local

L'application complete necessite les trois services en parallele.

| Service | Dossier | Commande | URL |
| --- | --- | --- | --- |
| Frontend | `frontend` | `npm run dev` | `http://localhost:3000` |
| API Laravel | `laravel-api` | `php artisan serve` | `http://127.0.0.1:8000` |
| Service OCR | `ocr-service` | `python -m uvicorn main:app --reload --port 8001` | `http://127.0.0.1:8001` |

Le frontend utilise l'API Laravel sur `http://127.0.0.1:8000/api`. Laravel transmet les fichiers OCR au service FastAPI sur `http://127.0.0.1:8001/extract`.

---

## Endpoints principaux

### API Laravel

| Methode | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/test` | Verification rapide de l'API Laravel |
| `POST` | `/api/login` | Connexion utilisateur |
| `POST` | `/api/logout` | Deconnexion utilisateur |
| `GET` | `/api/me` | Profil de l'utilisateur connecte |
| `GET` | `/api/conventions` | Liste des conventions |
| `POST` | `/api/conventions` | Creation d'une convention |
| `GET` | `/api/conventions/{id}` | Detail d'une convention |
| `PUT/PATCH` | `/api/conventions/{id}` | Modification d'une convention |
| `DELETE` | `/api/conventions/{id}` | Suppression d'une convention |
| `POST` | `/api/ocr/extract` | Extraction OCR directe via Laravel |
| `GET` | `/api/dashboard/statistiques` | Statistiques du tableau de bord |
| `GET` | `/api/piece-jointes/{id}/download` | Telechargement d'une piece jointe |

Les ressources `secteurs`, `domaines`, `programmes`, `provinces`, `type-conventions`, `porteur-projets`, `partenaires`, `piece-jointes` et `users` sont exposees avec des routes REST Laravel.

### Service OCR FastAPI

| Methode | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/health` | Etat du service OCR |
| `GET` | `/diag` | Diagnostic des modules OCR, NLP et matching |
| `POST` | `/extract` | Extraction depuis un fichier PDF ou DOCX |

Exemple d'appel direct au service OCR:

```bash
curl -X POST http://127.0.0.1:8001/extract \
  -F "file=@convention.pdf"
```

---

## Roles et permissions

- **Admin**: gestion complete des conventions, utilisateurs, referentiels et pieces jointes.
- **Editeur**: creation et modification des conventions, ajout de pieces jointes et extraction OCR.
- **Decideur**: consultation des conventions et acces aux statistiques.

---

## Tests et qualite

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

Laravel:

```bash
cd laravel-api
php artisan test
```

OCR:

```bash
cd ocr-service
python -m uvicorn main:app --reload --port 8001
python tests/evaluation.py
```

---

## Notes de configuration

- Le service OCR limite les fichiers a **20 MB**.
- Les formats supportes par l'OCR sont **PDF** et **DOCX**.
- Les resultats OCR sont caches dans `ocr-service/results_cache/`.
- Le moteur OCR par defaut est EasyOCR. Le code prevoit aussi une configuration `OCR_ENGINE`.
- Les URLs locales sont actuellement configurees en dur dans plusieurs services frontend et dans le controleur Laravel OCR.

---

## Ameliorations possibles

- Centraliser les URLs API dans des variables d'environnement.
- Ajouter un fichier `.env.example` pour le service OCR.
- Ajouter des tests automatises pour le pipeline OCR et les roles Laravel.
- Ajouter des captures d'ecran reelles de l'application.
- Ajouter une file d'attente Laravel pour traiter les OCR longs en arriere-plan.
- Ajouter un suivi d'etat pour les documents en cours d'analyse.

---

## Auteur

Developpe dans le cadre d'un Projet de Fin d'Annee (PFA) autour de la numerisation et de l'automatisation intelligente des flux administratifs.

**GitHub**: [@moun-13](https://github.com/moun-13)

---

## Licence

Ce projet est indique sous licence **MIT**.
