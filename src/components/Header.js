import "./Header.css";

function Header() {
  return (
    <header className="header">
      <img src="/images/logo.png" alt="Pokeball Logo" className="logo" data-testid="logo" />
      <h1 className="main_heading" data-testid="main_heading">PokeAPI Testing Playground</h1>
    </header>
  );
}

export default Header;
