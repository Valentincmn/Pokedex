# Pokedex

Application web simple en HTML, CSS et JavaScript qui affiche les Pokémon, permet la recherche en temps réel et récupère les données depuis l'API publique PokéAPI.

## Fonctionnalités

- Affichage des 151 premiers Pokémon
- Recherche par :
  - nom
  - numéro (`id`)
  - type
- Interface responsive avec cartes Pokémon
- Message d’erreur si l’API est indisponible

## Stack technique

- HTML5
- CSS3
- JavaScript (Vanilla)
- [PokéAPI](https://pokeapi.co/)

## API utilisée

- Liste des Pokémon :  
  `https://pokeapi.co/api/v2/pokemon?limit=151`
- Détails de chaque Pokémon : URL fournie dans `results[].url`
