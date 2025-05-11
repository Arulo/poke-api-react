import { useState, useEffect } from "react";
import "./Listing.css";

const Listing = () => {
  const [listOfPokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const MAX_OFFSET = 140; // shows up until pokemon #160

  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=20`
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

    setLoading(true);
    fetchPokemonList();
  }, [offset]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="pokemon_list">
            {listOfPokemon.map((pokemon) => (
              <ProductCard key={pokemon.name} pokemonUrl={pokemon.url} />
            ))}
          </div>

          <div className="pagination_controls">
            <button className="pagination_button"
              onClick={() => setOffset(Math.max(offset - 20, 0))}
              disabled={offset === 0}
            >
              PREV
            </button>
            <button className="pagination_button"
              onClick={() => setOffset(offset + 20)}
              disabled={offset >= MAX_OFFSET}
            >
              NEXT
            </button>
          </div>
        </>
      )}
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
  }, [pokemonUrl]); // It executes every time the pokemon URL changes

  if (loadingDetails)
    return (
      <div className="pokemon_card_loading">
        <img
          className="pokeball_spinner"
          src="/images/spinner.gif"
          alt="spinner"
        ></img>
        <p>Loading...</p>
      </div>
    );

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
