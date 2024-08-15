import AddQuoteComponent from '../Components/QuotesSources/AddQuoteComponent'
function QuoteManagementPage() {
    return (
        <div className="quote-management-page">
            <header>
                <h1>Quote Management</h1>
            </header>
            <main>
                <AddQuoteComponent />
            </main>
        </div>
    );
}

export default QuoteManagementPage;
