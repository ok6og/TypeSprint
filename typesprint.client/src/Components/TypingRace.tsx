// TypingRace.tsx
import './TypingRace.css';
import { useEffect, useMemo, useState } from "react";
import { Quote, randomQuote } from "./repository";
import StatsDisplay from "./StatsDisplay";
import { GameState } from "./gameState";

const inputId = "typeracer-input";


function TypingRace() {
    const [quote, setQuote] = useState<Quote>();
    const [text, setText] = useState<string>("");

    const [allTypedWords, setAllTypedWords] = useState<string>(""); // New state to track all typed words

    const [currentWord, setCurrentWord] = useState<string>();
    const quotesSplit = useMemo(() => quote?.quote.split(" ") ?? [], [quote]);
    const [wordIdx, setWordIdx] = useState<number>(0);

    const [startTime, setStartTime] = useState<number>(0);
    const [endTime, setEndTime] = useState<number>(0);

    const [gameState, setGameState] = useState(GameState.WAITING);

    const [countdown, setCountdown] = useState<number>(5); // New state for countdown

    const [isCountdownActive, setIsCountdownActive] = useState<boolean>(false); // Track if countdown is active

    const [elapsedTime, setElapsedTime] = useState<number>(0);


    const alreadyTypedWords = useMemo(
        () => quotesSplit.slice(0, wordIdx).join(" "),
        [quotesSplit, wordIdx]
    );
    const wordsToBeTyped = useMemo(
        () => quotesSplit.slice(wordIdx + 1, quotesSplit.length).join(" "),
        [quotesSplit, wordIdx]
    );

    const correctGreenWord = useMemo(() => {
        if (currentWord) {
            let i = 0;
            while (i < text.length) {
                if (text[i] !== currentWord[i]) {
                    break;
                }
                i++;
            }
            return text.slice(0, i); // return only the correct part
        }
        return "";
    }, [currentWord, text]);

    

    const wrongRedWord = useMemo(
        () =>
            currentWord?.slice(correctGreenWord.length, text.length),
        [correctGreenWord, currentWord, text]
    );


    useEffect(() => {
        setQuote(randomQuote());
    }, []);

    useEffect(() => {
        setWordIdx(0);
        setText('');
        setAllTypedWords(''); // Reset allTypedWords
    }, [quotesSplit]);

    useEffect(() => {
        setCurrentWord(quotesSplit[wordIdx]);
    }, [wordIdx, quotesSplit]);

    useEffect(() => {
        const latestLetter = text?.charAt(text.length - 1);
        if (latestLetter !== ' ' && wordIdx !== quotesSplit.length - 1) return;
        const textWithoutTrailingSpace = text?.replace(/\s*$/, "");
        if (textWithoutTrailingSpace === currentWord) {
            setAllTypedWords(prev => prev + ' ' + textWithoutTrailingSpace); // Append typed word
            setText('');
            setWordIdx(() => wordIdx + 1);
        }
    }, [text, currentWord, wordIdx, quotesSplit]);

    useEffect(() => {
        setGameState(GameState.PLAYING);
    }, []);

    useEffect(() => {
        if (gameState === GameState.PLAYING) {
            document.getElementById(inputId)?.focus();
            setQuote(randomQuote());
            setStartTime(Date.now());
        }
        if (gameState === GameState.VIEW_STATS) {
            setEndTime(Date.now());
        }
    }, [gameState]);

    useEffect(() => {
        const quoteFinished =
            quotesSplit.length === wordIdx && quotesSplit.length !== 0;
        if (quoteFinished) {
            setGameState(GameState.VIEW_STATS);
        }
    }, [wordIdx, quotesSplit]);

    // Countdown effect

    useEffect(() => {

        let timer: NodeJS.Timeout;

        if (isCountdownActive) {

            if (countdown > 0) {

                timer = setTimeout(() => setCountdown(countdown - 1), 1000);

            } else {

                setGameState(GameState.PLAYING);
                setText(''); // Clear text for the new quote

                setIsCountdownActive(false); // Stop countdown
                document.getElementById(inputId)?.focus(); // Focus input after countdown
            }

        }

        return () => clearTimeout(timer); // Cleanup

    }, [countdown, isCountdownActive]);

    // Elapsed time effect
    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (gameState === GameState.PLAYING) {
            timer = setInterval(() => {
                setElapsedTime((prevTime) => (Date.now() - startTime) / 1000);
            }, 1000);
        }

        return () => clearInterval(timer);
    }, [gameState, startTime]);

    const calculateWPM = () => {
        if (startTime === 0) return 0;

        const elapsedSeconds = (Date.now() - startTime) / 1000;

        if (elapsedSeconds <= 0 || allTypedWords.length === 0) return 0;

        const wordsTyped = allTypedWords.trim().split(/\s+/).length;

        const wps = wordsTyped / elapsedSeconds;
        return Math.floor(wps * 60);
    };
   

    const nextQuote = () => {
        setQuote(undefined);  // Temporarily clear the quote while resetting
        setCountdown(5); // Reset countdown
        setIsCountdownActive(true); // Activate countdown
        setGameState(GameState.WAITING); // Set game state to WAITING until countdown finishes
        setElapsedTime(0);
    };

    return (
        <div className="typeracer-container">
            <div className="headingLol">
                <div className="elapsed-time">Elapsed Time: {elapsedTime.toFixed(0)}s</div>
                <h1 className="typeracer-heading">Typeracer</h1>
            </div>
            
            <p className="typeracer-text">
                <span className="green-typed">{alreadyTypedWords} {correctGreenWord}</span>
                <span className="red-text">{wrongRedWord}</span>
                <span className="current-word">{currentWord?.slice(text.length)}</span>
                <span className="to-be-typed"> {wordsToBeTyped}</span>
            </p>
            <input
                className="typeracer-input"
                onChange={(text) => setText(text.target.value)}
                value={text}
                disabled={isCountdownActive || gameState === GameState.VIEW_STATS}
                id={inputId}
            />
            {quote && gameState === GameState.VIEW_STATS &&(
                <StatsDisplay
                    startTime={startTime}
                    endTime={endTime}
                    quote={quote}
                    numOfWords={quotesSplit.length}
                    onClickNextQuote={nextQuote}
                />
            )}
            {isCountdownActive && <p className="countdown-text">Get ready! Starting in {countdown}...</p>}

            {gameState === GameState.PLAYING && (
                <p className="playing-text">Words per minute: {calculateWPM()}</p>
            )}
        </div>
    );
}

export default TypingRace;
