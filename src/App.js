import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Listing from "./screens/listing/Listing";

function App() {
  return (
    <div className="app">
      <Header />
      <main className="content">
        <h2>List of Pokemon</h2>
      </main>
      <Listing />
      <Footer />
    </div>
  );
}

export default App;
