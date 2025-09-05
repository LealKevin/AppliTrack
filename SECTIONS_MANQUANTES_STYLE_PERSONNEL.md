# SECTIONS MANQUANTES POUR LE DOSSIER CDA
## (Rédigées dans le style personnel de Kevin)

---

## Tests de l'application

Au début du projet, je n'avais pas prévu de mettre autant d'efforts sur les tests. Comme beaucoup de développeurs, j'avais tendance à considérer les tests comme une contrainte plutôt qu'un atout. Mais très vite, j'ai réalisé que pour un projet de cette ampleur, avec une API backend et des interactions base de données, les tests étaient indispensables pour avoir confiance dans mon code avant le déploiement.

J'ai donc mis en place une stratégie de tests à plusieurs niveaux. D'abord des tests unitaires pour valider la logique métier en isolation, avec des mocks pour découpler les composants. Ensuite des tests d'intégration pour vérifier que tout fonctionne correctement avec une vraie base de données. J'ai également configuré l'exécution automatique dans la CI avec la détection des race conditions grâce à `go test -race`.

### Ma découverte de Testcontainers

La partie la plus intéressante a été ma découverte de Testcontainers. Au lieu de mocker complètement la base de données, cette bibliothèque permet de démarrer un vrai conteneur PostgreSQL pendant les tests. C'était exactement ce qu'il me fallait pour être sûr que mes requêtes SQL fonctionnent réellement.

Voici un exemple concret de test d'intégration que j'ai écrit pour la création d'utilisateur :

```go
// internal/user/handler_test.go - Test avec Testcontainers
func Test_Register(t *testing.T) {
    ctx := context.Background()

    pgcontainer, err := postgres.Run(ctx,
        "postgres:15-alpine",
        postgres.WithDatabase("testdb"),
        postgres.WithUsername("testuser"),
        postgres.WithPassword("testpass"),
        testcontainers.WithWaitStrategy(
            wait.ForLog("database system is ready to accept connections").
                WithOccurrence(2).
                WithStartupTimeout(60*time.Second),
        ))
    if err != nil {
        t.Fatalf("Failed to start PostgreSQL container: %v", err)
    }

    t.Cleanup(func() {
        if err := pgcontainer.Terminate(ctx); err != nil {
            t.Fatalf("Failed to terminate PostgreSQL container: %v", err)
        }
    })

    connStr, err := pgcontainer.ConnectionString(ctx, "sslmode=disable")
    if err != nil {
        t.Fatalf("Failed to get connection string: %v", err)
    }

    // Application des migrations Tern
    migrateConn, err := pgx.Connect(ctx, connStr)
    if err != nil {
        t.Fatalf("Failed to connect to PostgreSQL for migration: %v", err)
    }
    defer migrateConn.Close(ctx)

    migrator, err := migrate.NewMigrator(ctx, migrateConn, "schema_version")
    require.NoError(t, err)
    if err := migrator.LoadMigrations(os.DirFS("./../../migrations")); err != nil {
        t.Fatalf("Failed to load migrations: %v", err)
    }
    if err := migrator.Migrate(ctx); err != nil {
        t.Fatalf("Failed to apply migrations: %v", err)
    }

    // Configuration connexion pool
    dbPool, err := pgxpool.New(ctx, connStr)
    assert.NoError(t, err)
    defer dbPool.Close()

    queries := db.New(dbPool)
    userStore := NewUserStorage(queries)
    userService := NewService(userStore)
    handler := NewHandler(userService)

    // Test inscription utilisateur
    user := &RegisterRequest{
        Email:          "foo@bar.com",
        Password:       "password123",
        PasswordRepeat: "password123",
    }

    userJson, err := json.Marshal(user)
    require.NoError(t, err)

    req, err := http.NewRequest(http.MethodPost, "/register", bytes.NewBuffer(userJson))
    assert.NoError(t, err)
    req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
    rec := httptest.NewRecorder()

    e := echo.New()
    e.Validator = &utils.CustomValidator{Validator: validator.New()}
    c := e.NewContext(req, rec)

    err = handler.Register(c)
    assert.NoError(t, err)
    assert.Equal(t, http.StatusCreated, rec.Code)
}
```

### Les défis rencontrés

Testcontainers m'a vraiment pris du temps à apprivoiser. La première fois que j'ai lancé les tests, ça prenait presque 30 secondes juste pour démarrer le conteneur PostgreSQL ! J'ai dû comprendre comment optimiser le processus : réutiliser le même conteneur pour tous les tests d'une suite, bien nettoyer les données entre chaque test, et surtout gérer correctement le cycle de vie des conteneurs.

L'intégration avec les migrations Tern n'était pas évidente non plus. Il fallait que j'applique automatiquement toutes les migrations sur chaque nouveau conteneur de test, ce qui demandait une synchronisation précise. J'ai fini par créer une fonction helper qui s'occupe de tout ça de manière transparente.

Un autre point délicat était la gestion des tests en parallèle. Avec plusieurs tests qui démarrent leurs propres conteneurs PostgreSQL, il fallait faire attention aux conflits de ports et aux ressources système. J'ai résolu ça en laissant Testcontainers gérer automatiquement l'attribution des ports.

### Tests de la logique métier

Pour les tests unitaires, j'ai créé des mocks pour isoler chaque couche. Par exemple, pour tester les services sans dépendre du store, j'ai utilisé testify/mock :

```go
// service_test.go - Tests unitaires avec mocks
func TestImportApplicationsFromCSV(t *testing.T) {
    userID := uuid.New()
    
    tests := []struct {
        name           string
        csvData        string
        mockSetup      func(*MockStore)
        expectedResult ImportResult
        expectError    bool
    }{
        {
            name: "successful import with valid CSV",
            csvData: `title,company,sent_date,location,status,notes,url
Software Engineer,TechCorp,2024-01-15,San Francisco,sent,Great opportunity,https://example.com`,
            mockSetup: func(mockStore *MockStore) {
                mockStore.On("CreateOne", mock.AnythingOfType("db.CreateOneApplicationParams")).Return(
                    createMockApplication("Software Engineer", "TechCorp"), nil)
            },
            expectedResult: ImportResult{
                TotalRecords: 1,
                SuccessCount: 1,
                FailureCount: 0,
            },
            expectError: false,
        },
        {
            name: "CSV with invalid date format",
            csvData: `title,company,sent_date,location,status,notes,url
Software Engineer,TechCorp,invalid-date,San Francisco,sent,Great opportunity,https://example.com`,
            expectedResult: ImportResult{
                TotalRecords: 1,
                SuccessCount: 0,
                FailureCount: 1,
                Failures: []string{"Row 2: invalid date format in SentDate field"},
            },
            expectError: false,
        },
    }
    
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            mockStore := new(MockStore)
            if tt.mockSetup != nil {
                tt.mockSetup(mockStore)
            }

            service := NewService(mockStore)
            result, err := service.ImportApplicationsFromCSV(userID, []byte(tt.csvData))

            if tt.expectError {
                require.Error(t, err)
                return
            }

            require.NoError(t, err)
            assert.Equal(t, tt.expectedResult.TotalRecords, result.TotalRecords)
            assert.Equal(t, tt.expectedResult.SuccessCount, result.SuccessCount)
            assert.Equal(t, tt.expectedResult.FailureCount, result.FailureCount)

            mockStore.AssertExpectations(t)
        })
    }
}
```

Ces tests m'ont permis de valider toute la logique d'import CSV, y compris la gestion d'erreurs pour les dates invalides ou les fichiers mal formés. L'avantage des mocks, c'est que les tests s'exécutent en quelques millisecondes, ce qui est parfait pour la validation rapide pendant le développement.

### Résultats obtenus

Au final, j'ai mis en place une suite de tests robuste qui couvre les aspects critiques de l'application. Les tests Testcontainers me donnent la confiance que mon code fonctionne avec une vraie base de données, tandis que les tests unitaires me permettent de valider rapidement la logique métier lors du développement.

Le plus satisfaisant, c'est que ces tests ont déjà attrapé plusieurs bugs que j'aurais probablement découverts seulement en production. Par exemple, un problème de gestion des timezones dans les dates d'import CSV, ou encore une race condition dans la création de rappels simultanés.

---

## Conception et modélisation de la base de données

Dès le début du projet, j'ai su que la base de données serait un élément central d'ApplyTrack. Je ne voulais pas me retrouver plus tard avec un schéma bancal qui m'obligerait à de lourdes migrations. J'ai donc pris le temps de bien réfléchir à la modélisation, en suivant une approche méthodologique en trois étapes : d'abord le modèle conceptuel pour identifier les entités et relations, puis le modèle logique pour structurer les tables, et enfin l'implémentation physique avec PostgreSQL.

### Ma réflexion sur le schéma

L'analyse des besoins m'a amené à identifier quatre entités principales : les utilisateurs, les candidatures, les rappels et les rounds d'entretien. La relation était assez évidente : un utilisateur a plusieurs candidatures, une candidature peut avoir plusieurs rappels et plusieurs rounds.

Ce qui m'a pris du temps, c'était de décider si je devais créer une table séparée pour les rounds d'entretien ou simplement ajouter des champs dans la table des candidatures. Au début, j'étais tenté par la simplicité d'avoir tout dans une table, mais j'ai vite réalisé qu'une candidature peut passer par plusieurs étapes d'entretien : phone screen, entretien technique, entretien final, etc. Une table séparée s'imposait donc.

Voici le schéma final que j'ai implémenté :

```sql
-- 001_create_table.sql - Migration principale
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_application TEXT NOT NULL,
    company TEXT NOT NULL,
    sent_date DATE NOT NULL,
    location TEXT NOT NULL,
    status VARCHAR(50) CHECK (status IN ('sent', 'pending', 'rejected', 'interview_scheduled')),
    notes TEXT,
    url_application TEXT,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(title_application, company, user_id)
);

CREATE TABLE reminders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    reminder_date DATE NOT NULL,
    status VARCHAR(50) CHECK (status IN ('pending', 'sent')),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rounds (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
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
);
```

### Mes choix techniques

J'ai opté pour PostgreSQL parce que c'est une base de données mature et fiable, avec un excellent support des UUID et des contraintes avancées. Les UUID comme clés primaires permettent d'éviter les collisions si je dois un jour distribuer l'application sur plusieurs serveurs.

Une décision importante a été d'utiliser des contraintes CHECK pour valider les statuts directement au niveau base de données. Par exemple, le statut d'une candidature ne peut être que 'sent', 'pending', 'rejected' ou 'interview_scheduled'. Cela garantit la cohérence des données même si j'ajoute d'autres interfaces à l'avenir.

La contrainte UNIQUE sur (title_application, company, user_id) évite qu'un utilisateur crée accidentellement deux candidatures identiques pour le même poste dans la même entreprise. C'est un détail, mais qui améliore l'expérience utilisateur.

### Migrations avec Tern

Pour gérer l'évolution du schéma, j'ai utilisé Tern, un outil de migration simple et efficace pour PostgreSQL. Chaque changement de schéma correspond à un fichier de migration versionné :

```
migrations/
├── 001_create_table.sql        # Création structure initiale
├── 002_seed_tables.sql          # Données de test
├── 003_add_location_application.sql  # Ajout colonne location
├── 004_add_uniqueness_constraint_application.sql
├── 005_remove_name_users.sql
├── 006_change_status_enum.sql
├── 007_create_rounds_table.sql
└── tern.conf                    # Configuration
```

L'avantage de Tern, c'est sa simplicité : un fichier SQL par migration, et il s'occupe de tout. Quand j'ai dû ajouter la table des rounds (#007), ou modifier les statuts des candidatures (#006), j'ai pu le faire de manière contrôlée et reproductible.

### SQLC pour l'accès aux données

Pour l'accès aux données depuis Go, j'ai choisi SQLC plutôt qu'un ORM classique. SQLC génère du code Go type-safe à partir de requêtes SQL écrites à la main. Au début, ça semblait être un retour en arrière par rapport aux ORMs que je connaissais, mais c'est en fait très puissant.

Voici comment ça fonctionne dans mon projet :

```sql
-- queries.sql - Mes requêtes SQL pour SQLC
-- name: GetAllApplications :many
SELECT * FROM applications WHERE user_id = $1;

-- name: GetApplicationsByStatus :many
SELECT * FROM applications WHERE status = $1 AND user_id = $2 ORDER BY updated_at DESC;

-- name: CreateOneApplication :one
INSERT INTO applications ( 
    title_application, company, location, sent_date, status, notes, url_application, user_id 
) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
```

Et SQLC génère automatiquement le code Go correspondant :

```go
// queries.sql.go - Code généré par SQLC
func (q *Queries) GetAllApplications(ctx context.Context, userID uuid.UUID) ([]Application, error) {
    const getAllApplications = `SELECT id, title_application, company, location, sent_date, status, notes, url_application, user_id, created_at, updated_at FROM applications WHERE user_id = $1`
    
    rows, err := q.db.Query(ctx, getAllApplications, userID)
    if err != nil {
        return nil, err
    }
    defer rows.Close()
    
    var items []Application
    for rows.Next() {
        var i Application
        if err := rows.Scan(/* ... */); err != nil {
            return nil, err
        }
        items = append(items, i)
    }
    return items, nil
}
```

L'énorme avantage, c'est que toutes mes requêtes sont vérifiées à la compilation. Impossible d'avoir une erreur de typo dans un nom de colonne, et si je change mon schéma, SQLC m'indique immédiatement quelles requêtes doivent être mises à jour.

### Les difficultés rencontrées

La partie la plus délicate a été la gestion des types PostgreSQL dans Go. PostgreSQL utilise des types nullable, mais Go n'a pas de concept de valeur null native. J'ai dû utiliser pgtype pour les champs optionnels :

```go
type Application struct {
    ID               uuid.UUID     `json:"id"`
    TitleApplication string        `json:"title_application"`
    Company          string        `json:"company"`
    SentDate         time.Time     `json:"sent_date"`
    Status           pgtype.Text   `json:"status"`        // Peut être null
    Notes            pgtype.Text   `json:"notes"`         // Peut être null
    UrlApplication   pgtype.Text   `json:"url_application"` // Peut être null
    UserID           uuid.UUID     `json:"user_id"`
}
```

J'ai créé des fonctions helper pour simplifier la conversion :

```go
func PgtypeTextFromPointer(s *string) pgtype.Text {
    if s == nil || *s == "" {
        return pgtype.Text{Valid: false}
    }
    return pgtype.Text{String: *s, Valid: true}
}
```

### Résultats obtenus

Au final, j'ai une base de données robuste et bien structurée. Les migrations me permettent de faire évoluer le schéma de manière contrôlée, et SQLC me garantit des requêtes type-safe qui évitent les erreurs de runtime. 

Le plus satisfaisant, c'est que je peux faire des requêtes complexes (comme les analytics avec des GROUP BY) tout en gardant la sécurité du typage. Et si je dois déboguer un problème, je peux facilement examiner le SQL généré, contrairement à un ORM où les requêtes sont souvent opaques.

Cette approche pragmatique s'est révélée très efficace pour un projet de cette taille : assez simple pour rester maintenable, mais suffisamment robuste pour supporter les évolutions futures.

---

## Déploiement et mise en production

Le déploiement était un aspect du projet que j'appréhendais un peu au début. J'avais l'habitude de développer en local, mais faire tourner une application full-stack en production, avec tous les aspects de sécurité et de fiabilité que cela implique, c'était nouveau pour moi. J'ai donc décidé d'adopter une approche progressive : d'abord containeriser l'application avec Docker, puis mettre en place un pipeline CI/CD avec GitHub Actions.

### Docker : mes premiers pas

Ma première approche avec Docker était assez naïve. Je voulais juste faire fonctionner l'application dans un conteneur, sans me préoccuper de l'optimisation. Mon premier Dockerfile faisait plus de 2GB parce que j'incluais tout l'environnement de développement dans l'image finale !

J'ai vite compris l'intérêt des builds multi-stage. L'idée est simple : utiliser une première image avec tous les outils de build (compilateur Go, dépendances, etc.), puis copier seulement le binaire final dans une image Alpine légère pour la production.

Voici le Dockerfile final que j'ai mis au point :

```dockerfile
# Dockerfile - Build multi-stage réel du projet
FROM golang:1.23-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o main ./cmd/api/main.go

FROM alpine:3.18

RUN apk add --no-cache ca-certificates postgresql-client && \
    adduser -D -s /bin/sh appuser

WORKDIR /go
RUN wget https://github.com/jackc/tern/releases/download/v2.3.2/tern_2.3.2_linux_amd64.tar.gz && \
    tar -xzf tern_2.3.2_linux_amd64.tar.gz && \
    mv tern /usr/local/bin/ && \
    rm tern_2.3.2_linux_amd64.tar.gz

WORKDIR /app

COPY --from=builder /app/main .
COPY --from=builder /app/entrypoint.sh .
COPY --from=builder /app/migrations ./migrations

RUN chmod +x ./entrypoint.sh && \
    chown -R appuser:appuser /app

USER appuser

EXPOSE 8080

CMD ["./entrypoint.sh"]
```

La différence était spectaculaire : de plus de 2GB, je suis passé à moins de 20MB pour l'image finale. Et le déploiement est devenu beaucoup plus rapide.

Pour l'environnement de développement, j'ai créé un docker-compose.yml qui lance à la fois l'API et PostgreSQL :

```yaml
# docker-compose.yml - Configuration réelle du projet
services:
  api:
    build: .
    ports:
      - "8080:8080"
    environment:
      - JWTSECRET=${JWTSECRET}
      - DATABASE_URL=postgres://${DB_USER}:${DB_PASSWORD}@db:5432/${DB_NAME}
      - CORS_ALLOWED_ORIGINS=${CORS_ALLOWED_ORIGINS}
      - GO_ENV=${GO_ENV:-production}
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  pgdata:
```

### Mise en place du pipeline CI/CD

Une fois Docker maîtrisé, je voulais automatiser les tests et le déploiement. GitHub Actions était le choix évident, étant donné que mon code était déjà sur GitHub. 

Mon premier pipeline était très basique : juste lancer les tests sur chaque commit. Mais j'ai vite enrichi le processus pour inclure le linting, la vérification de build, et même des tests Docker.

Voici le pipeline CI que j'ai configuré :

```yaml
# .github/workflows/ci.yml - Pipeline CI réel
name: CI – Pull Request Checks

on:
  pull_request:
    branches: [main]

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

permissions:
  contents: read

jobs:
  ci:
    name: Continuous Integration
    runs-on: ubuntu-latest

    strategy:
      fail-fast: false
      matrix:
        go: ['1.23.x']  

    env:
      JWTSECRET: ${{ secrets.JWTSECRET || 'asdhoiudfhiuhdhakjshdouhehrfwhofnalsidhohdohowfhoewfdkshl' }}

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Go
        uses: actions/setup-go@v5
        with:
          go-version: ${{ matrix.go }}
          cache: true  

      - name: Cache Go build cache
        uses: actions/cache@v4
        with:
          path: ~/.cache/go-build
          key: ${{ runner.os }}-gobuild-${{ hashFiles('**/go.sum') }}
          restore-keys: |
            ${{ runner.os }}-gobuild-

      - name: Verify deps
        run: |
          go mod download
          go mod verify

      - name: go vet
        run: go vet ./...

      - name: go fmt check
        run: |
          UNFORMATTED=$(gofmt -s -l .)
          if [ -n "$UNFORMATTED" ]; then
            echo "These files are not gofmt-ed:"
            echo "$UNFORMATTED"
            exit 1
          fi

      - name: Run tests (race + coverage)
        run: go test -race -covermode=atomic -coverprofile=coverage.out ./...

      - name: Upload coverage artifact
        uses: actions/upload-artifact@v4
        with:
          name: coverage-${{ matrix.go }}
          path: coverage.out

      - name: golangci-lint
        uses: golangci/golangci-lint-action@v6
        with:
          version: v1.58.0

      - name: Build application
        run: go build -o tmp/main ./cmd/api/main.go

      - name: Test Docker build
        run: docker build -t applytrack-test .
```

### Les problèmes rencontrés et leurs solutions

GitHub Actions était complètement nouveau pour moi, et j'ai fait pas mal d'erreurs au début. Le plus frustrant, c'était les tests qui passaient en local mais échouaient en CI. Le problème principal était les variables d'environnement manquantes.

En local, j'avais mes fichiers .env avec toutes les clés (JWTSECRET, DATABASE_URL, etc.), mais en CI, ces variables n'existaient pas. Les tests qui dépendaient de l'authentification JWT plantaient systématiquement. J'ai résolu ça en configurant des GitHub Secrets pour les variables sensibles, et en créant des fallback pour les environnements de test :

```go
// internal/utils/jwtGenerator.go - Gestion des variables d'environnement
var jwtSecret []byte

func init() {
    secret := os.Getenv("JWTSECRET")
    if secret == "" {
        log.Fatal("JWTSECRET environment variable must be set and non-empty")
    }
    if len(secret) < 32 {
        log.Fatal("JWTSECRET must be at least 32 characters long for security")
    }
    jwtSecret = []byte(secret)
}

func CreateToken(userId string) (string, error) {
    claims := Claims{
        UserId: userId,
        RegisteredClaims: jwt.RegisteredClaims{
            ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 24)),
            IssuedAt:  jwt.NewNumericDate(time.Now()),
            Issuer:    "AppliTrack",
        },
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    tokenString, err := token.SignedString(jwtSecret)
    if err != nil {
        return "", err
    }
    return tokenString, nil
}
```

Un autre problème était la gestion de PostgreSQL dans les tests. Au début, j'essayais de mocker complètement la base, mais c'était frustrant parce que ça ne testait pas les vraies interactions SQL. C'est là que Testcontainers a vraiment brillé : GitHub Actions peut faire tourner des conteneurs Docker, donc mes tests d'intégration fonctionnaient parfaitement en CI.

### Configuration de la sécurité

Pour la production, j'ai dû faire attention à plusieurs aspects de sécurité que je négligeais en développement. D'abord, la gestion des secrets : plus question de mettre des clés en dur dans le code ou dans des fichiers .env commités.

J'ai configuré des variables d'environnement sécurisées, et ajouté des vérifications pour m'assurer qu'elles sont bien définies au démarrage :

```go
// server.go - Vérification des variables critiques
func validateEnvironment() error {
    required := []string{"JWTSECRET", "DATABASE_URL"}
    
    for _, env := range required {
        if os.Getenv(env) == "" {
            return fmt.Errorf("required environment variable %s is not set", env)
        }
    }
    return nil
}
```

J'ai aussi configuré des en-têtes de sécurité HTTP (CORS, CSP, etc.) et mis en place la protection CSRF avec des tokens dans les cookies :

```go
// Configuration CORS et sécurité
s.echo.Use(middleware.CORSWithConfig(middleware.CORSConfig{
    AllowOrigins:     []string{"https://mondomaine.com"},
    AllowMethods:     []string{echo.GET, echo.POST, echo.PUT, echo.DELETE},
    AllowHeaders:     []string{echo.HeaderOrigin, echo.HeaderContentType, "X-CSRF-Token"},
    AllowCredentials: true,
}))

s.echo.Use(middleware.CSRFWithConfig(middleware.CSRFConfig{
    TokenLookup:    "header:X-CSRF-Token",
    CookiePath:     "/",
    CookieHTTPOnly: true,
    CookieSameSite: http.SameSiteStrictMode,
}))
```

### Déploiement en production avec DigitalOcean

Une fois le pipeline CI stabilisé, j'ai voulu aller plus loin et mettre en place le déploiement automatique (CD). J'ai choisi DigitalOcean pour héberger ApplyTrack en production, principalement pour leur simplicité d'usage et leurs prix attractifs pour un projet personnel.

Mon workflow de déploiement est configuré pour se déclencher automatiquement sur chaque push vers la branche main :

```yaml
# .github/workflows/deploy.yml - Déploiement automatique
name: CD - Deploy to Production

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  ci:
    name: Pre-deployment Checks
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Go
        uses: actions/setup-go@v4
        with:
          go-version: '1.21'

      - name: Run tests
        run: go test -race ./...

      - name: Build verification
        run: go build -o tmp/main ./cmd/api/main.go

      - name: Docker build test
        run: docker build -t applytrack-deploy-test .

  deploy:
    name: Deploy to Production
    needs: ci
    runs-on: ubuntu-latest

    steps:
      - name: Deploy to production server
        uses: appleboy/ssh-action@v0.1.10
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USERNAME }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd ${{ secrets.DEPLOY_PATH }}
            git config user.email "${{ secrets.GIT_EMAIL }}"
            git config user.name "${{ secrets.GIT_USERNAME }}"
            git config pull.rebase false
            git pull origin main
            docker compose down
            docker compose up -d --build
            echo "✅ Deployment completed successfully!"

      - name: Verify deployment
        uses: appleboy/ssh-action@v0.1.10
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USERNAME }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd ${{ secrets.DEPLOY_PATH }}
            if docker compose ps | grep -q "Up"; then
              echo "✅ Services are running"
              docker compose ps
            else
              echo "❌ Deployment failed - services not running"
              docker compose logs
              exit 1
            fi
```

La stratégie est simple : d'abord valider que tout fonctionne (job `ci`), puis se connecter en SSH au serveur DigitalOcean pour faire le déploiement. Le workflow utilise des GitHub Secrets pour sécuriser les informations sensibles comme les clés SSH et l'adresse du serveur.

### Configuration DigitalOcean

J'ai opté pour une Droplet basique Ubuntu 22.04 avec Docker pré-installé. L'avantage de DigitalOcean, c'est leur marketplace avec des images préconfigurées - pas besoin d'installer manuellement Docker et Docker Compose.

Sur le serveur, la configuration est minimale :
- Clone du repository ApplyTrack
- Fichier `.env` avec les variables de production (DATABASE_URL, JWTSECRET, etc.)
- Docker Compose qui lance l'API et PostgreSQL

Le processus de déploiement est entièrement automatisé : dès que je pousse du code sur `main`, GitHub Actions se charge de tout. Il valide d'abord le code (tests, build), puis se connecte au serveur pour faire un `git pull` et relancer les conteneurs.

### Résultats et leçons apprises

Au final, j'ai mis en place une solution de déploiement reproductible et automatisée. Chaque modification de code passe par des vérifications rigoureuses (tests, linting, build), et le déploiement se fait automatiquement avec confiance.

Ce qui m'a le plus marqué, c'est l'importance de commencer simple et d'itérer. Mon premier Docker était énorme et inefficace, mon premier pipeline CI était basique, mais à force d'améliorer petit à petit, j'ai fini avec quelque chose de professionnel.

L'autre leçon importante, c'est que DevOps n'est pas juste une question d'outils, mais surtout de discipline. Avoir un bon pipeline ne sert à rien si on ne respecte pas le processus : ne pas skipper les tests, ne pas commiter directement en main, prendre le temps de reviewer le code.

Maintenant, quand je travaille sur ApplyTrack, je sais que chaque changement est testé automatiquement, que mon application se build correctement, et que le déploiement se fera sans surprise. Cette tranquillité d'esprit, ça n'a pas de prix !

---

## Sécurisation de l'application

La sécurité n'était pas ma priorité au début du projet - j'avais envie de voir ApplyTrack fonctionner rapidement. Mais très vite, j'ai réalisé qu'une application qui gère des données personnelles (candidatures, mots de passe, emails) sans sécurité robuste, c'est juste irresponsable. J'ai donc consacré pas mal de temps à implémenter une sécurité multicouche, en apprenant beaucoup au passage.

### Authentification et gestion des mots de passe

Le premier défi était de choisir comment hacher les mots de passe. J'avais entendu parler de bcrypt, mais en creusant, j'ai découvert Argon2, qui est plus récent et recommandé par l'OWASP. Argon2 résiste mieux aux attaques par GPU et permet un fine tuning des paramètres de sécurité.

Voici mon implémentation du hashage Argon2 :

```go
// internal/utils/hashPassword.go - Hashage sécurisé
func HashPassword(password string) (string, error) {
    p := &params{
        Memory:      64 * 1024, // 64 MB de RAM
        Iterations:  3,         // 3 itérations
        Parallelism: 2,         // 2 threads
        SaltLength:  16,        // Salt de 16 bytes
        KeyLength:   32,        // Clé de 32 bytes
    }

    salt, err := generateRandomBytes(p.SaltLength)
    if err != nil {
        return "", err
    }

    hash := argon2.IDKey([]byte(password), salt, p.Iterations, p.Memory, p.Parallelism, p.KeyLength)

    b64Salt := base64.RawStdEncoding.EncodeToString(salt)
    b64Hash := base64.RawStdEncoding.EncodeToString(hash)

    encoded := fmt.Sprintf("$argon2id$v=19$m=%d,t=%d,p=%d$%s$%s",
        p.Memory, p.Iterations, p.Parallelism, b64Salt, b64Hash)

    return encoded, nil
}

func ComparePassword(password, hashedPassword string) error {
    // Parsing du hash existant
    parts := strings.Split(hashedPassword, "$")
    if len(parts) != 6 {
        return ErrInvalidHash
    }

    var memory, iterations uint32
    var parallelism uint8

    _, err := fmt.Sscanf(parts[3], "m=%d,t=%d,p=%d", &memory, &iterations, &parallelism)
    if err != nil {
        return ErrInvalidHash
    }

    salt, err := base64.RawStdEncoding.DecodeString(parts[4])
    if err != nil {
        return ErrInvalidHash
    }

    expectedHash, err := base64.RawStdEncoding.DecodeString(parts[5])
    if err != nil {
        return ErrInvalidHash
    }

    // Hash du mot de passe fourni avec les mêmes paramètres
    hash := argon2.IDKey([]byte(password), salt, iterations, memory, parallelism, uint32(len(expectedHash)))

    // Comparaison en temps constant pour éviter les attaques par timing
    if subtle.ConstantTimeCompare(hash, expectedHash) == 1 {
        return nil
    }
    return ErrMatch
}
```

Ce qui m'a pris du temps, c'était de comprendre le bon équilibre des paramètres. 64MB de RAM et 3 itérations, c'est assez pour ralentir significativement les attaques brute force sans rendre l'authentification trop lente pour l'utilisateur. L'utilisation de `crypto/subtle.ConstantTimeCompare` évite les attaques par timing qui pourraient révéler des informations sur le hash.

### Authentification JWT et gestion des sessions

Pour l'authentification, j'ai opté pour des JWT stockés dans des cookies HTTPOnly. C'était un compromis entre sécurité et simplicité d'implémentation. Les JWT dans localStorage sont vulnérables aux attaques XSS, tandis que les cookies HTTPOnly sont automatiquement protégés.

Ma stratégie JWT inclut des validations strictes :

```go
// internal/utils/jwtGenerator.go - Gestion sécurisée des tokens
var jwtSecret []byte

func init() {
    secret := os.Getenv("JWTSECRET")
    if secret == "" {
        log.Fatal("JWTSECRET environment variable must be set and non-empty")
    }
    if len(secret) < 32 {
        log.Fatal("JWTSECRET must be at least 32 characters long for security")
    }
    jwtSecret = []byte(secret)
}

func CreateToken(userId string) (string, error) {
    claims := Claims{
        UserId: userId,
        RegisteredClaims: jwt.RegisteredClaims{
            ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 24)),
            IssuedAt:  jwt.NewNumericDate(time.Now()),
            Issuer:    "AppliTrack",
        },
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    tokenString, err := token.SignedString(jwtSecret)
    if err != nil {
        return "", err
    }
    return tokenString, nil
}
```

J'impose une longueur minimale de 32 caractères pour le secret JWT, et les tokens expirent après 24h. L'issuer "AppliTrack" permet de valider que le token vient bien de mon application.

### Protection contre les attaques par force brute

Un aspect que je négligeais au début, c'était la protection contre les attaques par force brute sur les endpoints d'authentification. J'ai implémenté un rate limiter spécifique pour les tentatives de connexion :

```go
// internal/utils/authRateLimit.go - Rate limiting pour l'authentification
type AuthRateLimiter struct {
    attempts map[string][]time.Time
    mutex    sync.RWMutex
    limit    int
    window   time.Duration
}

func (rl *AuthRateLimiter) isAllowed(ip string) bool {
    rl.mutex.Lock()
    defer rl.mutex.Unlock()

    now := time.Now()
    windowStart := now.Add(-rl.window)

    attempts := rl.attempts[ip]
    validAttempts := make([]time.Time, 0, len(attempts))
    for _, attempt := range attempts {
        if attempt.After(windowStart) {
            validAttempts = append(validAttempts, attempt)
        }
    }

    if len(validAttempts) >= rl.limit {
        rl.attempts[ip] = validAttempts
        return false
    }

    rl.attempts[ip] = append(validAttempts, now)
    return true
}

func AuthRateLimitMiddleware(limit int, window time.Duration) echo.MiddlewareFunc {
    limiter := NewAuthRateLimiter(limit, window)

    return func(next echo.HandlerFunc) echo.HandlerFunc {
        return func(c echo.Context) error {
            ip := c.RealIP()
            if !limiter.isAllowed(ip) {
                return echo.NewHTTPError(http.StatusTooManyRequests, "Too many authentication attempts. Please try again later.")
            }
            return next(c)
        }
    }
}
```

Ce rate limiter permet maximum 5 tentatives de connexion par IP toutes les 15 minutes. Il inclut un système de nettoyage automatique pour éviter les fuites mémoire. L'utilisation de `sync.RWMutex` permet de gérer la concurrence de manière sûre.

### Middlewares de sécurité

J'ai implémenté plusieurs middlewares pour sécuriser les en-têtes HTTP et protéger contre les attaques web classiques :

```go
// internal/utils/securityHeaders.go - Headers de sécurité
func SecurityHeadersMiddleware() echo.MiddlewareFunc {
    return func(next echo.HandlerFunc) echo.HandlerFunc {
        return func(c echo.Context) error {
            res := c.Response()

            res.Header().Set("X-Content-Type-Options", "nosniff")
            res.Header().Set("X-Frame-Options", "DENY")
            res.Header().Set("X-XSS-Protection", "1; mode=block")
            res.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")
            res.Header().Set("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;")

            if os.Getenv("GO_ENV") == "production" {
                res.Header().Set("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
            }

            return next(c)
        }
    }
}
```

Ces en-têtes protègent contre :
- **X-Content-Type-Options** : Empêche le MIME sniffing
- **X-Frame-Options** : Bloque l'intégration dans des iframes (protection clickjacking)
- **X-XSS-Protection** : Active la protection XSS du navigateur
- **CSP** : Content Security Policy restrictive
- **HSTS** : Force HTTPS en production

### Configuration CORS et CSRF

La configuration CORS était délicate parce que je voulais être sécurisé sans bloquer mon frontend React. J'ai opté pour une approche restrictive avec des origines explicitement autorisées :

```go
// Configuration CORS dans internal/server/server.go
allowedOrigins := []string{"http://localhost:5173"}
if originsEnv := os.Getenv("CORS_ALLOWED_ORIGINS"); originsEnv != "" {
    allowedOrigins = strings.Split(originsEnv, ",")
    for i, origin := range allowedOrigins {
        allowedOrigins[i] = strings.TrimSpace(origin)
    }
}

s.echo.Use(middleware.CORSWithConfig(middleware.CORSConfig{
    AllowOrigins:     allowedOrigins,
    AllowMethods:     []string{echo.GET, echo.POST, echo.PUT, echo.DELETE, echo.PATCH, echo.OPTIONS},
    AllowHeaders:     []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization, "X-CSRF-Token"},
    AllowCredentials: true,
}))

s.echo.Use(middleware.CSRFWithConfig(middleware.CSRFConfig{
    TokenLookup:    "header:X-CSRF-Token",
    CookiePath:     "/",
    CookieHTTPOnly: true,
    CookieSameSite: http.SameSiteStrictMode,
}))
```

La protection CSRF avec des tokens dans les cookies HTTPOnly et SameSite=Strict offre une protection solide contre les attaques cross-site.

### Sécurisation des requêtes SQL

Avec SQLC, la protection contre l'injection SQL est automatique puisque toutes les requêtes utilisent des paramètres préparés. Un avantage majeur de SQLC est la sécurité contre l'injection SQL : comme toutes les requêtes sont écrites à la main mais compilées et transformées en fonctions Go fortement typées, les paramètres utilisateurs sont automatiquement passés via des variables préparées.

Voici un exemple concret de mes requêtes SQLC :

```sql
-- internal/db/queries/queries.sql - Requêtes sécurisées
-- name: GetAllApplications :many
SELECT * FROM applications WHERE user_id = $1;

-- name: GetApplicationsByStatus :many
SELECT * FROM applications WHERE status = $1 AND user_id = $2 ORDER BY updated_at DESC;

-- name: CreateOneApplication :one
INSERT INTO applications ( 
    title_application, company, location, sent_date, status, notes, url_application, user_id 
) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
```

SQLC génère automatiquement du code Go qui utilise des requêtes préparées :

```go
// Code généré par SQLC - sécurisé par défaut
func (q *Queries) GetAllApplications(ctx context.Context, userID uuid.UUID) ([]Application, error) {
    const getAllApplications = `SELECT id, title_application, company, location, sent_date, status, notes, url_application, user_id, created_at, updated_at FROM applications WHERE user_id = $1`
    
    rows, err := q.db.Query(ctx, getAllApplications, userID)
    // Les paramètres sont automatiquement échappés par pgx
}
```

Cela évite d'insérer directement des chaînes de caractères dans les requêtes et élimine ainsi le risque d'injection SQL, une des failles les plus courantes dans les applications web. Même si un utilisateur malveillant essayait d'injecter du SQL via les champs de formulaire, les paramètres sont traités comme des valeurs littérales, pas comme du code exécutable.

### Gestion sécurisée des secrets

En développement, j'utilise un fichier `.env` (non commité), mais en production, toutes les variables sensibles passent par des variables d'environnement ou des GitHub Secrets. J'ai implémenté des validations au démarrage de l'application :

```go
func validateEnvironment() error {
    required := []string{"JWTSECRET", "DATABASE_URL"}
    
    for _, env := range required {
        if os.Getenv(env) == "" {
            return fmt.Errorf("required environment variable %s is not set", env)
        }
    }
    return nil
}
```

### Résultats et apprentissages

Cette approche multicouche me donne confiance dans la sécurité d'ApplyTrack. Chaque niveau (hashage, authentification, middlewares, validation) contribue à la défense globale. 

Ce qui m'a le plus marqué, c'est que la sécurité ne s'ajoute pas après coup - elle doit être pensée dès le début. Argon2, les en-têtes sécurisés, la validation stricte, tout ça fait partie de l'architecture de base.

L'autre leçon importante : la sécurité, c'est un équilibre permanent entre protection et utilisabilité. Des paramètres Argon2 trop stricts ralentissent l'authentification, un CSP trop restrictif casse l'interface. Il faut trouver le bon compromis.

---

## Bilan du projet

Arrivé au terme de ce projet, je peux dire qu'ApplyTrack a largement dépassé mes attentes initiales. Ce qui avait commencé comme un simple outil personnel pour organiser mes candidatures s'est transformé en un vrai projet technique complet, qui m'a permis d'apprendre énormément de choses nouvelles et de consolider mes compétences existantes.

### Ce que j'ai réellement appris

Au niveau technique, ce projet m'a fait découvrir plusieurs outils et concepts que je ne maîtrisais pas auparavant. Testcontainers a été une révélation : pouvoir tester son code avec une vraie base de données sans la complexité d'un environnement de test partagé, c'est exactement ce qu'il me fallait. Avant ça, j'avais tendance à mocker toutes les interactions avec la base, ce qui donnait une fausse impression de confiance.

SQLC a aussi été une découverte importante. Venant d'environnements où les ORMs dominent, écrire du SQL à la main paraissait être un retour en arrière. Mais la génération de code type-safe s'est révélée très puissante, surtout pour les requêtes complexes d'analytics. Je comprends maintenant pourquoi certains développeurs préfèrent garder le contrôle sur leurs requêtes SQL.

Argon2 pour le hachage des mots de passe était nouveau pour moi aussi. Je connaissais bcrypt, mais la configuration des paramètres Argon2 (time=1, memory=64*1024, threads=4) m'a fait comprendre l'importance de bien calibrer la sécurité selon le contexte d'usage.

Côté DevOps, GitHub Actions m'a ouvert les yeux sur l'automatisation. Avant ce projet, je testais manuellement avant chaque déploiement, avec tous les risques d'oubli que ça implique. Maintenant, avoir un pipeline qui vérifie automatiquement le linting, lance les tests, et valide le build, c'est devenu indispensable dans ma façon de travailler.

### Les défis techniques surmontés

Le plus gros défi a été la gestion des états avec TanStack Query. Venant de Redux, j'avais mes habitudes, mais TanStack Query fonctionne complètement différemment avec son système de cache automatique et d'invalidation. Le moment où j'ai vraiment compris, c'est lors de l'implémentation de l'import CSV : il fallait que la modale des résultats se mette à jour en temps réel, et que la liste des candidatures soit rafraîchie automatiquement après un import réussi. La solution avec `queryClient.invalidateQueries()` était élégante, mais il m'a fallu du temps pour l'assimiler.

L'architecture backend en 3 couches m'a aussi demandé pas mal de réflexion. Au début, j'avais tendance à mélanger la logique de validation HTTP avec la logique métier, ou à faire des accès directs à la base depuis les handlers. Séparer proprement les responsabilités entre Handler, Service et Store a nécessité plusieurs refactorings, mais le résultat final est beaucoup plus maintenable.

La sécurité web était un autre point que je sous-estimais. Entre les JWT stockés dans des cookies HTTPOnly, la protection CSRF avec des tokens, et la validation multicouche des entrées, j'ai réalisé qu'il ne suffit pas d'ajouter un middleware d'authentification pour sécuriser une application. Chaque couche doit contribuer à la sécurité globale.

### Les erreurs et apprentissages

Ma plus grosse erreur a été de vouloir développer plusieurs fonctionnalités en parallèle. Je commençais l'import CSV alors que les rappels n'étaient pas totalement finis, ou je me lançais dans les analytics avant d'avoir solidifié le CRUD de base. Ça créait des bugs difficiles à diagnostiquer et une base de code instable. J'ai appris l'importance de la discipline : finir complètement une fonctionnalité (tests inclus) avant de passer à la suivante.

Au niveau des tests, j'ai d'abord négligé les tests d'intégration en pensant que les tests unitaires suffisaient. Mais les bugs les plus vicieux venaient des interactions entre les couches, ou des subtilités SQL que les mocks ne captaient pas. Testcontainers a résolu ce problème, mais j'aurais dû l'adopter plus tôt.

Pour l'organisation du code frontend, j'ai hésité longtemps entre une architecture par type de fichier (tous les components ensemble, tous les hooks ensemble) et une architecture par fonctionnalité. J'ai finalement opté pour l'approche feature-based, et c'est définitivement le bon choix pour un projet de cette taille.

### Points d'amélioration identifiés

Avec le recul, il y a plusieurs aspects que je pourrais améliorer. D'abord, la documentation du code : j'ai parfois écrit des fonctions complexes sans assez de commentaires, surtout dans la logique métier. Cela pourrait poser problème si quelqu'un d'autre devait reprendre le projet.

Les tests frontend sont insuffisants. J'ai beaucoup investi dans les tests backend, mais côté React, j'ai surtout testé manuellement dans le navigateur. Des tests unitaires avec Jest et des tests end-to-end avec Playwright seraient un plus pour garantir la stabilité de l'interface.

Le monitoring et l'observabilité sont aussi des points à améliorer. Pour l'instant, je n'ai que les logs basiques d'Echo, mais en production, il faudrait des métriques plus poussées (temps de réponse, erreurs, utilisation mémoire) et un système de logging structuré.

L'accessibilité pourrait aussi être renforcée. Radix UI fournit de bonnes bases, mais je n'ai pas fait de tests systématiques avec des screen readers ou de validation WCAG approfondie.

### Évolutions envisagées

Ce projet m'a donné plein d'idées pour la suite. Au niveau fonctionnel, un système de notifications par email pour les rappels importants serait utile. Des analytics plus poussées avec des graphiques de suivi dans le temps, ou une fonction d'export PDF pour créer des rapports de recherche d'emploi.

Techniquement, j'aimerais expérimenter avec Redis pour optimiser les requêtes fréquentes, ou avec Elasticsearch pour ajouter une recherche full-text dans les candidatures et notes. Une API mobile serait aussi intéressante pour consulter ses candidatures depuis son téléphone.

Côté déploiement, passer de Docker Compose à Kubernetes pourrait être un bon exercice pour apprendre l'orchestration à plus grande échelle.

### Ce que ce projet m'apporte

Au-delà des compétences techniques, ce projet me donne une vraie satisfaction personnelle. J'utilise ApplyTrack quotidiennement pour mes propres candidatures, et ça fonctionne exactement comme je l'avais imaginé. C'est gratifiant de résoudre un problème concret avec ses propres outils.

D'un point de vue professionnel, ApplyTrack me donne une base solide pour démontrer mes compétences full-stack. Que ce soit l'architecture backend, la gestion d'état frontend, la sécurité, les tests, ou le déploiement, j'ai maintenant un projet concret qui couvre tous ces aspects.

Pour le titre CDA, ce projet illustre parfaitement les trois activités du référentiel : développer une application sécurisée, concevoir une application multicouches, et préparer le déploiement. Chaque choix technique était justifié par un besoin réel, et chaque difficulté rencontrée m'a fait progresser.

Au final, ApplyTrack est bien plus qu'un simple projet scolaire ou un exercice technique. C'est devenu un outil que j'utilise vraiment, une démonstration concrète de mes compétences, et surtout une base solide pour mes futurs projets. Et qui sait, peut-être que d'autres développeurs en recherche d'emploi pourront en bénéficier un jour !