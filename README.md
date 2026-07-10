# Smart Convention Management OCR

Bienvenue dans le projet **Smart Convention Management OCR**. Il s'agit d'une plateforme complète de gestion intelligente des conventions, intégrant un service d'extraction de données via OCR (Reconnaissance Optique de Caractères).

## 🚀 Architecture du Projet

Le projet est divisé en trois micro-services principaux :

1. **Frontend (`/frontend`)** : Interface utilisateur moderne développée avec **Next.js** (React) et **Tailwind CSS**.
2. **Laravel API (`/laravel-api`)** : Backend principal gérant la logique métier, l'authentification et la base de données, développé avec **Laravel 12** (PHP).
3. **OCR Service (`/ocr-service`)** : Micro-service Python dédié au traitement d'images et à l'extraction de texte (OCR), développé avec **FastAPI**.

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants sur votre machine :

- [Node.js](https://nodejs.org/) (version 20+ recommandée) et `npm` ou `yarn`
- [PHP](https://www.php.net/) (version 8.2+)
- [Composer](https://getcomposer.org/) (gestionnaire de dépendances PHP)
- [Python](https://www.python.org/) (version 3.9+)
- Serveur de base de données (MySQL, PostgreSQL ou SQLite)

## 🛠️ Installation & Configuration

### 1. Cloner le dépôt
```bash
git clone https://github.com/moun-13/smart-convention-management-ocr.git
cd smart-convention-management-ocr
```

### 2. Configuration du Frontend (Next.js)
```bash
cd frontend
npm install
# Créez un fichier .env.local si nécessaire
```

### 3. Configuration de l'API Laravel
```bash
cd laravel-api
composer install
cp .env.example .env
php artisan key:generate
# Configurez votre base de données dans le fichier .env, puis lancez les migrations :
php artisan migrate --seed
```

### 4. Configuration du Service OCR (Python/FastAPI)
```bash
cd ocr-service
# Création d'un environnement virtuel (recommandé)
python -m venv venv
# Activation (Windows)
venv\Scripts\activate
# Activation (Linux/Mac)
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
```

## 🚀 Lancement de l'Application

Vous devez lancer les trois services en parallèle pour que l'application fonctionne correctement.

**1. Lancer le Frontend (Port 3000 par défaut) :**
```bash
cd frontend
npm run dev
```

**2. Lancer l'API Laravel (Port 8000 par défaut) :**
```bash
cd laravel-api
php artisan serve
```

**3. Lancer le Service OCR (Port 8001 par défaut) :**
```bash
cd ocr-service
python -m uvicorn main:app --reload --port 8001
```

## 🤝 Contribution

1. Forkez le projet
2. Créez votre branche de fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commitez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Poussez sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.
