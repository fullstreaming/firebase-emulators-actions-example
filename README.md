# Firebase emulators avec Github Actions

Exemple avec le strict minimum pour fonctionner.

## Dépendances

- Utilisation de `Jest` pour les tests et `Vue` pour avoir un exemple d'intégration dans un framework.
- `@firebase/testing` pour avoir les outils de tests.
- `firebase` le sdk pour.
- `firebase-tools` globalement en local pour intaller l'émulateur.

## Explications

- Des commandes ont été ajouté dans `package.json` pour lancer les tests avec émulateurs en local.
- Les tests se trouvent dans `tests/firebase`. Ceci va tester les "rules" appliquée à firestore qui sont dans `firebase/firestore.rules`.
- Dans le fichier `.github/workflows/tests.yml`, il faut d'abord installer `firebase-tools` puis exécuter les tests avec l'émulateur.

## Bonus

Pour lancer l'émulateur en même temps que le serve de Vue (histoire de ne pas taper dans le serveur de prod lors du dev), il faut changer le port de l'émulateur dans `firebase.json`. Puis indiquer à firestore d'utiliser ce host:port lors de l'initialisation.

```
if (window.location.hostname === 'localhost') {
    firebaseApp.firestore().settings({
        host: 'localhost:8888',
        ssl: false,
    });
}
```