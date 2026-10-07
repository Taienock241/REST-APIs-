//fetch API data from the API and return it as a JSON object
/* 
fetch("https://pokeapi.co/api/v2/pokemon/pikachu")
   .then(response => {
        if (!response.ok) {
            throw new Error('could not fetch data from the API');
        }
     return response.json();
   })
   .then(data => console.log(data))
   .catch(error => console.error('Error fetching data:', error));
     */

     fetchData();
   async function fetchData() {
    try {

       const pokemonName = document.getElementById("pokemonName").value.toLowerCase();

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        if (!response.ok) {
            throw new Error('could not fetch data from the API');
        }

        const data = await response.json();
        console.log(data);
        let pokemonInfo = document.getElementById("pokemonInfo");
        pokemonInfo.innerHTML = `
            <h2>${data.name.toUpperCase()}</h2>
            <p>Height: ${data.height}</p>
            <p>Weight: ${data.weight}</p>
            <p>Base Experience: ${data.base_experience}</p>
        `;
        const pokemonSprite = data?.sprites?.front_default;
        const imgElement = document.getElementById("pokemonSprite");

        imgElement.src = pokemonSprite;
        imgElement.style.display = "block";
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}