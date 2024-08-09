// TypingRace.tsx
import './TypingRace.css';
import { useEffect, useMemo, useState } from "react";
import { Quote, randomQuote } from "./repository"
import StatsDisplay from "./StatsDisplay";
import { GameState } from "./gameState";

const inputId = "typeracer-input";


function TypingRace() {
    const [quote, setQuote] = useState<Quote>();
    const [text, setText] = useState<string>("");
    const [currentWord, setCurrentWord] = useState<string>();
    const quotesSplit = useMemo(() => quote?.quote.split(" ") ?? [], [quote]);
    const [wordIdx, setWordIdx] = useState<number>(0);

    const [startTime, setStartTime] = useState<number>(0)
    const [endTime, setEndTime] = useState<number>(0)

    const [gameState, setGameState] = useState(GameState.WAITING);

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
                if (text[i] != currentWord[i]) {
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
            currentWord?.slice(
                correctGreenWord.length,
                text.length
            ),
        [correctGreenWord, currentWord, text]
    );


    useEffect(() => {
        setQuote(randomQuote());
    }, []);

    useEffect(() => {
        setWordIdx(0)
        setText('')
    }, [quotesSplit])

    useEffect(() => {
        setCurrentWord(quotesSplit[wordIdx])
    }, [wordIdx, quotesSplit])

    useEffect(() => {
        const latestLetter = text?.charAt(text.length - 1)
        if (latestLetter != ' ' && wordIdx != quotesSplit.length - 1) return
        const textWithoutTrailingSpace = text?.replace(/\s*$/, "");
        if (textWithoutTrailingSpace == currentWord) {
            setText('')
            setWordIdx(() => wordIdx + 1)
        }
    }, [text, currentWord, wordIdx, quotesSplit])

    useEffect(() => {
        setGameState(GameState.PLAYING);
    }, []);

    useEffect(() => {
        if (gameState == GameState.PLAYING) {
            document.getElementById(inputId)?.focus();
            setQuote(randomQuote());
            setStartTime(Date.now());
        }
        if (gameState == GameState.VIEW_STATS) {
            setEndTime(Date.now());
        }
    }, [gameState]);

    useEffect(() => {
        const quoteFinished =
            quotesSplit.length == wordIdx && quotesSplit.length != 0;
        if (quoteFinished) {
            setGameState(GameState.VIEW_STATS);
        }
    }, [wordIdx, quotesSplit]);

    const nextQuote = () => {
        setGameState(GameState.PLAYING);
    };

    return (
        <div className="typeracer-container">
            <h1 className="typeracer-heading">Typeracer</h1>
            <p className="typeracer-text">
                <span className="green-typed">{alreadyTypedWords} {correctGreenWord}</span>
                <span className="red-text">{wrongRedWord}</span>
                <span className="current-word">{currentWord?.slice(text.length)}</span>
                <span className="to-be-typed"> {wordsToBeTyped}</span>
            </p>
            <input className="typeracer-input" onChange={(text) => setText(text.target.value)} value={text} disabled={gameState == GameState.VIEW_STATS} id={inputId} />
            {quote && gameState == GameState.VIEW_STATS &&(
                <StatsDisplay
                    startTime={startTime}
                    endTime={endTime}
                    quote={quote}
                    numOfWords={quotesSplit.length}
                    onClickNextQuote={nextQuote}
                />
            )}
        </div>
    );
}

export default TypingRace;
