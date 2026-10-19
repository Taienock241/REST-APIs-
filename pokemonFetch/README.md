# Pokédex Explorer

A small, responsive Pokémon search application built with vanilla HTML, CSS, and JavaScript. It uses the [PokéAPI](https://pokeapi.co/) to retrieve Pokémon data and displays the Pokémon's artwork, height, weight, and base experience.

## Features

- Search for a Pokémon by name.
- Loads Pokémon data from the PokéAPI.
- Displays official Pokémon artwork.
- Shows height, weight, and base experience.
- Displays loading, success, validation, and not-found messages.
- Prevents duplicate submissions while a request is in progress.
- Responsive layout for desktop and mobile screens.
- No build tools, frameworks, or package installation required.

## Project structure

```text
pokemonFetch/
├── index.html       # Page structure and search form
├── index.css        # Responsive layout and visual styles
├── fetchdata.js     # API request and UI update logic
└── README.md        # Project documentation
```

## How it works

1. The page loads with `pikachu` as the default search value.
2. Submitting the form calls `fetchData()` in `fetchdata.js`.
3. The search value is trimmed, converted to lowercase, and URL-encoded.
4. JavaScript requests the Pokémon from:

   ```text
   https://pokeapi.co/api/v2/pokemon/{pokemon-name}
   ```

5. The response is converted from JSON into a Pokémon profile.
6. The page updates with:
   - Pokémon name
   - Front sprite
   - Height in metres
   - Weight in kilograms
   - Base experience
7. If the Pokémon cannot be found, the artwork is hidden and an error message is shown.

The API returns height in decimetres and weight in hectograms. The application converts those values before displaying them:

```javascript
height / 10 // decimetres to metres
weight / 10 // hectograms to kilograms
```

## Running the project

### Option 1: Open the HTML file

Open `index.html` in a modern web browser.

### Option 2: Use a local development server

Running a local server is recommended for a more consistent browser experience. If Python is installed, run this from the `pokemonFetch` directory:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

You can also use the **Live Server** extension in Visual Studio Code.

## Using the application

1. Enter a Pokémon name, such as `bulbasaur`, `charizard`, or `mewtwo`.
2. Select **Search** or press Enter.
3. Review the artwork and profile statistics.

Pokémon names should be entered in English, matching the names supported by PokéAPI. For example:

```text
pikachu
gengar
eevee
snorlax
```

## Technologies

- HTML5
- CSS3
- JavaScript (ES6+)
- Fetch API
- PokéAPI
- Google Fonts: DM Sans and Space Grotesk

## Error handling

The application handles these cases in the interface:

- Empty search: asks the user to enter a Pokémon name.
- Unknown Pokémon: displays a not-found message.
- Failed API request: displays a friendly error message.
- Active request: disables the Search button until the request finishes.

Errors are also safely handled so that a failed request does not leave stale artwork visible.

## API reference

This project uses the PokéAPI Pokémon endpoint:

```text
GET https://pokeapi.co/api/v2/pokemon/{name-or-id}
```

Example:

```text
GET https://pokeapi.co/api/v2/pokemon/pikachu
```

For the complete API documentation, visit [pokeapi.co/docs/v2](https://pokeapi.co/docs/v2).

## License and attribution

This project is intended as a learning and demonstration project. Pokémon data is provided by [PokéAPI](https://pokeapi.co/), an independent open-source project.
