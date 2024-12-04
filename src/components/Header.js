import React from "react";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <img src="/images/logo.png" alt="Pokeball Logo" className="logo" />
      <h1 className="main_heading">PokeAPI Testing Playground</h1>
      <nav>
        <ul className="nav_list">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
