import { Quote } from '../Services/repository';
import './StatsDisplay.css';

interface StatsDisplayProps {
    quote: Quote;
    endTime: number;
    startTime: number;
    numOfWords: number;
    accuracy: number;
    onClickNextQuote: () => void;
}

function StatsDisplay({
    quote,
    startTime,
    endTime,
    numOfWords,
    accuracy,
    onClickNextQuote,
}: StatsDisplayProps) {
    const typeDurationInSeconds = (endTime - startTime) / 1000;
    const wps = numOfWords / typeDurationInSeconds;
    const wpm = Math.floor(wps * 60);

    return (
        <div className="stats-display">
            <div className="stats">
            
            <h2>Stats</h2>
            <p><strong>Quote:</strong> {quote.quoteText} </p>
            <p><strong>Author:</strong> {quote.source?.sourceName}</p>
            <p><strong>Time:</strong> {typeDurationInSeconds.toFixed(2)} seconds</p>
            <p><strong>Words per Minute:</strong> {wpm}</p>
            <p><strong>Words per Second:</strong> {wps.toFixed(2)}</p>
            <p><strong>Accuracy:</strong> {accuracy.toFixed(2)}%</p>
            </div>
            <button
                onClick={onClickNextQuote}
                id="next_quote_button"
                className="next-quote-button"
            >
                Next Quote
            </button>
        </div>

       

    );
}

export default StatsDisplay;
