import { useEffect, useState } from 'react';
import './QuoteManagement.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface SourceType {
    sourceTypeId: number;
    typeName: string;
}

interface Source {
    sourceId: number;
    sourceName: string;
}

interface QuoteCreateDto {
    quoteText: string;
    sourceId: number;
}

function AddQuoteComponent() {
    const [sourceTypes, setSourceTypes] = useState<SourceType[]>([]);
    const [sources, setSources] = useState<Source[]>([]);
    const [selectedSourceType, setSelectedSourceType] = useState<number | undefined>(undefined);
    const [selectedSource, setSelectedSource] = useState<number | undefined>(undefined);
    const [quoteText, setQuoteText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        async function fetchSourceTypes() {
            const response = await fetch(`${API_BASE_URL}/SourceTypes`);
            const data = await response.json();
            setSourceTypes(data);
        }

        fetchSourceTypes();
    }, []);

    useEffect(() => {
        if (selectedSourceType !== undefined) {
            async function fetchSources() {
                const response = await fetch(`${API_BASE_URL}/Sources?sourceTypeId=${selectedSourceType}`);
                const data = await response.json();
                setSources(data);
            }

            fetchSources();
        } else {
            setSources([]);
        }
    }, [selectedSourceType]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!quoteText || selectedSource === undefined) return;

        setIsSubmitting(true);

        const newQuote: QuoteCreateDto = {
            quoteText,
            sourceId: selectedSource
        };

        try {
            const response = await fetch(`${API_BASE_URL}/Quotes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newQuote),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Optionally, handle the response or reset the form
            setQuoteText('');
            setSelectedSourceType(undefined);
            setSelectedSource(undefined);
        } catch (error) {
            console.error('Error adding quote:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h1>Add Quote</h1>
            <form onSubmit={handleSubmit}>
                <div className="labels">
                    <div>
                        <label>
                            Quote Text:
                            {/*<input*/}
                            {/*    type="text"*/}
                            {/*    value={quoteText}*/}
                            {/*    onChange={(e) => setQuoteText(e.target.value)}*/}
                            {/*/>*/}
                            <textarea
                                value={quoteText}
                                onChange={(e) => setQuoteText(e.target.value)}
                                rows={4} // Adjust rows as needed
                                cols={50} // Adjust cols as needed
                                style={{ resize: 'vertical' }} // Allows vertical resizing
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Source Type:
                            <select
                                value={selectedSourceType}
                                onChange={(e) => setSelectedSourceType(Number(e.target.value))}
                            >
                                <option value="">Select a source type</option>
                                {sourceTypes.map(type => (
                                    <option key={type.sourceTypeId} value={type.sourceTypeId}>
                                        {type.typeName}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <div>
                        <label>
                            Source:
                            <select
                                value={selectedSource}
                                onChange={(e) => setSelectedSource(Number(e.target.value))}
                                disabled={selectedSourceType === undefined}
                            >
                                <option value="">Select a source</option>
                                {sources.map(source => (
                                    <option key={source.sourceId} value={source.sourceId}>
                                        {source.sourceName}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                </div>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
            </form>
        </div>
    );
}

export default AddQuoteComponent;
