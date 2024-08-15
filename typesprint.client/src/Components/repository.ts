const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type Quote = {
    quoteId: number;
    quoteText: string;
    sourceId?: number | null;
    source?: {
        sourceId: number;
        sourceName: string;
    } | null;
    timesUsed: number;
};

export const randomQuote = async (): Promise<Quote> => {
    const response = await fetch(`${API_BASE_URL}/Quotes/random`);
    if (!response.ok) {
        throw new Error("Failed to fetch quote");
    }
    const data: Quote = await response.json();
    return data;
};


    