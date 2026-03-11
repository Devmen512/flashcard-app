import { useState } from "react";
import Flashcard from "./components/Flashcard";
import cards from "./data/cards";
import "./App.css";

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [key, setKey] = useState(0); // forces Flashcard to remount (reset flip state)

  const handleNextCard = () => {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * cards.length);
    } while (nextIndex === currentIndex && cards.length > 1);

    setCurrentIndex(nextIndex);
    setKey((prev) => prev + 1); // reset the card's flipped state
  };

  const currentCard = cards[currentIndex];

  const easyCt = cards.filter((c) => c.difficulty === "easy").length;
  const medCt = cards.filter((c) => c.difficulty === "medium").length;
  const hardCt = cards.filter((c) => c.difficulty === "hard").length;

  return (
    <div className="app">
      <div className="stars" aria-hidden="true">
        {Array.from({ length: 60 }).map((_, i) => (
          <div key={i} className="star" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
          }} />
        ))}
      </div>

      <header className="app-header">
        <div className="globe-icon">🌍</div>
        <h1 className="app-title">World Capitals</h1>
        <p className="app-description">
          Test your knowledge of capital cities from around the globe.
          Tap a card to reveal the answer!
        </p>

        <div className="stats-row">
          <div className="stat">
            <span className="stat-number">{cards.length}</span>
            <span className="stat-label">Total Cards</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-number easy-color">{easyCt}</span>
            <span className="stat-label">Easy</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-number medium-color">{medCt}</span>
            <span className="stat-label">Medium</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-number hard-color">{hardCt}</span>
            <span className="stat-label">Hard</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="card-counter">
          Card {currentIndex + 1} of {cards.length}
        </div>

        <Flashcard key={key} card={currentCard} />

        <button className="next-btn" onClick={handleNextCard}>
          <span>Next Card</span>
          <span className="btn-arrow">→</span>
        </button>
      </main>
    </div>
  );
}

export default App;