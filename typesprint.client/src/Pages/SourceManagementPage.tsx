import AddSourceComponent from '../Components/QuotesSources/AddSourceComponent';
import AddSourceTypeComponent from '../Components/QuotesSources/AddSourceTypeComponent';

function SourceManagementPage() {
    return (
        <div className="source-management-container">
            <div className="source-management-section">
                <h2>Add Source</h2>
                <AddSourceComponent />
            </div>
            <div className="source-management-section">
                <h2>Source Types</h2>
                <AddSourceTypeComponent />
            </div>
        </div>
    );
}
export default SourceManagementPage;
