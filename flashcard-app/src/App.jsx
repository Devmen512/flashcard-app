import { useState } from "react";
import Flashcard from "./components/Flashcard";
import cards from "./data/cards";
import "./App.css";

// Fisher-Yates shuffle
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function App() {
  const [deck, setDeck] = useState(cards);           // active (non-mastered) cards in current order
  const [masteredCards, setMasteredCards] = useState([]); // mastered cards
  const [currentPos, setCurrentPos] = useState(0);   // position in deck
  const [key, setKey] = useState(0);                 // forces Flashcard remount
  const [isShuffled, setIsShuffled] = useState(false);
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  const currentCard = deck[currentPos];

  const handleNext = () => {
    if (currentPos < deck.length - 1) {
      setCurrentPos((p) => p + 1);
      setKey((k) => k + 1);
    }
  };

  const handleBack = () => {
    if (currentPos > 0) {
      setCurrentPos((p) => p - 1);
      setKey((k) => k + 1);
    }
  };

  const handleShuffle = () => {
    if (isShuffled) {
      // restore original order (excluding mastered)
      const masteredIds = masteredCards.map((c) => c.id);
      setDeck(cards.filter((c) => !masteredIds.includes(c.id)));
    } else {
      setDeck((d) => shuffleArray(d));
    }
    setIsShuffled(!isShuffled);
    setCurrentPos(0);
    setKey((k) => k + 1);
  };

  const handleCorrect = () => {
    const newStreak = streak + 1;
    setStreak(newStreak);
    if (newStreak > longestStreak) setLongestStreak(newStreak);
  };

  const handleWrong = () => {
    setStreak(0);
  };

  const handleMaster = () => {
    const mastered = deck[currentPos];
    const newDeck = deck.filter((_, i) => i !== currentPos);
    setMasteredCards((m) => [...m, mastered]);
    setDeck(newDeck);
    // stay in bounds
    setCurrentPos((p) => Math.min(p, newDeck.length - 1));
    setKey((k) => k + 1);
  };

  const canGoBack = currentPos > 0;
  const canGoNext = currentPos < deck.length - 1;

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
          Type your guess or tap the card to reveal the answer!
        </p>

        <div className="stats-row">
          <div className="stat">
            <span className="stat-number">{deck.length}</span>
            <span className="stat-label">Remaining</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-number mastered-color">{masteredCards.length}</span>
            <span className="stat-label">Mastered</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-number streak-color">{streak}</span>
            <span className="stat-label">Streak 🔥</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-number">{longestStreak}</span>
            <span className="stat-label">Best Streak</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        {deck.length === 0 ? (
          <div className="all-mastered">
            <div className="all-mastered-icon">🏆</div>
            <h2>You mastered all the cards!</h2>
            <button className="next-btn" onClick={() => {
              setDeck(cards);
              setMasteredCards([]);
              setCurrentPos(0);
              setIsShuffled(false);
              setKey((k) => k + 1);
            }}>
              Start Over
            </button>
          </div>
        ) : (
          <>
            <div className="top-row">
              <div className="card-counter">
                Card {currentPos + 1} of {deck.length}
              </div>
              <button
                className={`shuffle-btn ${isShuffled ? "shuffled" : ""}`}
                onClick={handleShuffle}
                title={isShuffled ? "Restore order" : "Shuffle cards"}
              >
                {isShuffled ? "↺ Unshuffle" : "⇄ Shuffle"}
              </button>
            </div>

            <Flashcard
              key={key}
              card={currentCard}
              onCorrect={handleCorrect}
              onWrong={handleWrong}
              onMaster={handleMaster}
            />

            <div className="nav-row">
              <button className="nav-btn" onClick={handleBack} disabled={!canGoBack}>
                ← Back
              </button>
              <button className="nav-btn" onClick={handleNext} disabled={!canGoNext}>
                Next →
              </button>
            </div>
          </>
        )}
      </main>

      {masteredCards.length > 0 && (
        <section className="mastered-section">
          <h3 className="mastered-title">✅ Mastered Cards ({masteredCards.length})</h3>
          <div className="mastered-list">
            {masteredCards.map((c) => (
              <div key={c.id} className="mastered-chip">
                {c.flag} {c.answer}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default App;