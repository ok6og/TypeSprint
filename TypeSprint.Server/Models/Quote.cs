namespace TypeSprint.Server.Models
{
    public class Quote
    {
        public int QuoteId { get; set; }
        public string QuoteText { get; set; }
        public string MovieName { get; set; }

        // Optional: Track how many times a quote has been used
        public int TimesUsed { get; set; }
    }
}
