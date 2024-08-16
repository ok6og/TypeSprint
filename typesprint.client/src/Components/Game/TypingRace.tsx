// TypingRace.tsx
import './TypingRace.css';
import { useEffect, useMemo, useState } from "react";
import { Quote, randomQuote } from "../Services/repository";
import StatsDisplay from "../Stats/StatsDisplay";
import { GameState } from "./gameState";
import { fetchCurrentUserId, saveGameResult } from '../Services/apiService';

const inputId = "typeracer-input";

function TypingRace() {
    const [quote, setQuote] = useState<Quote>();
    const [text, setText] = useState<string>("");
    const [allTypedWords, setAllTypedWords] = useState<string>("");
    const [currentWord, setCurrentWord] = useState<string>();
    const quotesSplit = useMemo(() => quote?.quoteText.split(" ") ?? [], [quote]);
    const [wordIdx, setWordIdx] = useState<number>(0);
    const [startTime, setStartTime] = useState<number>(0);
    const [endTime, setEndTime] = useState<number>(0);
    const [gameState, setGameState] = useState(GameState.WAITING);
    const [countdown, setCountdown] = useState<number>(5);
    const [isCountdownActive, setIsCountdownActive] = useState<boolean>(true);
    const [elapsedTime, setElapsedTime] = useState<number>(0);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        const getUserId = async () => {
            const userId = await fetchCurrentUserId();
            setCurrentUserId(userId);
        };
        getUserId();
        fetchRandomQuote();
    }, []);

    const fetchRandomQuote = async () => {
        try {
            const data = await randomQuote();
            setQuote(data);
        } catch (error) {
            console.error("Error fetching quote:", error);
        }
    };

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
            return text.slice(0, i);
        }
        return "";
    }, [currentWord, text]);
    
    const wrongRedWord = useMemo(
        () => currentWord?.slice(correctGreenWord.length, text.length),
        [correctGreenWord, currentWord, text]
    );

    useEffect(() => {
        setWordIdx(0);
        setText('');
        setAllTypedWords('');
        setTotalKeystrokes(0);
    }, [quotesSplit]);

    useEffect(() => {
        setCurrentWord(quotesSplit[wordIdx]);
    }, [wordIdx, quotesSplit]);

    useEffect(() => {
        const latestLetter = text?.charAt(text.length - 1);
        if (latestLetter !== ' ' && wordIdx !== quotesSplit.length - 1) return;
        const textWithoutTrailingSpace = text?.replace(/\s*$/, "");
        if (textWithoutTrailingSpace === currentWord) {
            setAllTypedWords(prev => prev + ' ' + textWithoutTrailingSpace);
            setText('');
            setWordIdx(() => wordIdx + 1);
        }
    }, [text, currentWord, wordIdx, quotesSplit]);

    useEffect(() => {
        if (gameState === GameState.PLAYING) {
            document.getElementById(inputId)?.focus();
            setStartTime(Date.now());
        }
        if (gameState === GameState.VIEW_STATS) {
            setEndTime(Date.now());         
        }
    }, [gameState]);

    useEffect(() => {
        if (quotesSplit.length === wordIdx && quotesSplit.length !== 0) {
            setGameState(GameState.VIEW_STATS);
        }
    }, [wordIdx, quotesSplit]);

    useEffect(() => {

        let timer: NodeJS.Timeout;
        if (isCountdownActive) {
            if (countdown > 0) {
                timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            } else {
                setGameState(GameState.PLAYING);
                setText('');
                setIsCountdownActive(false);
                document.getElementById(inputId)?.focus();
            }
        }
        return () => clearTimeout(timer);

    }, [countdown, isCountdownActive]);

    // Elapsed time effect
    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (gameState === GameState.PLAYING) {
            timer = setInterval(() => {
                setElapsedTime((Date.now() - startTime) / 1000);
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

    const handleSaveGameResult = async () => {
        if (!currentUserId) return;

        const localDate = new Date();
        localDate.setHours(localDate.getHours() + 3);

        const gameResult = {
            userId: currentUserId,
            wordsPerMinute: calculateWPM(),
            accuracy: calculateAccuracy(),
            datePlayed: localDate.toISOString(),
            quoteId: quote?.quoteId || 0
        };

        await saveGameResult(gameResult);
    };

    const nextQuote = async () => {
        setQuote(undefined);
        setCountdown(5);
        try {
            const data = await randomQuote();
            setQuote(data);
        } catch (error) {
            console.error("Error fetching new quote:", error);
        }
        setIsCountdownActive(true);
        setGameState(GameState.WAITING);
        setElapsedTime(0);
    };

    useEffect(() => {
        if (gameState === GameState.VIEW_STATS) {
            handleSaveGameResult();
        }
    }, [gameState]);

    const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
        setTotalKeystrokes(prev => prev + 1);
    };

    const calculateAccuracy = () => {
        if (quote && totalKeystrokes > 0) {
            const quoteLength = quote.quoteText.length;
            return Math.max(0, Math.min(100, (quoteLength / totalKeystrokes) * 100));
        }
        return 0;
    };

    return (
        <div className="typeracer-container">
            <div className="headingLol">
                <div className="elapsed-time">Elapsed Time: {elapsedTime.toFixed(0)}s</div>
                <h1 className="typeracer-heading">TypeSprint</h1>
            </div>
            
            <p className="typeracer-text">
                <span className="green-typed">{alreadyTypedWords} {correctGreenWord}</span>
                <span className="red-text">{wrongRedWord}</span>
                <span className="current-word">{currentWord?.slice(text.length)}</span>
                <span className="to-be-typed"> {wordsToBeTyped}</span>
            </p>
            <input
                className="typeracer-input"
                onChange={handleChange}
                value={text}
                disabled={isCountdownActive || gameState === GameState.VIEW_STATS}
                id={inputId}
            />
            {quote && gameState === GameState.VIEW_STATS &&(
                <StatsDisplay
                    startTime={startTime}
                    endTime={endTime}
                    accuracy={calculateAccuracy()}
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
