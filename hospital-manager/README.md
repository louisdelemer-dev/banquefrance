# Hospital Manager — Alpha 0.1

Simulateur personnel de direction hospitalière en France. **Démo jouable avec des données entièrement fictives.**

## Déploiement sur GitHub + Netlify

1. Créer un dépôt GitHub (par exemple `hospital-manager`).
2. Décompresser le ZIP et envoyer **le contenu du dossier** à la racine du dépôt (`package.json`, `src/`, `public/`, `netlify.toml`...).
3. Sur Netlify : **Add new project > Import an existing project > GitHub** et sélectionner le dépôt.
4. Paramètres de construction : commande `npm run build`, dossier de publication `dist`. Ils figurent déjà dans `netlify.toml`.
5. Déployer : Netlify installe les dépendances, compile et publie.

## Exécution en local

Nécessite Node.js 20.19+ ou 22.12+.

```bash
npm install
npm run dev
```

Ouvrir l'adresse affichée par Vite.

Pour contrôler une compilation de production :

```bash
npm run build
npm run preview
```

## Fonctionnalités de l'alpha

- Horloge en heures simulées : avance manuelle ou automatique (3 vitesses).
- Arrivées de patients fictifs, file d'attente, gravité, admissions en médecine/cardiologie/chirurgie.
- Occupation des lits, dossiers individuels, examens simulés et sorties.
- Valorisation **fictive et simplifiée** des séjours, créances, encaissements simulés.
- Recrutement simplifié, masse salariale mensuelle et effectifs.
- Achat immédiat de consommables, consommation de stocks et investissement en lits.
- Parking avec recettes horaires et modification du tarif.
- Événements et pannes d'imagerie.
- Sauvegarde automatique locale avec IndexedDB, export/import JSON.

## Stockage

Les données ne sont **pas hébergées sur Netlify** : le navigateur stocke les parties dans IndexedDB sur **cet appareil et ce profil navigateur**. Une suppression des données du site peut détruire la sauvegarde. Exportez régulièrement un JSON et conservez-le séparément. Le stockage local peut ne pas être disponible en navigation privée.

Un seul emplacement de sauvegarde automatique est actuellement géré. L'export JSON permet d'archiver d'autres parties.

## Limites et transparence

Il s'agit d'une **alpha**, non d'un logiciel hospitalier opérationnel : ni codification PMSI/GHS/CCAM, ni comptabilité M21 en partie double, ni simulation réaliste des plannings de garde ou des règles de facturation françaises, ni serveur de synchronisation, ni ambulances. Les actes, chiffres et identités sont purement fictifs. Ne jamais utiliser pour des décisions médicales, administratives ou financières réelles. La génération automatique de patients ne reproduit pas encore une épidémiologie réelle. Pour la V2, priorités : horaires/compétences du personnel, moteur de séjour plus fin, plan comptable, autorisations, facturation structurée, achats fournisseurs et transports.

## Structure

- `src/model.ts` : règles de jeu et état de simulation.
- `src/App.tsx` : écrans et opérations.
- `src/storage.ts` : sauvegardes IndexedDB, export JSON.
- `src/style.css` : interface.
- `netlify.toml` : déploiement Netlify.

Licence : usage personnel, droits réservés à l'auteur du dépôt.
