const searchForm = document.getElementById("searchForm");
const pokemonNameInput = document.getElementById("pokemonName");
const fetchButton = document.getElementById("fetchButton");
const pokemonInfo = document.getElementById("pokemonInfo");
const pokemonSprite = document.getElementById("pokemonSprite");
const statusMessage = document.getElementById("statusMessage");

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    fetchData();
});

async function fetchData() {
    const pokemonName = pokemonNameInput.value.trim().toLowerCase();

    if (!pokemonName) {
        statusMessage.textContent = "Enter a Pokémon name to start searching.";
        statusMessage.className = "status-message error";
        pokemonNameInput.focus();
        return;
    }

    fetchButton.disabled = true;
    statusMessage.textContent = "Searching the Pokédex...";
    statusMessage.className = "status-message";

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(pokemonName)}`);

        if (!response.ok) {
            throw new Error("Pokémon not found");
        }

        const data = await response.json();
        const pokemonSpriteUrl = data.sprites.front_default;

        pokemonInfo.innerHTML = `
            <h2>${data.name}</h2>
            <div class="stats">
                <div class="stat">
                    <span class="stat-label">Height</span>
                    <span class="stat-value">${data.height / 10} m</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Weight</span>
                    <span class="stat-value">${data.weight / 10} kg</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Base XP</span>
                    <span class="stat-value">${data.base_experience}</span>
                </div>
            </div>
        `;

        pokemonSprite.src = pokemonSpriteUrl;
        pokemonSprite.alt = `${data.name} official artwork`;
        pokemonSprite.style.display = "block";
        statusMessage.textContent = "Profile loaded successfully.";
    } catch (error) {
        pokemonSprite.style.display = "none";
        statusMessage.textContent = "We couldn't find that Pokémon. Check the spelling and try again.";
        statusMessage.className = "status-message error";
    } finally {
        fetchButton.disabled = false;
    }
}

fetchData();
