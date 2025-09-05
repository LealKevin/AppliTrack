# Présentation Orale CDA - ApplyTrack
## Soutenance de 40 minutes

---

## Slide 1 : Page de titre
**ApplyTrack - Application de suivi des candidatures**
*Projet de fin de formation CDA - Niveau 6*

**Kevin Dubois**  
**Date de soutenance : [À compléter]**

---

## Slide 2 : Plan de la présentation
1. **Contexte et problématique** (5 min)
2. **Architecture et conception** (8 min)
3. **Implémentation technique** (12 min)
4. **Sécurisation de l'application** (7 min)
5. **Tests et déploiement** (5 min)
6. **Bilan et perspectives** (3 min)

---

## Slide 3 : Contexte du projet
### Problématique
- Recherche d'emploi = processus complexe et désorganisé
- Multiples candidatures à suivre simultanément
- Outils existants : trop complexes ou insuffisants
- Besoin d'une solution simple et efficace

### Objectifs
- Centraliser le suivi des candidatures
- Organiser les entretiens et rappels
- Analyser les performances de recherche
- Interface intuitive et responsive

---

## Slide 4 : Cahier des charges fonctionnel
### Fonctionnalités principales
- ✅ **CRUD candidatures** : Créer, lire, modifier, supprimer
- ✅ **Import/Export CSV** : Import en masse + export des données
- ✅ **Gestion des rounds d'entretien** : Suivi détaillé des étapes
- ✅ **Système de rappels** : Notifications de relance
- ✅ **Analytics** : Tableaux de bord et statistiques
- ✅ **Authentification sécurisée** : JWT + Argon2

### Contraintes techniques
- Application web moderne (SPA)
- Responsive design (mobile-first)
- API REST sécurisée
- Base de données relationnelle

---

## Slide 5 : Architecture générale
### Stack technique choisie
**Backend :**
- Go + Echo framework
- PostgreSQL + SQLC
- JWT pour l'authentification
- Docker pour la containerisation

**Frontend :**
- React 19 + TypeScript
- TanStack Query (React Query)
- Radix UI + Tailwind CSS
- Vite comme bundler

**DevOps :**
- GitHub Actions (CI/CD)
- Docker + Docker Compose
- Déploiement DigitalOcean

---

## Slide 6 : Architecture 3-couches
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     HANDLER     │    │     SERVICE     │    │      STORE      │
│  (Couche Web)   │───▶│ (Logique Métier)│───▶│ (Accès Données) │
│                 │    │                 │    │                 │
│ • Validation    │    │ • Business      │    │ • Requêtes SQL  │
│ • Sérialisation│    │   Logic         │    │ • SQLC          │
│ • HTTP          │    │ • Orchestration │    │ • PostgreSQL    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Avantages de cette approche
- Séparation claire des responsabilités
- Testabilité (mocks par couche)
- Maintenabilité et évolutivité
- Injection de dépendances

---

## Slide 7 : Modélisation de la base de données
### MCD - Entités principales
```
UTILISATEUR ──(1,N)── CANDIDATURE ──(1,N)── RAPPEL
                          │
                       (1,N)
                          │
                        ROUND
```

### Choix techniques
- **UUID** comme identifiants (évite les collisions)
- **Contraintes CHECK** (validation au niveau DB)
- **Triggers** pour les timestamps automatiques
- **Migrations Tern** pour l'évolution du schéma

---

## Slide 8 : SQLC - De la query SQL au code Go
### Étape 1 : Écriture de la requête SQL
```sql
-- internal/db/queries/queries.sql
-- name: GetAllApplications :many
SELECT * FROM applications WHERE user_id = $1;

-- name: CreateOneApplication :one
INSERT INTO applications ( 
    title_application, company, location, sent_date, 
    status, notes, url_application, user_id 
) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
```

### Étape 2 : Génération automatique du code Go
```bash
# Commande de génération
sqlc generate
```

### Étape 3 : Code Go généré (type-safe)
```go
// Code généré automatiquement
func (q *Queries) GetAllApplications(ctx context.Context, userID uuid.UUID) ([]Application, error) {
    const getAllApplications = `SELECT * FROM applications WHERE user_id = $1`
    
    rows, err := q.db.Query(ctx, getAllApplications, userID)
    // Mapping automatique vers struct Go
}
```

---

## Slide 9 : SQLC - Utilisation dans le Store
### Store avec SQLC intégré
```go
// internal/application/store.go
type ApplicationStorage struct {
    queries *db.Queries
}

func (s *ApplicationStorage) GetAll(userID uuid.UUID) ([]db.Application, error) {
    ctx := context.Background()
    
    // Appel de la fonction générée par SQLC
    applications, err := s.queries.GetAllApplications(ctx, userID)
    if err != nil {
        return nil, fmt.Errorf("failed to get applications: %w", err)
    }
    return applications, nil
}

func (s *ApplicationStorage) CreateOne(params db.CreateOneApplicationParams) (db.Application, error) {
    ctx := context.Background()
    
    // Protection automatique contre injection SQL
    app, err := s.queries.CreateOneApplication(ctx, params)
    if err != nil {
        return db.Application{}, fmt.Errorf("failed to create application: %w", err)
    }
    return app, nil
}
```

### Avantages de SQLC
- **Type safety** : Erreurs à la compilation, pas au runtime
- **Performance** : Requêtes préparées automatiques
- **Sécurité** : Protection injection SQL native
- **Maintenabilité** : SQL lisible, Go généré

---

## Slide 10 : Sécurisation - Validation multicouche
### Validation Frontend avec Zod
```typescript
// Validation côté client avec types TypeScript
export const createApplicationSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long").max(255, "Title is too long"),
  company: z.string().min(2, "Company name must be at least 2 characters long").max(255, "Company name is too long"),
  status: z.enum(["sent", "pending", "rejected", "interview_scheduled"]),
  url_application: z.string().url("Please enter a valid URL").optional()
});
```

### Validation Backend avec go-playground/validator
```go
// Validation côté serveur avec tags struct
type CreateApplicationRequest struct {
    TitleApplication string    `json:"title" validate:"required,min=3"`
    Company          string    `json:"company" validate:"required,min=2"`
    Status           *string   `json:"status" validate:"required,oneof=sent pending rejected interview_scheduled"`
    UrlApplication   *string   `json:"url_application" validate:"omitempty,url"`
}
```

---

## Slide 11 : Sécurisation - Authentification & Sessions
### Hashage Argon2 + JWT sécurisé
```go
// Argon2 : résistant aux attaques GPU
Memory: 64 * 1024, Iterations: 3, Parallelism: 2

// JWT dans cookies HTTPOnly (anti-XSS)
cookie := &http.Cookie{
    Name:     "auth_token",
    Value:    tokenString,
    HttpOnly: true,           // Pas accessible via JavaScript
    Secure:   true,           // HTTPS uniquement
    SameSite: http.SameSiteStrictMode, // Protection CSRF
    MaxAge:   24 * 60 * 60,   // 24h
}
```

### Rate Limiting custom
- **5 tentatives de connexion max / 15 minutes par IP**
- **Cleanup automatique** en goroutine pour éviter les fuites mémoire
- **Concurrent-safe** avec sync.RWMutex

---

## Slide 12 : Sécurisation - CORS & CSRF & Headers
### Configuration CORS restrictive
```go
// CORS configuré via variables d'environnement
allowedOrigins := []string{"http://localhost:5173"} // dev
if originsEnv := os.Getenv("CORS_ALLOWED_ORIGINS"); originsEnv != "" {
    allowedOrigins = strings.Split(originsEnv, ",") // prod
}

s.echo.Use(middleware.CORSWithConfig(middleware.CORSConfig{
    AllowOrigins:     allowedOrigins,
    AllowCredentials: true,  // Cookies autorisés
    AllowHeaders:     []string{"X-CSRF-Token"}, // Token CSRF requis
}))
```

### Protection CSRF
```go
s.echo.Use(middleware.CSRFWithConfig(middleware.CSRFConfig{
    TokenLookup:    "header:X-CSRF-Token",    // Token dans header
    CookiePath:     "/",
    CookieHTTPOnly: true,                     // Cookie sécurisé
    CookieSameSite: http.SameSiteStrictMode,  // Strict same-site
}))
```

### Headers de sécurité HTTP
- **CSP** : Content Security Policy restrictive
- **HSTS** : Force HTTPS en production
- **X-Frame-Options: DENY** : Anti-clickjacking
- **X-Content-Type-Options: nosniff** : Empêche MIME sniffing

---

## Slide 13 : Frontend - Architecture React moderne
### Structure feature-based
```
frontend/applitrack/src/
├── features/
│   ├── applications/
│   │   ├── components/     // Composants spécialisés
│   │   ├── hooks/         // Logic métier (useApplications)
│   │   └── types/         // Types TypeScript
│   ├── auth/
│   └── analytics/
├── shared/
│   ├── components/ui/     // Design System (Radix UI)
│   ├── hooks/            // Hooks réutilisables
│   ├── utils/            // Utilitaires
│   └── validation/       // Schémas Zod
```

### Avantages de cette approche
- **Scalabilité** : Ajout de features sans impact
- **Réutilisabilité** : Shared components + hooks
- **Maintenabilité** : Logique isolée par domaine

---

## Slide 14 : Frontend - TanStack Query & State Management
### Gestion d'état serveur intelligente
```typescript
// Hook personnalisé avec cache et invalidation
export default function useApplications() {
  return useQuery({
    queryKey: ["applications"],
    queryFn: () => getApplications(),
    staleTime: 5 * 60 * 1000,     // Cache 5 minutes
    refetchOnWindowFocus: true,    // Refetch on tab focus
  });
}

// Hook pour création avec optimistic updates
export default function useCreateApplication() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (app: IApplication) => createApplication(app),
    onSuccess: () => {
      // Invalidation automatique du cache
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["appsCount"] });
    },
  });
}
```

### Pattern de hooks personnalisés
- **Encapsulation** : Logique métier dans les hooks
- **Réutilisabilité** : Même logic partout dans l'app
- **Type safety** : TypeScript + React Query

---

## Slide 15 : Frontend - Design System & UI Components
### Stack UI moderne
```typescript
// Composant réutilisable avec Radix UI + Tailwind
const StatusBadge = ({ status }: { status: ApplicationStatus }) => {
  const statusConfig = {
    sent: { 
      label: "Sent", 
      className: "bg-blue-100 text-blue-800 dark:bg-blue-900/20" 
    },
    rejected: { 
      label: "Rejected", 
      className: "bg-red-100 text-red-800 dark:bg-red-900/20" 
    },
    // ...
  };

  return (
    <Badge variant="outline" className={statusConfig[status].className}>
      {statusConfig[status].label}
    </Badge>
  );
};
```

### Choix techniques justifiés
- **Radix UI** : Accessibilité native, headless components
- **Tailwind CSS** : Utility-first, design system cohérent
- **TypeScript strict** : Props typées, erreurs à la compilation
- **Dark mode** : CSS variables + class switching

---

## Slide 16 : Fonctionnalités avancées
### Import CSV intelligent
- **Parsing robuste** avec validation ligne par ligne
- **Gestion d'erreurs détaillée** (ligne + raison)
- **Rapport d'import** : succès/échecs
- **Interface de résultats** en temps réel

### Analytics et statistiques
- **Métriques temps réel** : taux de succès, tendances
- **Graphiques interactifs** avec données live
- **Export des données** pour analyse externe

---

## Slide 17 : Tests - Pyramide de tests complète

### Tests unitaires (logique métier isolée)
```go
// Test de service avec mock store - rapide et fiable
func TestImportApplicationsFromCSV(t *testing.T) {
    mockStore := new(MockStore)
    mockStore.On("CreateOne", mock.Any()).Return(app, nil)
    
    service := NewService(mockStore)
    result, err := service.ImportApplicationsFromCSV(userID, csvData)
    
    assert.Equal(t, 1, result.SuccessCount)
    mockStore.AssertExpectations(t) // Vérifie les interactions
}
```

### Tests d'intégration avec Testcontainers
```go
// Test E2E complet avec vraie base PostgreSQL
func Test_Register(t *testing.T) {
    // Conteneur PostgreSQL éphémère
    pgcontainer, err := postgres.Run(ctx, "postgres:15-alpine",
        postgres.WithDatabase("testdb"))
    defer pgcontainer.Terminate(ctx)
    
    // Migrations automatiques + test complet
    migrator.Migrate(ctx)
    handler := setupRealHandler(dbConn)
    
    // Test avec vraie DB, vraies requêtes SQL
    err = handler.Register(c)
    assert.Equal(t, http.StatusCreated, rec.Code)
}
```

### Avantages de cette approche
- **Tests unitaires** : Feedback rapide (ms), logique pure
- **Tests E2E** : Confiance production, vraies interactions DB
- **CI/CD friendly** : Testcontainers s'exécute partout

---

## Slide 18 : CI/CD - DevOps automatisé
### Pipeline GitHub Actions
```yaml
# Étapes du pipeline CI
- Tests avec détection race conditions
- Linting avec golangci-lint
- Vérification build + Docker
- Coverage reporting
- Déploiement automatique sur main
```

### Déploiement DigitalOcean
- **SSH automatisé** vers serveur production
- **Docker Compose** pour orchestration
- **Vérification santé** post-déploiement
- **Rollback** en cas d'échec

---

## Slide 19 : Démonstration live
### Parcours utilisateur complet
1. **Inscription/Connexion** sécurisée
2. **Création candidature** avec validation
3. **Import CSV** avec gestion d'erreurs
4. **Gestion rounds d'entretien** 
5. **Analytics** temps réel
6. **Interface responsive** mobile

*[Prévoir 5-7 minutes de démo live]*

---

## Slide 20 : Défis techniques surmontés
### Principaux challenges
- **Gestion d'état complexe** : Cache TanStack Query vs state local
- **Architecture scalable** : 3-couches avec injection dépendances  
- **Sécurité multicouche** : De Argon2 aux headers HTTP
- **Tests d'intégration** : Testcontainers + migrations
- **Performance** : Optimisation requêtes + cache

### Solutions apportées
- Pattern de hooks React personnalisés
- SQLC pour queries type-safe
- Middleware chain sécurisé
- Pipeline CI/CD complet

---

## Slide 21 : Métriques du projet
### Statistiques techniques
- **Lignes de code** : ~8000 (Go) + ~6000 (React/TS)
- **Fichiers** : 45+ fichiers sources
- **Tests** : 25+ tests unitaires + intégration
- **Coverage** : 75%+ sur la logique métier
- **Performance** : <200ms temps réponse API

### Architecture finale
- **4 entités** principales (User, Application, Reminder, Round)  
- **20+ endpoints** API REST documentés
- **8 middlewares** sécurité
- **12 migrations** de base de données
- **3 environnements** (dev, test, prod)

---

## Slide 22 : Retours d'expérience
### Ce que j'ai appris
- **Go + SQLC** : Puissance du typage fort + performance
- **TanStack Query** : Révolution dans la gestion d'état React
- **Testcontainers** : Tests d'intégration proches de la réalité  
- **Argon2** : Sécurité moderne des mots de passe
- **Architecture 3-couches** : Importance de la séparation

### Difficultés surmontées
- **Gestion concurrence** : Race conditions dans tests
- **Configuration sécurité** : Équilibre protection/usabilité
- **Performance frontend** : Optimisation re-renders React
- **Pipeline CI** : Variables environnement + secrets

---

## Slide 23 : Perspectives d'évolution
### Améliorations à court terme
- **Tests E2E** avec Playwright pour validation complète
- **Monitoring** : Logs structurés + métriques Prometheus
- **Performance** : Cache Redis pour requêtes fréquentes
- **Accessibilité** : Validation WCAG 2.1 complète

### Évolutions fonctionnelles
- **Notifications push** : Rappels par email/SMS
- **API mobile** : Application native iOS/Android
- **Collaboration** : Partage candidatures entre utilisateurs
- **IA** : Analyse automatique d'offres d'emploi

### Évolutions techniques
- **Microservices** : Découpage en services spécialisés
- **Kubernetes** : Orchestration container production
- **GraphQL** : API plus flexible pour le frontend

---

## Slide 24 : Conclusion
### Objectifs atteints ✅
- **Application fonctionnelle** déployée en production
- **Architecture solide** et maintenable
- **Sécurité multicouche** robuste
- **Tests automatisés** et CI/CD
- **Solution complète** full-stack

### Valeur ajoutée personnelle
- **Utilisation quotidienne** : ApplyTrack pour ma propre recherche
- **Code source disponible** : Démonstration concrète compétences
- **Projet évolutif** : Base solide pour futures améliorations
- **Expérience complète** : Full-stack + DevOps

### Remerciements
Merci au jury pour son attention et ses questions ! 🚀

---

## Notes pour la présentation orale :

### Timing suggéré :
- **Slides 1-4** : 5 min (contexte)
- **Slides 5-9** : 6 min (architecture + SQLC)  
- **Slides 10-12** : 8 min (sécurisation complète)
- **Slides 13-18** : 8 min (frontend + fonctionnalités + CI/CD)
- **Slide 19** : 7 min (démo live)
- **Slides 20-22** : 4 min (bilan)
- **Slides 23-24** : 2 min (conclusion)

### Points d'attention :
- **Démo préparée** : Scénario testé, données de démo prêtes
- **Code à portée** : GitHub ouvert pour questions techniques
- **Architecture claire** : Schémas visuels pour expliquer
- **SQLC détaillé** : Montrer la génération de code en live
- **Passion du projet** : Montrer l'engagement personnel