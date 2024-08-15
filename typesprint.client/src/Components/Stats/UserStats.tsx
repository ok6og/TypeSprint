import { useEffect, useState } from 'react';
import { fetchUserStats, UserStatsDto } from '../Services/apiService'; // Adjust the path as needed
import './UserStats.css';

export function UserStats() {
    const [userStats, setUserStats] = useState<UserStatsDto | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadUserStats = async () => {
            try {
                const data = await fetchUserStats();
                setUserStats(data);
            } catch (err) {
                setError('Failed to load user stats');
                console.error('Error fetching user stats:', err);
            } finally {
                setLoading(false);
            }
        };

        loadUserStats();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="user-stats-container">
            <div className="user-stat-card">
                <h2>Average WPM</h2>
                <strong>{userStats?.averageWpm.toFixed(2)}</strong>
            </div>
            <div className="user-stat-card">
                <h2>Total Races</h2>
                <strong>{userStats?.totalRaces}</strong>
            </div>
            <div className="user-stat-card">
                <h2>Best WPM</h2>
                <strong>{userStats?.bestWpm}</strong>
            </div>
            <div className="user-stat-card">
                <h2>Last Race WPM</h2>
                <strong>{userStats?.lastRaceWpm}</strong>
            </div>
            <div className="user-stat-card">
                <h2>Last 10 Races Avg WPM</h2>
                <strong>{userStats?.lastTenRacesAverageWpm.toFixed(2)}</strong>
            </div>
        </div>
    );
}

export default UserStats
