import { useEffect, useState } from 'react';
import './SourceManagementPage.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
interface SourceType {
    sourceTypeId: number;
    typeName: string;
}

interface SourceCreateDto {
    sourceName: string;
    sourceTypeId: number;
}

function AddSourceComponent() {
    const [sourceTypes, setSourceTypes] = useState<SourceType[]>([]);
    const [selectedSourceType, setSelectedSourceType] = useState<number | undefined>(undefined);
    const [sourceName, setSourceName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        async function fetchSourceTypes() {
            const response = await fetch(`${API_BASE_URL}/SourceTypes`);
            const data = await response.json();
            setSourceTypes(data);
        }

        fetchSourceTypes();
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!sourceName || selectedSourceType === undefined) return;

        setIsSubmitting(true);

        const newSource: SourceCreateDto = {
            sourceName,
            sourceTypeId: selectedSourceType
        };

        try {
            const response = await fetch(`${API_BASE_URL}/Sources`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSource),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Optionally, handle the response or reset the form
            setSourceName('');
            setSelectedSourceType(undefined);
        } catch (error) {
            console.error('Error adding source:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h1>Add Source</h1>
            <form onSubmit={handleSubmit}>
                <div className="labels">
                    <div>
                        <label>
                            Source Name:
                            <input
                                type="text"
                                value={sourceName}
                                onChange={(e) => setSourceName(e.target.value)}
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
                </div>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
            </form>
        </div>
    );
}

export default AddSourceComponent;
