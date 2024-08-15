import AddSourceComponent from '../Components/AddSourceComponent';
import AddSourceTypeComponent from '../Components/AddSourceTypeComponent';
/*import './SourceManagementPage.css'; // Import CSS for styling*/

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

// Placeholder component for Source Types
//function PlaceholderSourceTypeComponent() {
//    return (
//        <div className="placeholder">
//            <p>This is where the source types will besdfsdf displayed.</p>
//            <p>Currently, this section is under development.</p>
//        </div>
//    );
//}

export default SourceManagementPage;
