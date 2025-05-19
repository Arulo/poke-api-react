import { useParams } from "react-router-dom";

const PokemonDetails = () => {
  const { name } = useParams();

  return (
    <div className="pokemon_details">
      <h1>Detalle del Pokémon: {name}</h1>
    </div>
  );
};

export default PokemonDetails;