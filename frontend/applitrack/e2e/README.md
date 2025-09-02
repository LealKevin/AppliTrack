# Tests E2E - ApplyTrack

## Un seul test simple

Flow complet utilisateur :
1. **Login** avec vrais identifiants
2. **Créer** une candidature
3. **Supprimer** la candidature

## Lancer les tests

```bash
# Frontend + Backend doivent tourner
npm run dev      # Port 5173
go run cmd/api/main.go  # Port 8080

# Dans un autre terminal
npm run test:e2e
```

## Le test (38 lignes)

```typescript
test('complete flow: login, create, delete application', async ({ page }) => {
  // Login → Create → Delete
  // Sélecteurs simples par texte
  // Pas de mocks ni DB setup
});
```

Simple et efficace !