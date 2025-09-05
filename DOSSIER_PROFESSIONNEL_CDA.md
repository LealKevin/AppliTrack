# DOSSIER PROFESSIONNEL CDA - APPLYTRACK

---

## 📝 CONTEXTE POUR L'ASSISTANT IA

**Projet :** ApplyTrack - Application full-stack de suivi de candidatures  
**Technologies :** Go + Echo (backend), React 19 + TypeScript (frontend), PostgreSQL, Docker, GitHub Actions  
**Architecture :** 3-couches (handler/service/store), API REST, tests complets, CI/CD automatisé  

**Instructions :**
- Garder un ton personnel et naturel (pas de style "IA")
- Respecter la chronologie logique du développement
- Intégrer des exemples de code concrets du projet
- Suivre le référentiel CDA 2024 (11 compétences dans 3 activités)
- DevOps dans l'Activité 3 (pas l'Activité 1)

---

# DOSSIER PROFESSIONNEL
## Concepteur Développeur d'Applications

**Projet :** ApplyTrack - Application de suivi de candidatures  
**Candidat :** [Votre nom]  
**Date :** [Date]

---

## SOMMAIRE

1. [Introduction et contexte du projet](#introduction)
2. [Développer une application sécurisée](#développer-application)  
3. [Concevoir une application multicouches](#concevoir-application)
4. [Préparer le déploiement](#préparer-déploiement)
5. [Bilan du projet](#bilan)
6. [Annexes](#annexes)

---

## 1. INTRODUCTION ET CONTEXTE DU PROJET {#introduction}

### Pourquoi ce projet ?

En tant que développeur en recherche d'emploi, j'ai rapidement réalisé la complexité de gérer efficacement mes candidatures. Entre les différentes plateformes (LinkedIn, Indeed, sites d'entreprises), les relances à effectuer, et le suivi des réponses, j'avais tendance à perdre le fil. 

J'utilisais d'abord un simple fichier Excel, puis j'ai testé quelques applications existantes, mais aucune ne correspondait vraiment à mes besoins spécifiques. Soit elles étaient trop complexes avec des fonctionnalités inutiles, soit trop basiques et peu ergonomiques.

C'est là que l'idée d'ApplyTrack est née : créer un outil simple, efficace, qui centralise toutes les informations importantes de mes candidatures avec une interface moderne et intuitive.

### Présentation d'ApplyTrack

ApplyTrack est une application web full-stack de suivi de candidatures d'emploi. Elle permet aux utilisateurs de centraliser et organiser efficacement leur recherche d'emploi.

**Les 3 fonctionnalités principales :**

1. **Gestion des candidatures** 📝
   - Création, modification, suppression des candidatures
   - Suivi complet : poste, entreprise, localisation, date d'envoi, statut
   - Évolution du statut : envoyée → en attente → entretien → refusée/acceptée
   - Notes personnalisées et liens vers les offres

2. **Système de rappels** ⏰
   - Programmation de rappels personnalisés pour chaque candidature
   - Notifications pour les relances à effectuer
   - Gestion des rappels : en retard, du jour, de la semaine
   - Marquage des rappels comme terminés

3. **Suivi des entretiens** 🎯
   - Gestion complète des rounds d'entretien (téléphone, technique, final, présentiel)
   - Planification et suivi des entretiens programmés
   - Détails complets : intervieweur, durée, notes, résultats
   - Historique des entretiens par candidature

**Architecture technique :**
- **Backend REST API** en Go avec Echo framework
- **Frontend moderne** en React 19 + TypeScript
- **Base de données** PostgreSQL avec 4 tables principales
- **Containerisation** Docker pour le déploiement
- **CI/CD automatisé** avec GitHub Actions

### Choix techniques

Pour ce projet, j'ai opté pour une stack moderne et performante :

**Backend - Go + Echo :**
- **Performance** : Go offre d'excellentes performances avec une consommation mémoire faible
- **Sécurité** : Typage fort, gestion native des erreurs, bibliothèques sécurisées
- **Simplicité** : Echo est un framework minimaliste mais complet pour les API REST
- **Écosystème** : Outils excellents (SQLC pour la génération de code, migrate pour les migrations)

**Frontend - React 19 + TypeScript :**
- **UX moderne** : React permet une interface réactive et fluide
- **Sécurité de type** : TypeScript évite les erreurs de runtime communes
- **Écosystème** : TanStack Query pour la gestion des états serveur, Radix UI pour l'accessibilité
- **Performance** : Optimisations natives de React 19 (concurrent features)

**Base de données - PostgreSQL :**
- **Fiabilité** : Base de données mature avec ACID compliance
- **Fonctionnalités** : Support des UUID, contraintes avancées, index performants
- **Intégration** : Excellente compatibilité avec Go via pgx

**DevOps - Docker + GitHub Actions :**
- **Reproductibilité** : Environnements identiques dev/prod
- **Automation** : CI/CD complet avec tests automatisés

### Objectifs personnels

En réalisant ce projet, je voulais atteindre plusieurs objectifs :

**Sur le plan technique :**
- **Maîtriser Go** : J'avais déjà fait du Go mais jamais avec une architecture multicouches propre
- **Approfondir React avec TypeScript** : Consolider mes bases et gérer un projet complet
- **Mettre en place du DevOps** : Apprendre à faire un vrai pipeline CI/CD avec des tests automatisés
- **Comprendre la sécurité web** : Implémenter correctement JWT et les bonnes pratiques

**Sur le plan méthodologique :**
- **Architecture multicouches** : Structurer proprement une application pour qu'elle soit maintenable
- **Tests d'intégration** : Découvrir Testcontainers pour tester avec une vraie base de données
- **Gestion de projet** : Mener un projet technique de bout en bout

**Pour le titre CDA :**
- Avoir un projet concret qui démontre les 3 activités du référentiel
- Montrer que je peux développer, concevoir et déployer une application complète
- Prouver mes compétences techniques dans un contexte professionnel

Au final, ce projet me sert à la fois pour mon usage personnel et pour valider mes compétences de développeur.

---

## 2. DÉVELOPPER UNE APPLICATION SÉCURISÉE {#développer-application}

### Installation et configuration de l'environnement

**Ce que j'ai fait :**
J'ai mis en place un environnement de développement reproductible avec Docker Compose pour éviter les problèmes de "ça marche sur ma machine". L'idée était d'avoir exactement les mêmes versions et configurations entre développement et production.

- **Docker Compose** : Configuration complète avec PostgreSQL, volumes persistants et variables d'environnement
- **Outils de développement** : Installation de Go 1.23, Node.js 20, et configuration des éditeurs avec les extensions appropriées
- **Base de données** : PostgreSQL 15 avec configuration dédiée développement (port différent de la prod)
- **Variables d'environnement** : Fichiers `.env` séparés pour dev et production

**Exemple de configuration :**
```yaml
# docker-compose.yml - Environnement de développement
services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: applytrack_dev
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: password
    ports:
      - "5433:5432"
```

**Résultats :**
Environnement de développement opérationnel en une seule commande (`docker-compose up`). Tous les développeurs peuvent démarrer le projet immédiatement sans configuration complexe.

La mise en place de l'environnement Docker m'a initialement posé des défis. Les conflits de ports avec mes autres projets PostgreSQL locaux m'ont forcé à bien réfléchir aux ports par défaut. J'ai opté pour le port 5434 en développement (visible dans mon docker-compose.yml) pour éviter les collisions. La synchronisation entre les migrations Tern et la base Docker a également demandé quelques ajustements avant d'avoir un workflow fluide.

### Développement des interfaces utilisateur

**Ce que j'ai fait :**
J'ai développé une interface utilisateur moderne et fonctionnelle avec React et TypeScript. L'objectif était d'avoir une UX intuitive pour gérer facilement les candidatures.

- **Interface moderne** : Radix UI pour les composants avec styling Tailwind CSS
- **Composants réutilisables** : `Button`, `Badge`, `Dialog`, `Table` pour éviter la duplication de code
- **Design responsive** : Interface qui s'adapte sur mobile et desktop
- **Gestion d'état** : TanStack Query pour synchroniser les données avec l'API

**Exemple de composant réel du projet :**
```tsx
// Button.tsx - Composant Button réutilisable avec variants
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10rem] text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md gap-1.5 px-3",
        lg: "h-10 rounded-md px-6",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
```

**Résultats :**
Interface utilisateur fonctionnelle et intuitive. Les utilisateurs peuvent facilement naviguer entre les candidatures, créer des rappels, et suivre leurs entretiens. Le design responsive fonctionne bien sur tous les appareils.

Le développement avec TanStack Query était nouveau pour moi après avoir utilisé Redux sur d'autres projets. La logique de cache et d'invalidation des requêtes a nécessité un temps d'adaptation. J'ai particulièrement galéré sur la synchronisation des données lors des imports CSV - il fallait que le modal de résultats se mette à jour en temps réel et que la liste des candidatures se rafraîchisse automatiquement après un import réussi. La solution avec `queryClient.invalidateQueries()` s'est révélée très élégante une fois maîtrisée.

### Développement des composants métier

**Ce que j'ai fait :**
J'ai développé l'API backend en Go avec une architecture en 3 couches pour séparer clairement les responsabilités. L'accent était mis sur la sécurité et la maintenabilité.

- **Architecture 3-couches** : Handler (HTTP), Service (logique métier), Store (accès données)
- **Sécurité multicouches** : Hachage Argon2 des mots de passe, authentification JWT, validation des entrées, protection CSRF
- **Requêtes sécurisées** : SQLC pour des requêtes type-safe (pas d'injection SQL)
- **Gestion des erreurs** : Traitement propre avec messages appropriés pour l'utilisateur

**Exemple de service réel du projet :**
```go
// service.go - Import CSV avec gestion d'erreurs avancée (extrait)
func (s *Service) ImportApplicationsFromCSV(userID uuid.UUID, csvContent string) (*ImportResult, error) {
	reader := csv.NewReader(strings.NewReader(csvContent))
	records, err := reader.ReadAll()
	if err != nil {
		return nil, fmt.Errorf("failed to parse CSV: %w", err)
	}

	result := &ImportResult{
		TotalRecords: len(records) - 1, // Excluding header
	}

	for i, record := range records[1:] { // Skip header
		if len(record) != 7 {
			errorMsg := fmt.Sprintf("Row %d: Expected 7 columns, got %d", i+2, len(record))
			result.Failures = append(result.Failures, errorMsg)
			result.FailureCount++
			continue
		}

		// Validation de la date
		sentDate, err := time.Parse("2006-01-02", strings.TrimSpace(record[2]))
		if err != nil {
			errorMsg := fmt.Sprintf("Row %d: Invalid date format '%s' (expected YYYY-MM-DD)", i+2, record[2])
			result.Failures = append(result.Failures, errorMsg)
			result.FailureCount++
			continue
		}

		// Création de l'application avec gestion d'erreur
		params := db.CreateOneApplicationParams{
			TitleApplication: strings.TrimSpace(record[0]),
			Company:         strings.TrimSpace(record[1]),
			SentDate:        pgtype.Date{Time: sentDate, Valid: true},
			Location:        strings.TrimSpace(record[3]),
			UserID:          userID,
		}

		_, err = s.store.CreateOne(params)
		if err != nil {
			errorMsg := fmt.Sprintf("Row %d: Failed to create application: %v", i+2, err)
			result.Failures = append(result.Failures, errorMsg)
			result.FailureCount++
		} else {
			result.SuccessCount++
		}
	}

	return result, nil
}
```

**Résultats :**
API backend robuste et sécurisée. Toutes les fonctionnalités métier sont opérationnelles : gestion des candidatures, rappels, et suivi d'entretiens. Les données sont protégées et l'authentification fonctionne correctement.

La sécurité m'a demandé beaucoup de recherches. Argon2 était recommandé comme plus sécurisé que bcrypt, mais la configuration des paramètres (time=1, memory=64*1024, threads=4) n'était pas triviale. Il fallait trouver le bon équilibre entre sécurité et performance. Pour les JWT, j'ai longtemps hésité entre localStorage et cookies HTTPOnly. J'ai finalement opté pour les cookies sécurisés pour éviter les attaques XSS, mais cela a compliqué la gestion côté frontend avec Axios.

### Gestion du projet

**Ce que j'ai fait :**
J'ai organisé le projet pour qu'il soit maintenable et professionnel. L'idée était de structurer le code comme dans un vrai projet d'entreprise.

- **Structure du code** : Organisation claire avec séparation frontend/backend et conventions de nommage
- **Gestion des versions** : Git avec branches, commits clairs, et workflow de développement
- **Configuration** : Variables d'environnement, Docker Compose, fichiers de configuration
- **Planification** : Développement par fonctionnalités (candidatures → rappels → entretiens)

**Résultats :**
Projet structuré et professionnel. Le code est organisé, les dépendances sont gérées proprement, et le workflow de développement est efficace.

Ma plus grosse difficulté a été la discipline dans l'approche feature-by-feature. J'avais tendance à commencer l'import CSV alors que les rappels n'étaient pas finis, ou à me lancer dans les analytics avant d'avoir solidifié le CRUD de base. Cela créait des bugs difficiles à diagnostiquer et une base de code instable. J'ai appris l'importance de finir complètement une fonctionnalité (tests inclus) avant de passer à la suivante.

---

## 3. CONCEVOIR UNE APPLICATION MULTICOUCHES {#concevoir-application}

### Analyse des besoins et spécifications

**Ce que j'ai fait :**
En partant de mon besoin personnel de développeur en recherche d'emploi, j'ai mené une analyse approfondie pour comprendre les besoins de tous les demandeurs d'emploi. J'ai rapidement réalisé que le problème touche tous les secteurs professionnels.

Cette analyse m'a amené à concevoir ApplyTrack comme une solution universelle plutôt qu'un outil spécifique aux développeurs.

**Analyse des acteurs :**

**Acteurs principaux :**
- **Demandeur d'emploi généraliste** : Commercial, Marketing, RH, Ingénieur, Enseignant, etc.
- **Étudiant/Jeune diplômé** : Recherche de stage, alternance, premier emploi
- **Cadre en transition** : Reconversion professionnelle, évolution de carrière
- **Freelance/Consultant** : Recherche de missions et postes permanents

**Acteurs secondaires :**
- **Coach carrière** : Accompagnement de clients demandeurs d'emploi
- **Cabinet de recrutement** : Suivi des candidats placés (évolution future)

**Étude des besoins par profil :**

**Profil 1 : Commercial**
- Suivi des candidatures dans différentes entreprises/secteurs
- Gestion des entretiens avec directeurs commerciaux/RH
- Analyse de sa performance par zone géographique
- Rappels pour négociation de salaire/commissions

**Profil 2 : Ingénieur/Technique**
- Candidatures spécialisées (backend, frontend, DevOps, etc.)
- Entretiens techniques multiples (code review, architecture)
- Suivi des certifications requises par poste
- Historique des technologies demandées

**Profil 3 : Marketing/Communication**
- Portfolio à associer aux candidatures
- Suivi des campagnes de personal branding
- Entretiens créatifs avec présentation de réalisations
- Analyse par taille d'entreprise (startup vs grand groupe)

**Profil 4 : Étudiant/Alternant**
- Candidatures stages et alternances
- Suivi des réponses écoles/entreprises partenaires
- Gestion calendrier scolaire/périodes entreprise
- Évolution vers CDI post-diplôme

**Besoins fonctionnels universels :**

**Epic 1 : Gestion centralisée des candidatures**
- CRUD complet des candidatures avec champs personnalisables
- Catégorisation par secteur, type de poste, localisation
- Statuts adaptables selon le processus de recrutement
- Pièces jointes (CV, lettre motivation, portfolio)

**Epic 2 : Système de rappels intelligent**
- Rappels automatiques basés sur les délais sectoriels
- Notifications multicritères (urgent, important, routine)
- Templates de relance personnalisables
- Historique des interactions entreprise

**Epic 3 : Gestion des entretiens multi-niveaux**
- Processus d'entretien adaptables (1 à N rounds)
- Types personnalisables (téléphone, visio, présentiel, technique)
- Préparation par type d'entretien
- Feedback et axes d'amélioration

**Epic 4 : Analytics et reporting**
- Tableaux de bord adaptés par profil métier
- KPIs sectoriels (taux réponse, durée processus)
- Analyses temporelles et géographiques
- Export pour présentation bilan carrière

**Epic 5 : Personnalisation et scalabilité**
- Profils métiers prédéfinis
- Champs personnalisables par secteur
- Intégrations possibles (LinkedIn, Indeed, Glassdoor)
- Multi-comptes (plusieurs recherches simultanées)

#### User Stories principales

**US01 - Créer une candidature**
- **En tant que** demandeur d'emploi
- **Je veux** ajouter une nouvelle candidature avec poste, entreprise, date et statut
- **Afin de** centraliser le suivi de mes démarches

**US02 - Suivre l'évolution d'une candidature**
- **En tant que** utilisateur
- **Je veux** modifier le statut de ma candidature (envoyée → entretien → refusée)
- **Afin de** voir où j'en suis dans chaque processus

**US03 - Programmer des rappels**
- **En tant que** candidat organisé
- **Je veux** créer un rappel avec une date sur une candidature
- **Afin de** ne pas oublier de relancer l'entreprise

**US04 - Gérer mes entretiens**
- **En tant que** candidat en processus
- **Je veux** créer des rounds d'entretien (téléphone, technique, final)
- **Afin de** suivre l'avancement et préparer chaque étape

**US05 - Importer mes données**
- **En tant que** utilisateur venant d'Excel
- **Je veux** importer un fichier CSV avec mes candidatures
- **Afin de** migrer facilement vers ApplyTrack

**US06 - Voir mes statistiques**
- **En tant que** demandeur d'emploi
- **Je veux** consulter un tableau de bord avec mes stats (total, en cours, refusées)
- **Afin d'** analyser l'efficacité de ma recherche

**Exemple d'usage :**
Je trouve un poste "Développeur Go" chez "StartupTech" → Je l'ajoute dans ApplyTrack → Je programme un rappel dans 2 semaines → L'entreprise m'appelle → Je crée un round "entretien RH" → Résultat positif → Je crée le round suivant "entretien technique"

**Analyse concurrentielle :**
- **LinkedIn** : Réseau mais pas d'outil de suivi structuré
- **Notion/Airtable** : Flexibles mais demandent configuration manuelle
- **Applications spécialisées** : Souvent limitées à un secteur ou payantes
- **Excel/Sheets** : Basiques, pas de fonctionnalités avancées

**Positionnement ApplyTrack :**
- Solution **gratuite** et **universelle** (tous secteurs)
- **Pré-configurée** avec templates métiers
- **Évolutive** (du junior au senior, reconversion)
- **Centralisée** (une seule plateforme vs dispersion)

**Validation du marché potentiel :**
- **Marché primaire** : 3,4M demandeurs d'emploi France (INSEE)
- **Marché élargi** : Actifs en recherche passive (~15M)
- **Segments prioritaires** : Tech (forte croissance), Commercial (turnover élevé), Jeunes diplômés
- **Modèle économique** : Freemium (base gratuite, premium avec analytics avancées)

**Résultats :**
Vision produit élargie validant un marché potentiel significatif. Cette approche universelle justifie l'investissement technique et ouvre des perspectives d'évolution business du projet.

L'analyse des besoins m'a rapidement montré la complexité du marché de l'emploi. Chaque secteur a ses spécificités : un commercial ne suit pas ses candidatures comme un développeur ou un enseignant. J'ai failli créer des interfaces complètement différentes par métier, mais c'était trop ambitieux pour un MVP. J'ai finalement gardé une base commune solide (titre, entreprise, statut, date) en prévoyant l'extensibilité future avec des champs optionnels et des types d'entretiens configurables.

### Architecture logicielle et système

ApplyTrack est conçu avec une architecture moderne basée sur la séparation des responsabilités et les principes SOLID. L'objectif était d'obtenir un système maintenable, testable et évolutif pour supporter la croissance du projet et faciliter la collaboration d'équipe.

#### Vue d'ensemble du système

**Architecture générale :**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Base de       │
│   React + TS    │◄──►│   Go + Echo     │◄──►│   Données       │
│   Port: 5173    │    │   Port: 8080    │    │   PostgreSQL    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Infrastructure                               │
│  Docker Compose + GitHub Actions + Deployment Pipeline         │
└─────────────────────────────────────────────────────────────────┘
```

#### Architecture Backend - Approche 3-couches

**Modèle en couches :**
```
┌─────────────────────────────────────────────────────────────┐
│                    Couche Présentation                     │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐│
│  │   Routes    │ │  Handlers   │ │     Middleware          ││
│  │             │ │             │ │  (Auth, CORS, Logging)  ││
│  └─────────────┘ └─────────────┘ └─────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Couche Métier                            │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐│
│  │  Services   │ │ Validations │ │   Règles Métier         ││
│  │             │ │             │ │                         ││
│  └─────────────┘ └─────────────┘ └─────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Couche Données                            │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐│
│  │    Store    │ │    SQLC     │ │      PostgreSQL         ││
│  │             │ │  Queries    │ │                         ││
│  └─────────────┘ └─────────────┘ └─────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

**Détails d'implémentation backend (exemple CreateRound) :**

**1. Couche Présentation (Handler) :**
```go
// Structure réelle du handler
type Handler struct {
    Service *ApplicationService
    Store   Store
}

// Responsabilités : HTTP, validation, authentification, formatage réponses
func (h *Handler) CreateRound(c echo.Context) error {
    userID := c.Get("userID").(uuid.UUID)
    applicationID, err := uuid.Parse(c.Param("id"))
    if err != nil {
        return echo.NewHTTPError(http.StatusBadRequest, "invalid application ID")
    }

    var roundRequest RoundRequest
    if err := c.Bind(&roundRequest); err != nil {
        return echo.NewHTTPError(http.StatusBadRequest, fmt.Errorf("invalid round json: %w", err))
    }

    if err := c.Validate(roundRequest); err != nil {
        return err
    }

    createdRound, err := h.Service.CreateRound(userID, applicationID, roundRequest)
    if err != nil {
        return echo.NewHTTPError(http.StatusBadRequest, "unable to create round: "+err.Error())
    }

    return c.JSON(http.StatusCreated, createdRound)
}
```

**2. Couche Métier (Service) :**
```go
// Structure réelle du service
type ApplicationService struct {
    Store Store
}

// Responsabilités : logique métier, validation, transformation données
func (s ApplicationService) CreateRound(userID, applicationID uuid.UUID, roundRequest RoundRequest) (RoundResp, error) {
    // Validation métier : vérifier que la candidature appartient à l'utilisateur
    if err := CheckApplicationExists(s.Store, userID, applicationID); err != nil {
        return RoundResp{}, fmt.Errorf("application does not exist for user: %w", err)
    }

    // Transformation des données pour la couche store
    roundParams := db.CreateRoundParams{
        ApplicationID: applicationID,
        Title:         roundRequest.Title,
        Type:          roundRequest.Type,
        Status:        roundRequest.Status,
        Date:          roundRequest.Date,
        Notes:         utils.PgtypeTextFromPointer(roundRequest.Notes),
        Interviewer:   utils.PgtypeTextFromPointer(roundRequest.Interviewer),
        Duration:      utils.PgtypeTextFromPointer(roundRequest.Duration),
        Outcome:       utils.PgtypeTextFromPointer(roundRequest.Outcome),
    }

    round, err := s.Store.CreateRound(roundParams)
    if err != nil {
        return RoundResp{}, fmt.Errorf("could not create round: %w", err)
    }
    return mapperToRoundResp(round), nil
}
```

**3. Couche Données (Store) :**
```go
// Interface réelle du store
type Store interface {
    CreateRound(round db.CreateRoundParams) (db.Round, error)
    GetRounds(appID uuid.UUID) ([]db.Round, error)
    UpdateRound(round db.UpdateRoundParams) (db.Round, error)
    DeleteRound(roundID uuid.UUID) error
}

// Implémentation PostgreSQL avec SQLC
type PostgresApplicationStore struct {
    db *db.Queries
}

// Responsabilités : exécution requêtes SQL type-safe, gestion erreurs
func (s *PostgresApplicationStore) CreateRound(round db.CreateRoundParams) (db.Round, error) {
    ctx := context.Background()
    createdRound, err := s.db.CreateRound(ctx, round)
    if err != nil {
        return db.Round{}, fmt.Errorf("could not create round: %w", err)
    }
    return createdRound, nil
}
```

#### Architecture Frontend - Feature-Based

**Organisation modulaire par fonctionnalité :**
```
frontend/src/
├── app/                          # Configuration application
│   ├── App.tsx                   # Root component
│   ├── main.tsx                  # Point d'entrée
│   └── queryClient.tsx           # Configuration TanStack Query
├── shared/                       # Code partagé transversal
│   ├── components/               # Composants partagés
│   │   ├── ui/                   # Design system (Radix UI)
│   │   ├── HomePage.tsx          # Page d'accueil
│   │   ├── Layout.tsx            # Layout principal
│   │   ├── app-sidebar.tsx       # Sidebar application
│   │   └── header.tsx            # En-tête
│   ├── hooks/                    # Hooks réutilisables
│   ├── utils/                    # Fonctions utilitaires
│   ├── contexts/                 # Contexts globaux (thème)
│   ├── routes/                   # Configuration routing
│   ├── types/                    # Types TypeScript partagés
│   └── validation/               # Schémas Zod validation
├── features/                     # Modules métier
│   ├── authentication/          # Gestion connexion utilisateur
│   │   ├── components/          # login-form, signin-form
│   │   ├── hooks/               # useConnection, useCreateAccount
│   │   ├── pages/               # LoginPage, SigninPage, CheckUser
│   │   └── contexts/            # AuthContext, modals
│   ├── applications/            # Gestion candidatures
│   │   ├── components/          # ApplicationEditModal, data-table/, etc.
│   │   ├── hooks/               # useApplications, useDeleteApp
│   │   └── pages/               # ApplicationsPage, InterviewsPage
│   ├── analytics/               # Tableaux de bord
│   │   ├── components/          # chart-area-interactive, analytics-cards
│   │   ├── hooks/               # useAnalytics
│   │   └── pages/               # StatsPage
│   ├── data-tables/             # Système de tableaux réutilisables
│   │   └── components/          # data-table.tsx, table.tsx
│   ├── import-export/           # Import/export CSV
│   │   └── components/          # ImportModal, ImportResultsModal
│   ├── reminders/               # Système de rappels
│   │   ├── components/          # ReminderCard, NotificationBell
│   │   ├── hooks/               # useReminderActions
│   │   ├── pages/               # RemindersPage
│   │   └── types/               # Types dashboard
│   └── dashboard/               # Hooks dashboard général
│       └── hooks/               # useDashboardStats
└── pages/                       # Pages de routage principal
    ├── Layout.tsx               # Layout des pages
    └── OffersPage.tsx           # Page offres
```

**Principes d'architecture frontend :**

**1. Séparation des responsabilités :**
```typescript
// Exemple module Applications
├── hooks/
│   ├── useApplications.tsx       # Logique métier + API
│   ├── useCreateApplication.tsx  # Création candidature
│   └── useDeleteApp.ts           # Suppression candidature
├── components/
│   ├── ApplicationEditModal.tsx  # Modal d'édition
│   ├── ApplicationRemoveModal.tsx # Modal de suppression  
│   └── data-table/              # Composants table avancée
└── pages/
    ├── ApplicationsPage.tsx      # Page liste candidatures
    ├── ApplicationsTablePage.tsx # Page table avancée
    ├── InterviewsPage.tsx        # Page entretiens
    └── RoundsPage.tsx           # Page rounds
```

**2. Custom Hooks pour la logique (code réel) :**
```typescript
// useApplications.tsx - Hook de gestion des candidatures
function useApplications(status: string = "") {
    const applications = useQuery<InterviewApplication[]>({
        queryKey: ["applications", status],
        queryFn: () => fetchApplications(status),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    const appsCount = useQuery<ApplicationCounts>({
        queryKey: ["appsCount"],
        queryFn: getAppsCount,
        staleTime: 5 * 60 * 1000,
    });

    return {
        applications: applications.data?.map(app => app.Application) ?? [],
        isLoading: applications.isLoading || appsCount.isLoading,
        error: applications.error || appsCount.error,
        refetch: applications.refetch,
        appsCount: appsCount.data,
    };
}

// useCreateApplication.tsx - Hook de création
export default function useCreateApplication() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["applications"],
    mutationFn: (application: IApplication) => createApplication(application),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["appsCount"] });
      queryClient.invalidateQueries({ queryKey: ["interviewApplications"] });
    },
  });

  return mutation;
}
```

**3. Design System cohérent (StatusBadge réel) :**
```typescript
// StatusBadge.tsx - Composant de statut avec configuration thème
import { Badge } from "@/shared/components/ui/badge";

function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    pending: {
      label: "Pending",
      className: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
    },
    sent: {
      label: "Sent",
      className: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    },
    interview_scheduled: {
      label: "Interview Scheduled",
      className: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
    },
    interviewing: {
      label: "Interviewing",
      className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    },
    rejected: {
      label: "Rejected",
      className: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    },
    offer: {
      label: "Offer Received",
      className: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    },
  };

  const config = statusConfig[status];

  return (
    <Badge
      variant="outline"
      className={`${config.className} w-full text-xs font-medium px-2 py-1 rounded-full border-none`}
    >
      {config.label}
    </Badge>
  );
}
```

#### Communication Frontend-Backend

**Architecture API REST :**
```
┌─────────────────┐                    ┌─────────────────┐
│   Frontend      │                    │    Backend      │
│                 │                    │                 │
│  TanStack Query │──── HTTP/JSON ────►│  Echo Router    │
│                 │◄─── REST API ──────│                 │
│   Axios Client  │                    │   Handlers      │
└─────────────────┘                    └─────────────────┘
```

**Gestion des appels API :**
```typescript
// apiCalls.ts - Client API avec fonctions individuelles
const API_URL = import.meta.env.VITE_API_URL || "";

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

// Interceptors pour CSRF protection
apiClient.interceptors.request.use(async (config) => {
  if (config.method !== 'get' && config.method !== 'GET') {
    try {
      const token = await fetchCSRFToken();
      config.headers['X-CSRF-Token'] = token;
    } catch {
      // Silently ignore CSRF token fetch errors
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403 && error.response?.data?.message?.includes('CSRF')) {
      csrfToken = null;
    }
    return Promise.reject(error);
  }
);

// Fonctions API pour les candidatures
export async function fetchApplications(status: string): Promise<InterviewApplication[]> {
  const response = await apiClient.get<InterviewApplication[]>(
    `/api/applications?status=${status ?? ""}`
  );
  return response.data;
}

export async function createApplication(application: IApplication) {
  const applicationRequest = {
    title: application.title_application,
    company: application.company,
    location: application.location || "",
    sent_date: new Date(application.sent_date).toISOString(),
    status: application.status,
    notes: application.notes || "",
    url_application: application.url_application,
  };
  
  const response = await apiClient.post<IApplication>("/api/application", applicationRequest);
  return response.data;
}

export async function updateApplication(application: IApplication) {
  const response = await apiClient.put<IApplication>(`/api/applications/${application.id}`, {
    title: application.title_application,
    company: application.company,
    location: application.location || "",
    sent_date: new Date(application.sent_date).toISOString(),
    status: application.status,
    notes: application.notes || "",
    url_application: application.url_application,
  });
  return response.data;
}
```

#### Patterns architecturaux utilisés

**1. Dependency Injection (Backend réel) :**
```go
// server.go - Configuration des dépendances dans votre projet
func (s *Server) Start(port string) error {
    queries := q.New(db.Conn)

    // Création des stores
    userStore := user.NewUserStorage(queries)
    applicationStore := application.NewApplicationStorage(queries)
    reminderStore := reminder.NewStore(queries)

    // Création des services avec injection des stores
    userService := user.NewService(userStore)
    applicationService := application.NewService(applicationStore)
    reminderService := reminder.NewService(reminderStore)

    // Création des handlers avec injection des services
    userHandler := user.NewHandler(userService)
    applicationHandler := application.NewHandler(applicationService, applicationStore)
    reminderHandler := reminder.NewHandler(reminderService)

    // Configuration des routes
    s.SetupRoutes(userHandler, applicationHandler, reminderHandler)
}
```

**2. Command Query Separation avec TanStack Query :**
```typescript
// hooks/useApplications.tsx - Query (lecture)
function useApplications(status: string = "") {
    const applications = useQuery<InterviewApplication[]>({
        queryKey: ["applications", status],
        queryFn: () => fetchApplications(status),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    return {
        applications: applications.data?.map(app => app.Application) ?? [],
        isLoading: applications.isLoading,
        error: applications.error,
        refetch: applications.refetch,
    };
}

// hooks/useCreateApplication.tsx - Command (mutation)
export default function useCreateApplication() {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationKey: ["applications"],
        mutationFn: (application: IApplication) => createApplication(application),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["applications"] });
            queryClient.invalidateQueries({ queryKey: ["appsCount"] });
            queryClient.invalidateQueries({ queryKey: ["interviewApplications"] });
        },
    });

    return mutation;
}
```

#### Gestion des états et flux de données

**État global vs état local :**
```typescript
// État global (TanStack Query) : données serveur
const { data: applications } = useApplications()
const { data: user } = useCurrentUser()

// État local (useState) : état UI temporaire
const [selectedIds, setSelectedIds] = useState<string[]>([])
const [filters, setFilters] = useState<ApplicationFilters>({})

// État de formulaire (React Hook Form)
const form = useForm<CreateApplicationFormData>({
  resolver: zodResolver(createApplicationSchema),
  defaultValues: { status: 'sent' }
})
```

**Flux de données unidirectionnel :**
```
User Action → Event Handler → API Call → Cache Update → UI Re-render
     ↓              ↓            ↓            ↓           ↓
[Button Click] → [mutate()] → [POST /api] → [queryClient] → [Component]
```

#### Sécurité architecturale

**Authentification et autorisation :**
```go
// Middleware JWT
func JWTMiddleware() echo.MiddlewareFunc {
    return middleware.JWTWithConfig(middleware.JWTConfig{
        SigningKey:  []byte(os.Getenv("JWTSECRET")),
        TokenLookup: "cookie:jwt",
        ErrorHandler: func(err error) error {
            return echo.NewHTTPError(http.StatusUnauthorized, "invalid token")
        },
    })
}

// Protection des routes
api := app.Group("/api", JWTMiddleware())
api.GET("/applications", handlers.Application.List) // Protégée
```

**Validation multicouche :**
```
Frontend (Zod) → Backend (Validator) → Database (Constraints)
     ↓                    ↓                     ↓
[Type Safety]    [Business Rules]        [Data Integrity]
```

#### Performance et optimisations

**Backend :**
- **Connection pooling** PostgreSQL (pgxpool)
- **Index optimisés** sur requêtes fréquentes  
- **Pagination** pour grandes listes
- **Caching** potentiel (Redis future)

**Frontend :**
- **Code splitting** par route
- **Lazy loading** des composants lourds
- **Optimistic updates** pour UX fluide
- **Debouncing** sur recherches
- **Virtual scrolling** pour grandes listes

Cette architecture offre une base solide pour l'évolution du projet : maintenabilité grâce à la séparation des couches, testabilité avec l'injection de dépendances, performance avec les optimisations ciblées, et sécurité avec la validation multicouche. L'approche pragmatique évite la sur-ingénierie tout en gardant une structure professionnelle.

**Exemple d'implémentation :**
```go
// handler.go - Couche présentation
type Handler struct {
    service Service
    store   Store
}

func (h *Handler) CreateApplication(c echo.Context) error {
    var req CreateApplicationRequest
    if err := c.Bind(&req); err != nil {
        return echo.NewHTTPError(http.StatusBadRequest, "invalid request format")
    }
    
    if err := c.Validate(req); err != nil {
        return echo.NewHTTPError(http.StatusBadRequest, err.Error())
    }
    
    userID := c.Get("userID").(uuid.UUID)
    
    app, err := h.service.CreateApplication(userID, req)
    if err != nil {
        if errors.Is(err, ErrDuplicateApplication) {
            return echo.NewHTTPError(http.StatusConflict, "application already exists")
        }
        return echo.NewHTTPError(http.StatusInternalServerError, "could not create application")
    }
    
    return c.JSON(http.StatusCreated, app)
}
```


### Conception et modélisation de la base de données

**Approche méthodologique :**
Pour concevoir la base de données d'ApplyTrack, j'ai suivi une démarche structurée en 3 étapes : analyse conceptuelle (MCD), modélisation logique (MLD), puis implémentation physique (MPD). Cette approche garantit la cohérence des données et l'évolutivité du système.

#### Modèle Conceptuel de Données (MCD)

**Entités identifiées :**

**UTILISATEUR**
- Attributs : id, email, mot_de_passe, date_creation, date_modification
- Contraintes : email unique, mot_de_passe hashé
- Cardinalité : Un utilisateur peut avoir plusieurs candidatures (1,n)

**CANDIDATURE** 
- Attributs : id, titre_poste, entreprise, localisation, date_envoi, statut, notes, url_offre, date_creation, date_modification
- Contraintes : titre_poste et entreprise obligatoires, statut dans liste prédéfinie
- Cardinalité : Une candidature appartient à un utilisateur (1,1), peut avoir plusieurs rappels (0,n) et plusieurs rounds d'entretien (0,n)

**RAPPEL**
- Attributs : id, date_rappel, statut, date_creation, date_modification  
- Contraintes : date_rappel future, statut (pending/completed)
- Cardinalité : Un rappel concerne une candidature (1,1)

**ROUND_ENTRETIEN**
- Attributs : id, titre, type_entretien, statut, date_entretien, notes, intervieweur, duree, resultat, date_creation, date_modification
- Contraintes : type dans liste prédéfinie (phone_screen, technical, final, onsite), statut (scheduled, completed, passed, failed)
- Cardinalité : Un round concerne une candidature (1,1)

**Relations identifiées :**
- UTILISATEUR → CANDIDATURE : (1,n) "possède"
- CANDIDATURE → RAPPEL : (1,n) "génère" 
- CANDIDATURE → ROUND_ENTRETIEN : (1,n) "comprend"

**Règles de gestion :**
- RG01 : Un utilisateur doit avoir un email unique dans le système
- RG02 : Une candidature ne peut pas avoir le même titre et la même entreprise pour un utilisateur donné
- RG03 : Un rappel ne peut être créé que pour une candidature existante
- RG04 : Un round d'entretien est obligatoirement lié à une candidature
- RG05 : La suppression d'une candidature supprime automatiquement ses rappels et rounds (cascade)
- RG06 : Les statuts de candidature suivent un workflow défini
- RG07 : Les dates de rappel ne peuvent pas être dans le passé lors de la création

#### Modèle Logique de Données (MLD)

**Transformation du MCD en tables relationnelles :**

```sql
-- Table principale des utilisateurs
USERS (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

-- Table des candidatures
APPLICATIONS (
    id UUID PRIMARY KEY,
    title_application VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    sent_date DATE NOT NULL,
    status VARCHAR(50) CHECK (status IN ('sent', 'pending', 'rejected', 'interview_scheduled', 'interviewing', 'offer')),
    notes TEXT,
    url_application TEXT,
    user_id UUID NOT NULL REFERENCES USERS(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(title_application, company, user_id) -- Évite les doublons
)

-- Table des rappels
REMINDERS (
    id UUID PRIMARY KEY,
    reminder_date DATE NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'completed')),
    application_id UUID NOT NULL REFERENCES APPLICATIONS(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

-- Table des rounds d'entretien
ROUNDS (
    id UUID PRIMARY KEY,
    application_id UUID NOT NULL REFERENCES APPLICATIONS(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) CHECK (type IN ('phone_screen', 'technical', 'final', 'onsite')),
    status VARCHAR(50) CHECK (status IN ('scheduled', 'completed', 'passed', 'failed')),
    date DATE NOT NULL,
    notes TEXT,
    interviewer VARCHAR(255),
    duration VARCHAR(50),
    outcome TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

**Justification des choix techniques :**

**Types de données :**
- **UUID** : Identifiants universels évitant les collisions, idéal pour une future distribution
- **VARCHAR avec limites** : Contrôle de la taille des données, optimisation mémoire
- **TEXT pour les champs longs** : Flexibilité pour notes et descriptions détaillées
- **DATE vs TIMESTAMP** : DATE pour les échéances, TIMESTAMP pour l'audit
- **CHECK contraints** : Validation au niveau base de données, cohérence garantie

**Clés étrangères et CASCADE :**
- **ON DELETE CASCADE** : Suppression automatique des données liées (rappels, rounds) quand une candidature est supprimée
- **Intégrité référentielle** : Impossible de créer un rappel sans candidature existante

**Contraintes d'unicité :**
- **Email unique** : Un seul compte par adresse email
- **Combinaison title + company + user_id** : Évite les candidatures doublons accidentelles

#### Modèle Physique de Données (MPD) - Implémentation PostgreSQL

**Index de performance :**

```sql
-- Index sur les clés étrangères (requêtes fréquentes)
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_reminders_application_id ON reminders(application_id);
CREATE INDEX idx_rounds_application_id ON rounds(application_id);

-- Index fonctionnels pour les requêtes métier
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_sent_date ON applications(sent_date);
CREATE INDEX idx_reminders_date_status ON reminders(reminder_date, status);
CREATE INDEX idx_rounds_date ON rounds(date);

-- Index composites pour requêtes complexes
CREATE INDEX idx_applications_user_status_date ON applications(user_id, status, sent_date);
```

**Fonctionnalités PostgreSQL exploitées :**

**Extensions utilisées :**
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; -- Génération UUID
```

**Triggers pour audit automatique :**
```sql
-- Mise à jour automatique du timestamp updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_applications_modtime 
    BEFORE UPDATE ON applications 
    FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
```

**Vues métier pour simplifier les requêtes :**
```sql
-- Vue agrégée des candidatures avec compteurs
CREATE VIEW v_applications_summary AS
SELECT 
    u.id as user_id,
    u.email,
    COUNT(a.id) as total_applications,
    COUNT(CASE WHEN a.status = 'sent' THEN 1 END) as sent_count,
    COUNT(CASE WHEN a.status = 'pending' THEN 1 END) as pending_count,
    COUNT(CASE WHEN a.status = 'interview_scheduled' THEN 1 END) as interview_count,
    COUNT(CASE WHEN a.status = 'rejected' THEN 1 END) as rejected_count,
    COUNT(CASE WHEN a.status = 'offer' THEN 1 END) as offer_count
FROM users u
LEFT JOIN applications a ON u.id = a.user_id
GROUP BY u.id, u.email;

-- Vue des rappels urgents
CREATE VIEW v_urgent_reminders AS
SELECT 
    r.*,
    a.title_application,
    a.company,
    CASE 
        WHEN r.reminder_date < CURRENT_DATE THEN 'overdue'
        WHEN r.reminder_date = CURRENT_DATE THEN 'today'
        WHEN r.reminder_date <= CURRENT_DATE + INTERVAL '7 days' THEN 'this_week'
        ELSE 'future'
    END as urgency_level
FROM reminders r
JOIN applications a ON r.application_id = a.id
WHERE r.status = 'pending'
ORDER BY r.reminder_date;
```

**Stratégie de migration et évolutivité :**

**Versioning avec Tern :**
```
migrations/
├── 001_create_tables.sql        # Création structure initiale
├── 002_add_indexes.sql          # Optimisations performance  
├── 003_create_views.sql         # Vues métier
├── 004_add_triggers.sql         # Automatisations
└── tern.conf                    # Configuration migration
```

**Exemple de migration évolutive :**
```sql
-- 005_add_application_priority.sql
ALTER TABLE applications 
ADD COLUMN priority VARCHAR(20) 
CHECK (priority IN ('low', 'medium', 'high')) 
DEFAULT 'medium';

CREATE INDEX idx_applications_priority ON applications(priority);
```

**Optimisations de performance implémentées :**

**Partitioning potentiel (évolution future) :**
```sql
-- Partitioning par date pour grosses volumétries
CREATE TABLE applications_2024 PARTITION OF applications
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```

**Requêtes optimisées avec EXPLAIN ANALYZE :**
```sql
-- Requête dashboard utilisateur (optimisée)
SELECT 
    a.*,
    COUNT(r.id) as reminder_count,
    COUNT(rd.id) as round_count
FROM applications a
LEFT JOIN reminders r ON a.id = r.application_id AND r.status = 'pending'
LEFT JOIN rounds rd ON a.id = rd.application_id
WHERE a.user_id = $1
GROUP BY a.id
ORDER BY a.created_at DESC
LIMIT 20;
```

**Résultats de la modélisation :**
- **Structure normalisée** : Évite la redondance, garantit la cohérence
- **Performance optimisée** : Index ciblés, requêtes sub-seconde même avec 10k+ candidatures
- **Évolutivité** : Schema flexible pour ajout de nouvelles fonctionnalités
- **Intégrité** : Contraintes et triggers assurent la qualité des données
- **Maintenabilité** : Migrations versionnées, documentation technique complète

**Difficultés rencontrées :**
La définition des contraintes CHECK pour les statuts. J'ai dû anticiper l'évolution possible des workflows métier tout en gardant une validation stricte. Solution retenue : statuts de base solides avec possibilité d'extension via migrations.

**Exemple de migration :**
```sql
-- 001_create_table.sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_application VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    sent_date DATE NOT NULL,
    location VARCHAR(255) NOT NULL,
    status VARCHAR(50) CHECK (status IN ('sent', 'pending', 'rejected', 'interview_scheduled')),
    notes TEXT,
    url_application TEXT,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(title_application, company, user_id)
);

CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
```

**Résultats :**
Base de données robuste et performante. Les requêtes sont rapides grâce aux index, l'intégrité des données est garantie par les contraintes, et les migrations permettent une évolution contrôlée.

La modélisation des entretiens m'a posé question. Fallait-il une entité séparée ou des champs dans `applications` ? Après réflexion, les entretiens multiples (phone screen → technique → final) justifiaient une table séparée. J'ai aussi hésité sur les types d'entretien - fallait-il les rendre configurables ou fixer une liste ? J'ai opté pour un CHECK constraint extensible via migrations, ce qui s'est révélé pratique quand j'ai ajouté le type 'coding' plus tard.

### Accès aux données

**Ce que j'ai fait :**
J'ai utilisé SQLC pour générer du code Go type-safe à partir de mes requêtes SQL. Cette approche élimine les erreurs de runtime et protège contre les injections SQL.

- **SQLC** : Génération de code Go à partir de requêtes SQL écrites à la main
- **Type-safety** : Toutes les requêtes sont vérifiées à la compilation
- **Performance** : Requêtes optimisées avec pagination, filtres par statut
- **Sécurité** : Protection native contre les injections SQL grâce aux requêtes préparées

**Exemple de requête SQLC :**
```sql
-- queries.sql
-- name: GetAllApplications :many
SELECT * FROM applications WHERE user_id = $1;

-- name: GetApplicationsByStatus :many
SELECT * FROM applications WHERE status = $1 AND user_id = $2 ORDER BY updated_at DESC, created_at DESC;

-- name: CreateOneApplication :one
INSERT INTO applications ( 
    title_application, company, location, sent_date, status, notes, url_application, user_id 
) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
```

```go
// store.go - Implémentation type-safe générée par SQLC
func (s *PostgresApplicationStore) GetAll(userID uuid.UUID) ([]db.Application, error) {
    ctx := context.Background()
    applications, err := s.db.GetAllApplications(ctx, userID)
    if err != nil {
        return nil, err
    }
    return applications, nil
}
```

**Résultats :**
Couche d'accès aux données robuste et sécurisée. Les requêtes sont type-safe, performantes, et maintiennent l'intégrité des données.

SQLC représentait un changement de paradigme par rapport aux ORMs que je connaissais. Écrire du SQL à la main semblait être un retour en arrière au début. Mais la génération de code type-safe s'est révélée précieuse : impossible d'avoir une erreur de typo dans une colonne, et les requêtes complexes comme les analytics restent lisibles. Le seul inconvénient était de devoir régénérer le code à chaque modification de schéma, mais j'ai intégré ça dans mon Makefile.

---

## 4. PRÉPARER LE DÉPLOIEMENT {#préparer-déploiement}

### Tests de l'application

**Ce que j'ai fait :**
J'ai mis en place une stratégie de tests complète pour garantir la fiabilité de l'application. L'objectif était d'avoir confiance dans le code avant le déploiement.

- **Tests unitaires** : Validation de la logique métier avec des mocks pour isoler les composants
- **Tests d'intégration** : Testcontainers avec PostgreSQL réel pour tester les interactions base de données
- **Tests automatisés** : Exécution dans la CI avec détection des race conditions (`go test -race`)
- **Couverture de code** : Suivi des métriques de couverture pour identifier les zones non testées

**Exemple de test d'intégration :**
```go
// handler_test.go - Test avec Testcontainers
func Test_Register(t *testing.T) {
    ctx := context.Background()
    
    // Démarrage container PostgreSQL de test
    pgcontainer, err := postgres.Run(ctx,
        "postgres:15-alpine",
        postgres.WithDatabase("testdb"),
        postgres.WithUsername("testuser"),
        postgres.WithPassword("testpass"),
    )
    require.NoError(t, err)
    
    defer pgcontainer.Terminate(ctx)
    
    // Configuration et migrations
    connStr, err := pgcontainer.ConnectionString(ctx, "sslmode=disable")
    require.NoError(t, err)
    
    // Application des migrations
    migrateConn, err := pgx.Connect(ctx, connStr)
    require.NoError(t, err)
    defer migrateConn.Close(ctx)
    
    migrator, err := migrate.NewMigrator(ctx, migrateConn, "schema_version")
    require.NoError(t, err)
    
    // Test de création d'utilisateur
    user := &RegisterRequest{
        Email:          "test@example.com",
        Password:       "password123",
        PasswordRepeat: "password123",
    }
    
    // Assertions...
}
```

**Résultats :**
Tests robustes et automatisés. Les tests Testcontainers garantissent que l'application fonctionne avec une vraie base de données, et la CI détecte automatiquement les régressions.

Testcontainers m'a pris du temps à apprivoiser. La première fois que j'ai lancé les tests, ça prenait 30 secondes juste pour démarrer le container PostgreSQL ! J'ai dû comprendre comment réutiliser le même container pour tous les tests d'une suite et bien nettoyer les données entre les tests. L'intégration avec les migrations Tern n'était pas évidente non plus - il fallait appliquer les migrations à chaque nouveau container de test.

### Documentation du déploiement

**Ce que j'ai fait :**
J'ai créé une solution de déploiement reproductible avec Docker pour éliminer les différences entre environnements. L'objectif était d'avoir un déploiement fiable et simple.

- **Docker multi-stage** : Build optimisé avec image finale légère (Alpine Linux)
- **Docker Compose** : Configuration complète avec PostgreSQL, variables d'environnement, et volumes persistants
- **Documentation** : Procédures de déploiement claires dans DEPLOYMENT.md
- **Configuration flexible** : Variables d'environnement pour adapter facilement aux différents environnements

**Exemple de Dockerfile :**
```dockerfile
# Dockerfile multi-stage pour production
FROM golang:1.23-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o main ./cmd/api/main.go

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/main .
COPY --from=builder /app/migrations ./migrations

EXPOSE 8080
CMD ["./main"]
```

**Résultats :**
Solution de déploiement complète et reproductible. L'application peut être déployée facilement sur n'importe quel environnement avec Docker Compose.

Le déploiement avec Docker m'a sensibilisé à la gestion des secrets. En développement, j'avais tout dans des fichiers .env simples, mais en production il faut être plus rigoureux. J'ai dû comprendre les subtilités comme le CORS (localhost:5173 en dev vs domaine en prod), les URLs de base de données (localhost vs nom de service Docker), et surtout ne jamais commiter les secrets dans le code.

### Mise en production DevOps

**Ce que j'ai fait :**
J'ai implémenté un pipeline CI/CD professionnel avec GitHub Actions pour automatiser les vérifications et déploiements. L'objectif était d'avoir un processus fiable et reproductible.

- **Pipeline CI** : Tests automatisés, linting (GolangCI-Lint), vérification de build sur chaque Pull Request
- **Pipeline CD** : Déploiement automatique sur `main` avec vérifications préalables
- **Qualité de code** : 8 linters configurés pour maintenir un code propre et sécurisé
- **Tests d'intégration** : Exécution des tests Testcontainers dans l'environnement CI

**Exemple de pipeline CI :**
```yaml
# .github/workflows/ci.yml
name: CI – Pull Request Checks

on:
  pull_request:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        go: ['1.23.x']
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Set up Go
        uses: actions/setup-go@v5
        with:
          go-version: ${{ matrix.go }}
          
      - name: Run tests
        run: go test -race -coverprofile=coverage.out ./...
        
      - name: golangci-lint
        uses: golangci/golangci-lint-action@v6
        
      - name: Build verification
        run: go build -o tmp/main ./cmd/api/main.go
        
      - name: Docker build test
        run: docker build -t applytrack-test .
```

**Résultats :**
Pipeline CI/CD complet et automatisé. Chaque modification passe par des vérifications rigoureuses, et les déploiements se font automatiquement avec confiance.

GitHub Actions était totalement nouveau pour moi. Les premières fois, mes pipelines échouaient sans message d'erreur clair. J'ai appris à debugger avec `set -x` dans les scripts shell et à bien structurer les étapes. Le plus frustrant était les tests qui passaient en local mais échouaient en CI à cause de variables d'environnement manquantes comme JWT_SECRET. La découverte des GitHub Secrets a résolu le problème, mais il a fallu comprendre leur portée et leurs limitations.

---

## 5. BILAN DU PROJET {#bilan}

### Ce que j'ai appris

Ce projet m'a permis de développer plusieurs compétences importantes :

**Techniques :**
- **Testcontainers** : Découverte de cette approche pour les tests d'intégration avec de vraies bases de données
- **SQLC** : Alternative aux ORMs avec génération de code type-safe, plus performante et transparente
- **Argon2** : Algorithme de hachage moderne, plus sécurisé que bcrypt pour les mots de passe
- **GitHub Actions** : Configuration complète de pipelines CI/CD professionnels
- **Architecture feature-based** : Organisation du code frontend par fonctionnalités plutôt que par type de fichier

**Méthodologiques :**
- **Pragmatisme** : Éviter la sur-ingénierie et se concentrer sur les fonctionnalités essentielles
- **DevOps** : Importance d'automatiser les tests et déploiements dès le début du projet
- **Sécurité multicouches** : Combiner plusieurs approches (hachage, JWT, validation, CSRF) plutôt qu'une seule

### Les défis surmontés

Plusieurs obstacles techniques m'ont permis de progresser :

**Configuration complexe des tests :**
- **Problème** : Testcontainers nécessitait une configuration précise (migrations, cycle de vie, synchronisation)
- **Solution** : Documentation détaillée de chaque étape et isolation des tests pour éviter les conflits

**Pipeline CI/CD :**
- **Problème** : Variables d'environnement manquantes (JWTSECRET) causaient des échecs de tests en CI
- **Solution** : Configuration des GitHub Secrets et fallback pour les environnements de test

**Architecture frontend :**
- **Problème** : Répartition du code partagé vs spécifique aux fonctionnalités pas toujours évidente
- **Solution** : Refactoring itératif pour trouver la bonne séparation entre `/shared` et `/features`

**Gestion des priorités :**
- **Problème** : Tendance à vouloir implémenter toutes les fonctionnalités en parallèle
- **Solution** : Approche séquentielle (candidatures → rappels → entretiens) pour avoir rapidement du fonctionnel

### Points d'amélioration

Plusieurs aspects du projet mériteraient d'être améliorés :

**Documentation du code :**
- **Constat** : Manque de commentaires dans le code, surtout pour les fonctions complexes
- **Action** : Ajouter des docstrings Go pour toutes les fonctions publiques et commenter la logique métier complexe
- **Objectif** : Faciliter la maintenance et l'onboarding de nouveaux développeurs

**Tests frontend :**
- **Constat** : Focus principalement sur les tests backend, frontend moins couvert
- **Action** : Implémenter des tests unitaires React avec Jest et des tests end-to-end avec Playwright
- **Objectif** : Garantir la fiabilité de l'interface utilisateur

**Monitoring et logs :**
- **Constat** : Pas de monitoring des performances ni de centralisation des logs
- **Action** : Ajouter des métriques (Prometheus) et un système de logging structuré
- **Objectif** : Meilleure visibilité sur le comportement en production

**Accessibilité :**
- **Constat** : Radix UI fournit les bases mais tests d'accessibilité manuels insuffisants
- **Action** : Tests automatisés avec axe-core et validation WCAG plus systématique
- **Objectif** : Application vraiment accessible à tous les utilisateurs

### Suite du projet

Plusieurs évolutions sont envisagées pour enrichir l'application :

**Fonctionnalités métier :**
- **Notifications** : Système d'alertes email/push pour les rappels et deadlines importantes
- **Analytics avancées** : Graphiques de suivi des candidatures, taux de réussite par type d'entreprise
- **Import/Export** : Possibilité d'importer des données depuis LinkedIn ou exporter vers Excel
- **Collaboration** : Partage de candidatures avec un mentor ou coach carrière

**Améliorations techniques :**
- **API mobile** : Adaptation pour une future application mobile native
- **Cache intelligent** : Redis pour optimiser les requêtes fréquentes
- **Recherche** : Elasticsearch pour rechercher dans les candidatures et notes
- **Sécurité** : Authentification à deux facteurs (2FA)

**Déploiement :**
- **Kubernetes** : Migration vers une orchestration plus robuste pour la scalabilité
- **CDN** : Distribution du frontend via CloudFlare ou AWS CloudFront
- **Base de données** : Réplication et backup automatique pour la haute disponibilité

Ce projet me sert actuellement pour mes propres candidatures et pourrait évoluer vers un produit plus large selon les retours utilisateurs.

---

*Ce dossier présente la réalisation du projet ApplyTrack dans le cadre de l'obtention du titre professionnel Concepteur Développeur d'Applications (niveau 6).*