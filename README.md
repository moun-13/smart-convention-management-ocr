<div align="center">
  
  # 📄 Smart Convention Management OCR

  **Plateforme complète de gestion intelligente des conventions administratives, intégrant un service d'extraction de données via IA et OCR.**
  
  [![Next.js](https://img.shields.io/badge/Frontend-Next.js_16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![Laravel](https://img.shields.io/badge/Backend-Laravel_12-FF2D20?style=for-the-badge&logo=laravel)](https://laravel.com)
  [![FastAPI](https://img.shields.io/badge/OCR_Service-FastAPI-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
  [![Python](https://img.shields.io/badge/AI-Python_3.9+-3776AB?style=for-the-badge&logo=python)](https://python.org)
  [![Licence](https://img.shields.io/badge/Licence-MIT-blue.svg?style=for-the-badge)](LICENSE)
</div>

---

## 📖 À Propos du Projet

**Smart Convention Management OCR** est une solution conçue pour simplifier, automatiser et centraliser la gestion des conventions (notamment administratives marocaines). 
La particularité de ce système réside dans son **moteur d'Intelligence Artificielle intégré**, capable d'analyser des documents (PDF ou Word), d'en extraire le texte via OCR (Optical Character Recognition), et d'identifier les entités clés (NLP) pour pré-remplir automatiquement les informations de la convention.

### 🎯 Objectifs
- **Digitaliser** la gestion des conventions et de leurs pièces jointes.
- **Gagner du temps** grâce à l'extraction automatique des données via l'OCR.
- **Centraliser** les statistiques et le suivi des projets, domaines, et secteurs.

---

## ✨ Fonctionnalités Principales

- 🔐 **Authentification & Rôles** : Gestion sécurisée des accès (Admin, Éditeur, Décideur) via Laravel Sanctum.
- 📂 **Gestion des Conventions** : Création, modification et suivi complet des dossiers.
- 🏢 **Gestion des Entités** : Secteurs, Domaines, Programmes, Provinces, Porteurs de projets et Partenaires.
- 🧠 **Extraction OCR Intelligente** : Analyse de documents PDF/Word (Arabe et Français) pour extraire les entités et métadonnées.
- 📊 **Tableau de Bord** : Statistiques globales pour la prise de décision.
- 📎 **Gestion Documentaire** : Upload, téléchargement et prévisualisation des pièces jointes.

---

## 🏗️ Architecture Technique & Pipeline

Le projet adopte une architecture orientée **Micro-services** pour garantir la scalabilité et la séparation des responsabilités.

```text
+-------------------+       REST API       +-------------------+
|                   |  <--------------->   |                   |
|   🖥️ FRONTEND     |                      |   ⚙️ BACKEND      |
|    (Next.js)      |                      |    (Laravel)      |
|                   |                      |                   |
+-------------------+                      +---------+---------+
                                                     |
                                                     | REST / JSON
                                                     v
                                           +-------------------+
                                           |                   |
                                           |   🧠 SERVICE OCR  |
                                           |    (FastAPI)      |
                                           |                   |
                                           +-------------------+
```

### ⚙️ Pipeline de Traitement OCR
Le processus d'analyse d'un document suit ce pipeline sophistiqué :
1. **Upload** : Envoi du fichier (PDF/DOCX) depuis le Frontend vers Laravel.
2. **Transfert** : Laravel transmet le document au micro-service FastAPI.
3. **Conversion & Prétraitement** : Transformation en images (OpenCV, PDF2Image) et nettoyage du bruit.
4. **Extraction (OCR)** : Utilisation de **EasyOCR** (Arabe/Français) pour lire le texte brut.
5. **Analyse NLP** : Modèles BERT pour la reconnaissance d'entités nommées (NER) + algorithmes de Fuzzy Matching (Rapidfuzz).
6. **Post-traitement** : Nettoyage, structuration des données en JSON et renvoi vers l'API Laravel.

---

## 💻 Technologies Utilisées

### 🎨 Frontend
- **Framework** : Next.js 16 (App Router), React 19
- **Styling** : Tailwind CSS 4, Radix UI, Shadcn/ui
- **Gestion d'état & Fetching** : React Query, Axios, React Hook Form
- **Data Viz** : Recharts

### 🛠️ Backend API
- **Framework** : Laravel 12 (PHP 8.2+)
- **Base de données** : MySQL / PostgreSQL / SQLite
- **Authentification** : Laravel Sanctum

### 🤖 IA & OCR Service
- **Framework Web** : FastAPI, Uvicorn
- **Moteur OCR** : EasyOCR, OpenCV, Pillow, PDF2Image
- **Traitement NLP** : Transformers (Hugging Face), Torch, PyArabic
- **Text Matching** : Rapidfuzz, Regex

---

## 📂 Structure du Projet

```text
smart-convention-management-ocr/
│
├── frontend/           # Interface utilisateur moderne (Next.js)
│   ├── app/            # Pages et routing
│   ├── components/     # Composants réutilisables (Shadcn)
│   ├── hooks/          # Custom hooks React
│   └── services/       # Appels API (Axios)
│
├── laravel-api/        # Logique métier et base de données
│   ├── app/Http/       # Controllers & Middleware
│   ├── routes/         # Définition des API (api.php)
│   └── database/       # Migrations, Seeders, Factories
│
└── ocr-service/        # Micro-service d'extraction
    ├── main.py         # Entrypoint FastAPI
    ├── Services/       # Logique OCR, NLP, Preprocess
    └── requirements.txt# Dépendances Python
```

---

## 🛠️ Prérequis & Installation

### Prérequis Système
- [Node.js](https://nodejs.org/) (v20+) & npm/yarn
- [PHP](https://www.php.net/) (v8.2+) & [Composer](https://getcomposer.org/)
- [Python](https://www.python.org/) (v3.9+)
- Serveur de base de données (MySQL, PostgreSQL ou SQLite)

### 1. Cloner le projet
```bash
git clone https://github.com/moun-13/smart-convention-management-ocr.git
cd smart-convention-management-ocr
```

### 2. Frontend (Next.js)
```bash
cd frontend
npm install
# Créez le fichier .env.local avec vos variables si nécessaire
```

### 3. Backend (Laravel)
```bash
cd laravel-api
composer install
cp .env.example .env
php artisan key:generate
# Configurez la base de données dans le fichier .env
php artisan migrate --seed
```

### 4. Service OCR (FastAPI)
```bash
cd ocr-service
# Création d'un environnement virtuel
python -m venv venv

# Activation sous Windows : 
venv\Scripts\activate
# Activation sous Linux/Mac : 
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
```

---

## 🚀 Lancement des Services

Pour un fonctionnement local complet, démarrez les 3 services simultanément :

| Service | Commande (dans le bon dossier) | URL Locale par défaut |
|---------|--------------------------------|-----------------------|
| **Frontend** | `npm run dev` | `http://localhost:3000` |
| **Laravel API** | `php artisan serve` | `http://localhost:8000` |
| **OCR Service** | `python -m uvicorn main:app --reload --port 8001` | `http://localhost:8001` |

---

## 🔌 Endpoints Principaux

### Laravel API (`/api/*`)
- `POST /login` : Authentification utilisateur.
- `GET /conventions` : Liste des conventions (avec rôles & permissions).
- `POST /piece-jointes/ocr/extract` : Soumission d'une pièce jointe pour traitement IA.
- `GET /dashboard/statistiques` : Récupération des données pour le dashboard.

### Service OCR (`/`)
- `GET /health` : Vérification du statut du service.
- `GET /diag` : Diagnostic détaillé des modules IA.
- `POST /extract` : Extraction et analyse du document PDF/DOCX (retourne les entités en JSON).

---

## 📸 Captures d'Écran

> *Les captures d'écran de l'interface seront ajoutées très prochainement.*

| Tableau de bord | Détail d'une Convention |
|-----------------|-------------------------|
| ![Dashboard Placeholder](https://via.placeholder.com/600x350?text=Dashboard+Principal) | ![Convention Placeholder](https://via.placeholder.com/600x350?text=Details+Convention) |

| Extraction OCR | Gestion des Partenaires |
|----------------|-------------------------|
| ![OCR Placeholder](https://via.placeholder.com/600x350?text=Vue+Extraction+OCR) | ![Partenaires Placeholder](https://via.placeholder.com/600x350?text=Liste+Partenaires) |

---

## 🔮 Améliorations Futures
- [ ] Prise en charge de nouveaux formats de documents (ex: Excel).
- [ ] Fine-tuning des modèles NLP pour des documents juridiques marocains spécifiques.
- [ ] Interface d'annotation pour l'apprentissage continu du modèle OCR.
- [ ] Génération automatique des contrats en format PDF structuré depuis la plateforme.

---

## 👨‍💻 Auteur

Développé dans le cadre d'un Projet de Fin d'Année (PFA) axé sur la numérisation et l'automatisation intelligente des flux administratifs.

**GitHub** : [@moun-13](https://github.com/moun-13)

---

## 🤝 Contribution

Les contributions sont les bienvenues !
1. **Forkez** le projet.
2. Créez votre branche (`git checkout -b feature/NouvelleFonctionnalite`).
3. Commitez vos modifications (`git commit -m 'Ajout dune NouvelleFonctionnalite'`).
4. Pushez vers la branche (`git push origin feature/NouvelleFonctionnalite`).
5. Ouvrez une **Pull Request**.

---

## 📜 Licence

Ce projet est sous licence **MIT**. Vous êtes libre de l'utiliser, de le modifier et de le distribuer. Voir le fichier `LICENSE` pour plus de détails.
