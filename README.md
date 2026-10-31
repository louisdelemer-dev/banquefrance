# Hospital Manager — Alpha 0.2

Jeu personnel de simulation de gestion d'un établissement hospitalier fictif. React + TypeScript + Vite, GitHub + Netlify. Aucun serveur applicatif, aucune base de données distante. Sauvegarde locale IndexedDB, export/import JSON.

## Mise en ligne

Déposer **le contenu de ce dossier à la racine** du dépôt GitHub, en remplaçant les fichiers de l'alpha 0.1. Brancher le dépôt à Netlify.
- Base directory : vide
- Build command : `npm run build`
- Publish directory : `dist`

Netlify utilise `netlify.toml`. Pour tester localement : `npm install` puis `npm run dev`. Pour valider : `npm run build`.

## Nouveautés alpha 0.2

- Cycle automatisé des patients : admissions selon lits, personnel et stocks ; examens et sorties selon durée de séjour ; enregistrement des créances.
- Choix d'activer ou suspendre l'automatisation sur le tableau de bord.
- Encaissement partiel quotidien configurable et charge quotidienne d'exploitation.
- Réaffectation des salariés entre services ; prise en compte d'un plafond de capacité en fonction des médecins et infirmiers affectés.
- Page de rapport de gestion (activité, durée moyenne des séjours, attente, finances).
- Avancement par 24 h ou 7 jours ; jeu toujours totalement hors serveur.
- Compatible avec les sauvegardes v1 grâce à l'ajout de champs optionnels.

## Important — limites de cette version

Simulation de gestion pédagogique : patients et diagnostics fictifs, règles d'actes et tarifs simplifiées. Pas de simulation clinique validée, ni comptabilité réglementaire M21, ni PMSI/CCAM de production. Les recettes des soins et les paiements représentent des hypothèses de jeu. Les agents sont affectés par service et non encore par tranches horaires individuelles. L'admission automatique utilise des ratios de capacité ludiques (pas des normes de soins). Les anciens séjours des sauvegardes 0.1 qui ne disposent pas d'heure d'admission continuent d'être reconnus, mais leurs durées antérieures ne peuvent pas être reconstruites.

## Sauvegardes

Sauvegarde automatique dans IndexedDB de l'origine du site et boutons manuels d'export/import. Faites régulièrement un export JSON : vider les données du navigateur peut supprimer les sauvegardes. Pour transférer votre partie vers un autre domaine Netlify, exportez puis importez votre fichier.

## Tests de logique

Le fichier `src/model.ts` peut être compilé seul avec TypeScript, puis testé avec Node. Test de dix jours réalisé sur le moteur (admissions, sorties, examens, valorisation, encaissements). La compilation Vite complète doit être validée par `npm run build` sur Netlify après installation des dépendances.
