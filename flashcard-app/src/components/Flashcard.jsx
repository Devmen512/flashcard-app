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

function checkGuess(guess, answer) {
  const normalize = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]/g, "");
  const g = normalize(guess);
  const a = normalize(answer);
  if (!g) return null;
  if (g === a) return "correct";
  const dist = levenshtein(g, a);
  const threshold = Math.max(2, Math.floor(a.length * 0.3));
  if (dist <= threshold) return "close";
  if (a.includes(g) || g.includes(a)) return "close";
  return "wrong";
}

function levenshtein(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i-1] === b[j-1]
        ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
    }
  }
  return dp[a.length][b.length];
}

const feedbackMessages = {
  correct: ["🎉 Correct!", "✅ Nailed it!", "🌟 Exactly right!"],
  close:   ["🤏 So close!", "💡 Almost there!", "📍 Nearly!"],
  wrong:   ["❌ Not quite.", "🗺️ Keep exploring!", "💭 Try again?"],
};

function Flashcard({ card }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const config = difficultyConfig[card.difficulty];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!guess.trim()) return;
    const r = checkGuess(guess, card.answer);
    setResult(r);
    const arr = feedbackMessages[r];
    setFeedbackMsg(arr[Math.floor(Math.random() * arr.length)]);
    if (r === "correct") setIsFlipped(true);
  };

  const resultColors = { correct: "#4ade80", close: "#fbbf24", wrong: "#f87171" };

  return (
    <div className="flashcard-section">
      <div className="flashcard-wrapper" onClick={() => setIsFlipped(!isFlipped)}>
        <div className={`flashcard-inner ${isFlipped ? "flipped" : ""}`}>
          <div className="flashcard-face flashcard-front"
            style={{ background: `linear-gradient(135deg, ${config.frontColor}, #0f172a)` }}>
            <div className="difficulty-badge" style={{ background: config.badge, color: config.badgeText }}>
              {config.label}
            </div>
            <div className="flag-container">
              <img src={card.flagUrl} alt="flag" className="flag-image"
                onError={(e) => { e.target.style.display="none"; e.target.nextSibling.style.display="block"; }} />
              <span className="flag-emoji-fallback" style={{ display: "none" }}>{card.flag}</span>
            </div>
            <p className="card-question">{card.question}</p>
            <div className="flip-hint" style={{ color: config.accent }}>tap to reveal ↓</div>
          </div>

          <div className="flashcard-face flashcard-back"
            style={{ background: `linear-gradient(135deg, ${config.backColor}, #0f172a)` }}>
            <div className="difficulty-badge" style={{ background: config.badge, color: config.badgeText }}>
              {config.label}
            </div>
            <div className="answer-glow" style={{ boxShadow: `0 0 60px ${config.accent}33` }}>
              <span className="flag-emoji-large">{card.flag}</span>
              <p className="card-answer" style={{ color: config.accent }}>{card.answer}</p>
            </div>
            <div className="flip-hint" style={{ color: config.accent }}>tap to go back ↑</div>
          </div>
        </div>
      </div>

      <form className="guess-form" onSubmit={handleSubmit}>
        <div className="guess-input-row">
          <input type="text" className="guess-input" placeholder="Type your answer…"
            value={guess} onChange={(e) => { setGuess(e.target.value); setResult(null); }}
            autoComplete="off" spellCheck="false" />
          <button type="submit" className="guess-btn"
            style={{ borderColor: config.accent, color: config.accent }}>
            Check
          </button>
        </div>
        {result && (
          <div className="feedback-pill"
            style={{ color: resultColors[result], borderColor: resultColors[result]+"55", background: resultColors[result]+"11" }}>
            {feedbackMsg}
            {result === "close" && <span className="feedback-hint"> (answer: {card.answer})</span>}
          </div>
        )}
      </form>
    </div>
  );
}

export default Flashcard;