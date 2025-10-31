import { useState } from 'react'
import './App.css'
import { suggestWord } from './services/api'

interface GuessEntry {
  word: string;
  feedback: string;
}

function App() {
  const [guesses, setGuesses] = useState<GuessEntry[]>([])
  const [currentWord, setCurrentWord] = useState('')
  const [currentFeedback, setCurrentFeedback] = useState('')
  const [suggestion, setSuggestion] = useState<string>('')
  const [candidates, setCandidates] = useState<string[]>([])
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (currentWord && currentFeedback) {
      const newGuesses = [...guesses, { word: currentWord, feedback: currentFeedback }]
      setGuesses(newGuesses)
      try {
        console.log('Submitting guesses:', newGuesses);
        const result = await suggestWord(newGuesses)
        console.log('Received result:', result);
        setSuggestion(result.suggestion)
        setCandidates(result.candidates)
        setError('')
        // Clear inputs after successful submission
        setCurrentWord('')
        setCurrentFeedback('')
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to get suggestion. Please try again.';
        setError(errorMessage)
        console.error('Submission error:', err)
      }
    }
  }

  const handleRemoveGuess = (index: number) => {
    setGuesses(guesses.filter((_, i) => i !== index))
  }

  return (
    <div className="App">
      <h1>Wordle Bot Assistant</h1>
      
      {guesses.length > 0 && (
        <div className="history">
          <h3>Previous Guesses:</h3>
          {guesses.map((guess, index) => (
            <div key={index} className="guess-entry">
              <span>Word: {guess.word}</span>
              <span>Feedback: {guess.feedback}</span>
              <button onClick={() => handleRemoveGuess(index)} className="remove-btn">
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="word">Word:</label>
          <input
            id="word"
            type="text"
            value={currentWord}
            onChange={(e) => setCurrentWord(e.target.value.toLowerCase())}
            placeholder="Enter your guess (e.g., crane)"
            maxLength={5}
          />
        </div>
        <div>
          <label htmlFor="feedback">Feedback:</label>
          <input
            id="feedback"
            type="text"
            value={currentFeedback}
            onChange={(e) => setCurrentFeedback(e.target.value.toLowerCase())}
            placeholder="Enter feedback (e.g., bbyyg)"
            maxLength={5}
          />
          <small className="hint">Use: g=green, y=yellow, b=black/gray</small>
        </div>
        <button type="submit">Add Guess & Get Suggestion</button>
      </form>
      
      {suggestion && (
        <div className="suggestion">
          <h2>Suggested Word:</h2>
          <p className="suggested-word">{suggestion}</p>
          <div className="candidates">
            <h3>Possible Words ({candidates.length}):</h3>
            <div className="candidates-list">
              {candidates.map((word, index) => (
                <span key={index} className="candidate">{word}</span>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="error">
          {error}
        </div>
      )}
    </div>
  )
}

export default App;