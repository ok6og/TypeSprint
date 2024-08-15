import AddSourceComponent from '../Components/QuotesSources/AddSourceComponent';
import AddSourceTypeComponent from '../Components/QuotesSources/AddSourceTypeComponent';

function SourceManagementPage() {
    return (
        <div className="source-management-container">
            <div className="source-management-section">
                <AddSourceComponent />
            </div>
            <div className="source-management-section">
                <AddSourceTypeComponent />
            </div>
        </div>
    );
}
export default SourceManagementPage;
