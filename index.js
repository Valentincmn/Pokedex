// Configuration
const API_URL = "https://pokeapi.co/api/v2/pokemon?limit=151";

// Variables globales
let allPokemon = [];
let filteredPokemon = [];

// Éléments DOM
const pokedex = document.querySelector("#pokedex");
const searchInput = document.querySelector("#search-input");
const clearBtn = document.querySelector("#clear-search");
const pokemonCount = document.querySelector("#pokemon-count");
const noResults = document.querySelector("#no-results");

// Fonction pour capitaliser la première lettre
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Fonction pour créer une carte Pokémon
function createPokemonCard(pokemon) {
    const card = document.createElement("div");
    card.classList.add("card");

    // Créer les badges de types
    let typeBadges = '';
    pokemon.apiTypes.forEach(type => {
        typeBadges += `<span class="type-badge type-${type.name.toLowerCase()}">${capitalize(type.name)}</span>`;
    });

    card.innerHTML = `
        <div class="card-id">#${pokemon.id.toString().padStart(3, '0')}</div>
        <h2>${capitalize(pokemon.name)}</h2>
        <img src="${pokemon.image}" alt="${pokemon.name}">
        <div class="card-types">
            ${typeBadges}
        </div>
    `;

    // Ajouter un événement de clic
    card.addEventListener('click', () => {
        const typeNames = pokemon.apiTypes.map(t => t.name).join(', ');
        alert(`🎯 ${capitalize(pokemon.name)}\n📊 ID: #${pokemon.id}\n🏷️ Types: ${typeNames}`);
    });

    return card;
}

// Fonction pour afficher les Pokémon
function displayPokemon(pokemonList) {
    pokedex.innerHTML = '';

    pokemonList.forEach(pokemon => {
        const card = createPokemonCard(pokemon);
        pokedex.appendChild(card);
    });
}

// Fonction de recherche
function searchPokemon() {
    const searchTerm = searchInput.value.toLowerCase().trim();

    if (searchTerm === '') {
        filteredPokemon = [...allPokemon];
    } else {
        filteredPokemon = allPokemon.filter(pokemon => {
            const name = pokemon.name.toLowerCase();
            const id = pokemon.id.toString();
            const types = pokemon.apiTypes.map(t => t.name.toLowerCase());

            return name.includes(searchTerm) ||
                id.includes(searchTerm) ||
                types.some(type => type.includes(searchTerm));
        });
    }

    displayPokemon(filteredPokemon);
    updateStats();

    // Afficher/masquer le message "aucun résultat"
    if (filteredPokemon.length === 0 && searchTerm !== '') {
        noResults.style.display = 'block';
    } else {
        noResults.style.display = 'none';
    }
}

// Fonction pour mettre à jour les statistiques
function updateStats() {
    const total = allPokemon.length;
    const shown = filteredPokemon.length;

    if (searchInput.value.trim()) {
        pokemonCount.textContent = `${shown} sur ${total} Pokémon trouvés`;
    } else {
        pokemonCount.textContent = `${total} Pokémon au total`;
    }
}

// Fonction pour effacer la recherche
function clearSearch() {
    searchInput.value = '';
    clearBtn.style.display = 'none';
    searchPokemon();
    searchInput.focus();
}

// Charger tous les Pokémon depuis l'API
async function loadPokemon() {
    pokemonCount.textContent = "Chargement...";

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        const detailPromises = data.results.map(async (pokemon) => {
            const detailResponse = await fetch(pokemon.url);
            if (!detailResponse.ok) {
                throw new Error(`HTTP ${detailResponse.status} sur ${pokemon.name}`);
            }

            const detail = await detailResponse.json();
            return {
                id: detail.id,
                name: detail.name,
                image: detail.sprites.front_default || "",
                apiTypes: detail.types.map(t => ({ name: t.type.name }))
            };
        });

        allPokemon = await Promise.all(detailPromises);
        filteredPokemon = [...allPokemon];
        displayPokemon(filteredPokemon);
        updateStats();
        console.log(`${allPokemon.length} Pokémon chargés !`);
    } catch (error) {
        console.error('Erreur lors du chargement:', error);
        pokedex.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <h3 style="color: red;">Erreur de chargement</h3>
                <p>Impossible de charger les Pokémon</p>
            </div>
        `;
    }
}

// Événements
searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();

    // Afficher/masquer le bouton effacer
    if (query) {
        clearBtn.style.display = 'block';
    } else {
        clearBtn.style.display = 'none';
    }

    searchPokemon();
});

clearBtn.addEventListener('click', clearSearch);

// Démarrer l'application
document.addEventListener('DOMContentLoaded', () => {
    loadPokemon();
});