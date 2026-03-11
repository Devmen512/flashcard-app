import { useState } from "react";
import "./Flashcard.css";

const difficultyConfig = {
  easy: {
    label: "Easy",
    frontColor: "#134e2a",
    backColor: "#166534",
    accent: "#4ade80",
    badge: "#dcfce7",
    badgeText: "#14532d",
  },
  medium: {
    label: "Medium",
    frontColor: "#713f12",
    backColor: "#7c2d12",
    accent: "#fb923c",
    badge: "#ffedd5",
    badgeText: "#7c2d12",
  },
  hard: {
    label: "Hard",
    frontColor: "#1e1b4b",
    backColor: "#3b0764",
    accent: "#a78bfa",
    badge: "#ede9fe",
    badgeText: "#4c1d95",
  },
};

function Flashcard({ card }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const config = difficultyConfig[card.difficulty];

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="flashcard-wrapper" onClick={handleClick}>
      <div className={`flashcard-inner ${isFlipped ? "flipped" : ""}`}>
        {/* FRONT */}
        <div
          className="flashcard-face flashcard-front"
          style={{ background: `linear-gradient(135deg, ${config.frontColor}, #0f172a)` }}
        >
          <div className="difficulty-badge" style={{ background: config.badge, color: config.badgeText }}>
            {config.label}
          </div>

          <div className="flag-container">
            <img
              src={card.flagUrl}
              alt={`Flag for question ${card.id}`}
              className="flag-image"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "block";
              }}
            />
            <span className="flag-emoji-fallback" style={{ display: "none" }}>
              {card.flag}
            </span>
          </div>

          <p className="card-question">{card.question}</p>

          <div className="flip-hint" style={{ color: config.accent }}>
            <span>tap to reveal ↓</span>
          </div>
        </div>

        {/* BACK */}
        <div
          className="flashcard-face flashcard-back"
          style={{ background: `linear-gradient(135deg, ${config.backColor}, #0f172a)` }}
        >
          <div className="difficulty-badge" style={{ background: config.badge, color: config.badgeText }}>
            {config.label}
          </div>

          <div className="answer-glow" style={{ boxShadow: `0 0 60px ${config.accent}33` }}>
            <span className="flag-emoji-large">{card.flag}</span>
            <p className="card-answer" style={{ color: config.accent }}>{card.answer}</p>
          </div>

          <div className="flip-hint" style={{ color: config.accent }}>
            <span>tap to go back ↑</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Flashcard;