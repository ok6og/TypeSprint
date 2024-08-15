import { FC } from 'react'
import { Quote } from './repository'
import './StatsDisplay.css'; // Import the CSS file for styling

interface StatsDisplayProps {
    quote: Quote
    endTime: number
    startTime: number
    numOfWords: number
    onClickNextQuote: () => void
}

const StatsDisplay: FC<StatsDisplayProps> = ({
    quote,
    startTime,
    endTime,
    numOfWords,
    onClickNextQuote,
}) => {
    const typeDurationInSeconds = (endTime - startTime) / 1000
    const wps = numOfWords / typeDurationInSeconds
    const wpm = Math.floor(wps * 60)

    return (
        <div className="stats-display">
            <h2>Stats</h2>
            <p><strong>Quote:</strong> {quote.quote}    <strong>Author:</strong> {quote.movieName}</p>
            
            <p><strong>Time:</strong> {typeDurationInSeconds.toFixed(2)} seconds</p>
            <p><strong>Words per Minute:</strong> {wpm}</p>
            <p><strong>Words per Second:</strong> {wps.toFixed(2)}</p>
            <button
                onClick={onClickNextQuote}
                id="next_quote_button"
                className="next-quote-button"
            >
                Next Quote
            </button>
        </div>
    )
}

export default StatsDisplay