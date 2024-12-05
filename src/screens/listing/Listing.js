import { useState, useEffect } from "react";
import "./Listing.css";

const Listing = () => {
  const [listOfPokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemonList = async () => {
      // Get only the list of Pokemon from the first endpoint which contains their names and URLs
      // Sample Endpoint:  "https://pokeapi.co/api/v2/pokemon/?offset=20&limit=20"
      // For more details refer to: https://pokeapi.co/docs/v2
      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        // "results" is the name the API uses to concentrate all the different pokemon entries
        setPokemon(data.results);
      } catch (error) {
        console.error("Error fetching Pokemon List:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonList();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="pokemon_list">
      {listOfPokemon.map((pokemon) => (
        <ProductCard key={pokemon.name} pokemonUrl={pokemon.url} />
      ))}
    </div>
  );
};

const ProductCard = ({ pokemonUrl }) => {
  const [pokemonDetails, setIndividualPokemonData] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(true);

  useEffect(() => {
    const fetchIndividualPokemonDetails = async () => {
      try {
        const response = await fetch(pokemonUrl); // We fetch the individual pokemon endpoint
        const data = await response.json();
        setIndividualPokemonData(data); // Store pokemon details
      } catch (err) {
        console.error("Error fetching Pokemon individual details:", err);
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchIndividualPokemonDetails();
  }, [pokemonUrl]); // Se ejecuta cada vez que cambia el `pokemonUrl`

  if (loadingDetails) return <p>Loading Pokemon details...</p>;

  // console.log(pokemonDetails)

  // Get and Format Pokemon Types, some can have more than one type (types are "fire", "rock", "ground", "fairy", etc)
  const types = pokemonDetails.types
    .map((nested) => nested.type.name) // Check object for nested properties and return them in an array
    .join(", ");

  return (
    <div className="pokemon_card">
      <img
        src={pokemonDetails.sprites.front_default}
        alt={pokemonDetails.name}
        className="pokemon_card_image"
      />
      <h3 className="pokemon_id_and_name">
        {"#" + pokemonDetails.id}
        {" " + pokemonDetails.name}
      </h3>
      <p className="pokemon_types">{types}</p>
    </div>
  );
};

export default Listing;
