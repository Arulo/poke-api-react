import { useState, useEffect } from "react";
import "./Listing.css";

const Listing = () => {
  const [listOfPokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sample Endpoint:  "https://pokeapi.co/api/v2/pokemon/?offset=20&limit=20"

    const fetchPokemonList = async () => {
      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
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
        const response = await fetch(pokemonUrl); // Usamos el endpoint del pokemon
        const data = await response.json();
        setIndividualPokemonData(data); // Almacenamos los detalles del pokemon
      } catch (err) {
        console.error("Error fetching Pokemon individual details:", err);
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchIndividualPokemonDetails();
  }, [pokemonUrl]); // Se ejecuta cada vez que cambia el `productUrl`

  if (loadingDetails) return <p>Loading product details...</p>;

  console.log(pokemonDetails);

  return (
    // TODO: Learn about how to use template string literals
    <div className="pokemon_card">
      <img
        src={pokemonDetails.sprites.front_default}
        alt={pokemonDetails.name}
        className="pokemon_card_image"
      />
      <h3>
        {"#" + pokemonDetails.id}
        {" " + pokemonDetails.name.toUpperCase()}
      </h3>
    </div>
  );
};

export default Listing;
