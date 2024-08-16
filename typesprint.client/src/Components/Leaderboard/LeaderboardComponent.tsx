import { useEffect, useState } from 'react';
import { fetchLeaderboard, GameResultDto } from '../Services/apiService';
import './Leaderboard.css';

function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState<GameResultDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadLeaderboard() {
            try {
                const data = await fetchLeaderboard();
                setLeaderboard(data);
            } catch (err) {
                setError('Failed to load leaderboard');
                console.error('Error fetching leaderboard:', err);
            } finally {
                setLoading(false);
            }
        }

        loadLeaderboard();


        //PROBABLY SHOULD CHANGE
        const intervalId = setInterval(() => {
            loadLeaderboard();
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="leaderboard-container">
            <h1>Leaderboard</h1>
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>User ID</th>
                        <th>Words Per Minute</th>
                        <th>Accuracy</th>
                        <th>Date Played</th>
                        <th>Quote</th>
                    </tr>
                </thead>
                <tbody>
                    {leaderboard.map((result, index) => (
                        <tr key={result.gameResultId}>
                            <td>{index + 1}</td>
                            <td>{result.userId}</td>
                            <td>{result.wordsPerMinute}</td>
                            <td>{result.accuracy.toFixed(2)}%</td>
                            <td>{new Date(result.datePlayed).toLocaleString()}</td>
                            <td>"{result.quote.quoteText}"</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Leaderboard;
