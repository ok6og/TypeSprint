namespace TypeSprint.Server.Models.DTOs
{
    public class QuoteDto
    {
        public int QuoteId { get; set; }
        public string QuoteText { get; set; }
        public int? SourceId { get; set; }
        public SourceDto Source { get; set; }
        public int TimesUsed { get; set; }
    }
}
