import { useState, useEffect } from "react";
import "./Listing.css";
import { POKEMON_TYPES } from "../../data/pokemonTypes";

const MAX_OFFSET = 1200;

const Listing = () => {
  const [pokemonList, setPokemonList] = useState<
    { name: string; url: string }[]
  >([]);
  const [filteredPokemon, setFilteredPokemon] = useState<
    { name: string; url: string }[]
  >([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch base (sin filtros)
  useEffect(() => {
    if (selectedTypes.length > 0) return; // no fetch si hay filtros activos

    const fetchPokemonList = async () => {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=20`
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setPokemonList(data.results);
      } catch (error) {
        console.error("Error fetching Pokemon List:", error);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchPokemonList();
  }, [offset, selectedTypes]);

  // Fetch filtrado por tipo
  useEffect(() => {
    const fetchFilteredPokemon = async () => {
      if (selectedTypes.length === 0) {
        setFilteredPokemon([]);
        return;
      }

      try {
        const allResults = await Promise.all(
          selectedTypes.map(async (typeName) => {
            const response = await fetch(
              `https://pokeapi.co/api/v2/type/${typeName}`
            );
            const data = await response.json();
            return data.pokemon.map(
              (entry: { pokemon: { name: string; url: string } }) =>
                entry.pokemon
            );
          })
        );

        // Unificar y deduplicar por nombre
        const merged = allResults.flat();
        const uniqueMap = new Map();
        merged.forEach((poke) => {
          uniqueMap.set(poke.name, poke);
        });

        setFilteredPokemon(Array.from(uniqueMap.values()));
        setOffset(0);
      } catch (error) {
        console.error("Error fetching filtered Pokémon:", error);
      }
    };

    fetchFilteredPokemon();
  }, [selectedTypes]);

  // Handler de selección
  const handleTypeChange = (typeName: string) => {
    setSelectedTypes((prev) =>
      prev.includes(typeName)
        ? prev.filter((t) => t !== typeName)
        : [...prev, typeName]
    );
  };

  // Elegir qué mostrar
  const isFiltering = selectedTypes.length > 0;
  const currentList = isFiltering
    ? filteredPokemon.slice(offset, offset + 20)
    : pokemonList;

  const maxOffset = isFiltering
    ? Math.max(filteredPokemon.length - 20, 0)
    : MAX_OFFSET;

  return (
    <div className="main_wrapper">
      <div className="type_filters" data-testid="type_filters">
        {POKEMON_TYPES.map((type) => {
          const isSelected = selectedTypes.includes(type.name);
          return (
            <label key={type.name} className="type_filter">
              <input
                type="checkbox"
                value={type.name}
                checked={isSelected}
                onChange={() => handleTypeChange(type.name)}
                style={{ display: "none" }}
              />
              <div
                className={`type_icon_wrapper ${isSelected ? "selected" : ""}`}
              >
                <img src={type.icon} alt={type.name} className="type_icon" />
              </div>
            </label>
          );
        })}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="pokemon_list" data-testid="pokemon_list">
            {currentList.map((pokemon) => (
              <PokemonCard key={pokemon.name} pokemonUrl={pokemon.url} />
            ))}
          </div>

          <div
            className="pagination_controls"
            data-testid="pagination_controls"
          >
            <button
              className="pagination_button"
              onClick={() => setOffset(Math.max(offset - 20, 0))}
              disabled={offset === 0}
            >
              PREV
            </button>
            <button
              className="pagination_button"
              onClick={() => setOffset(offset + 20)}
              disabled={offset >= maxOffset}
            >
              NEXT
            </button>
          </div>
        </>
      )}
    </div>
  );
};

type PokemonCardProps = {
  pokemonUrl: string;
};

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemonUrl }) => {
  const [pokemonDetails, setPokemonDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch(pokemonUrl);
        const data = await response.json();
        setPokemonDetails(data);
      } catch (err) {
        console.error("Error fetching Pokemon details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [pokemonUrl]);

  if (loading) {
    return (
      <div className="pokemon_card_loading">
        <img
          className="pokeball_spinner"
          src="/images/spinner.gif"
          alt="spinner"
        />
        <p>Loading...</p>
      </div>
    );
  }

  if (!pokemonDetails) return null;

  const types = pokemonDetails.types
    .map((nested: { type: { name: string } }) => nested.type.name)
    .join(", ");

  return (
    <div className="pokemon_card" data-testid="pokemon_card">
      <img
        src={pokemonDetails.sprites.front_default}
        alt={pokemonDetails.name}
        className="pokemon_card_image"
      />
      <h3 className="pokemon_id_and_name">
        {"#" + pokemonDetails.id} {pokemonDetails.name}
      </h3>
      <p className="pokemon_types">{types}</p>
    </div>
  );
};

export default Listing;
