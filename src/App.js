import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="app">
      <Header />
      <main className="content">
        <p>This is the mock content for the body of the page.</p>
        <p>Add more text, placeholders, or components here.</p>
      </main>
      <Footer />
    </div>
  );
}

export default App;
