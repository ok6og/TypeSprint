using Elfie.Serialization;

namespace TypeSprint.Server.Models
{
    public class Quote
    {
        public int QuoteId { get; set; }
        public string QuoteText { get; set; }
        public int? SourceId { get; set; }
        public Source Source { get; set; }

        // Optional: Track how many times a quote has been used
        public int TimesUsed { get; set; }
    }
}
