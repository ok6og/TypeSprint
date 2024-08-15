import { useState } from 'react';
import './SourceManagementPage.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface SourceTypeCreateDto {
    typeName: string;
}

function AddSourceTypeComponent() {
    const [typeName, setTypeName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!typeName) {
            setError("Type Name is required.");
            return;
        }

        setIsSubmitting(true);
        setError(null); // Clear previous errors

        const newSourceType: SourceTypeCreateDto = {
            typeName
        };

        try {
            const response = await fetch(`${API_BASE_URL}/SourceTypes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSourceType),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Network response was not ok');
            }

            // Optionally, handle the response or reset the form
            setTypeName('');
        } catch (error) {
            setError(error.message || 'An error occurred while adding the source type.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h1>Add Source Type</h1>
            <form onSubmit={handleSubmit}>
                <div className="labels">
                    <div>
                        <label>
                            Type Name:
                            <input
                                type="text"
                                value={typeName}
                                onChange={(e) => setTypeName(e.target.value)}
                            />
                        </label>
                    </div>
                </div>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
}

export default AddSourceTypeComponent;
