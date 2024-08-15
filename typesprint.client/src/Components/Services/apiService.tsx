// src/apiService.ts

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface UserStatsDto {
    averageWpm: number;
    totalRaces: number;
    bestWpm: number;
    lastRaceWpm: number;
    lastTenRacesAverageWpm: number;
}
interface GameResult {
    userId: string;
    wordsPerMinute: number;
    accuracy: number;
    datePlayed: string;
    quoteId: number;
}

export interface QuoteDto {
    quoteId: number;
    quoteText: string;
    sourceId: number;
    source: SourceDto;
}

export interface SourceDto {
    sourceId: number;
    sourceName: string;
    sourceTypeId: number;
}

export interface GameResultDto {
    gameResultId: number;
    userId: string;
    wordsPerMinute: number;
    accuracy: number;
    datePlayed: string;
    quote: QuoteDto;
}

export const fetchUserGameResults = async (): Promise<GameResultDto[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/gameResults/games`, {
            method: 'GET',
            credentials: 'include'
        });

        if (response.ok) {
            return response.json();
        } else {
            console.error("Failed to fetch user game results:", response.statusText);
            return [];
        }
    } catch (error) {
        console.error("Error fetching user game results:", error);
        return [];
    }
};

export const fetchLeaderboard = async (): Promise<GameResultDto[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/gameResults/leaderboard`, {
            method: 'GET',
            credentials: 'include' 
        });
        if (response.ok) {
            return response.json();
        } else {
            console.error("Failed to fetch leaderboard:", response.statusText);
            return [];
        }
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return [];
    }
};

export const saveGameResult = async (gameResult: GameResult) => {
    try {
        const response = await fetch(`${API_BASE_URL}/gameResults`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(gameResult),
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to save game result');
        }
    } catch (error) {
        console.error("Error saving game result:", error);
    }
};

export const fetchCurrentUserId = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/user/currentId`,{
            method: 'GET',
            credentials: 'include'
        });
        if (response.ok) {
            const data = await response.json();
            return data.userId;
        } else {
            console.error("Failed to fetch user ID:", response.statusText);
            return null;
        }
    } catch (error) {
        console.error("Error fetching user ID:", error);
        return null;
    }
};

export const fetchUserStats = async (): Promise<UserStatsDto> => {
    try {
        const response = await fetch(`${API_BASE_URL}/gameResults/userStats`, {
            method: 'GET',
            credentials: 'include'
        });
        if (response.ok) {
            return response.json();
        } else {
            console.error("Failed to fetch user stats:", response.statusText);
            return {
                averageWpm: 0,
                totalRaces: 0,
                bestWpm: 0,
                lastRaceWpm: 0,
                lastTenRacesAverageWpm: 0
            };
        }
    } catch (error) {
        console.error("Error fetching user stats:", error);
        return {
            averageWpm: 0,
            totalRaces: 0,
            bestWpm: 0,
            lastRaceWpm: 0,
            lastTenRacesAverageWpm: 0
        };
    }
};