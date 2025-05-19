import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Listing from "./screens/listing/Listing";
import PokemonDetails from "./screens/details/PokemonDetails";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <main className="content">
          <Routes>
            <Route path="/" element={<Listing />} />
            <Route path="/pokemon/:name" element={<PokemonDetails />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
