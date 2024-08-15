import { useEffect, useState } from 'react';
/*import { Line } from 'react-chartjs-2';*/
import 'chart.js/auto'; // Required for Chart.js to work
import { fetchUserGameResults, GameResultDto } from './apiService';
import './UserProgress.css';

export function UserProgress() {
    const [gameResults, setGameResults] = useState<GameResultDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const results = await fetchUserGameResults();
                // Sort results by date
                results.sort((a, b) => new Date(a.datePlayed).getTime() - new Date(b.datePlayed).getTime());
                setGameResults(results);
            } catch (err) {
                setError("Failed to load game results");
                console.error("Error fetching game results:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    // Prepare data for the chart
    const chartData = {
        labels: gameResults.map(result => new Date(result.datePlayed).toLocaleDateString()),
        datasets: [
            {
                label: 'Words Per Minute',
                data: gameResults.map(result => result.wordsPerMinute),
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                fill: true,
            }
        ],
    };

    // Configure the chart options
    const chartOptions = {
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'Words Per Minute',
                },
                beginAtZero: true,
            },
            x: {
                title: {
                    display: true,
                    text: 'Date',
                },
            },
        },
    };

    return (
        <div className="user-progress-container">
            <h1>Your Progress</h1>
            <Line data={chartData} options={chartOptions} />
        </div>
    );
}
