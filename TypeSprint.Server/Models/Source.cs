namespace TypeSprint.Server.Models
{
    public class Source
    {
        public int SourceId { get; set; }
        public string SourceName { get; set; }
        public int SourceTypeId { get; set; }
        public SourceType SourceType { get; set; } // Navigation property
        public ICollection<Quote> Quotes { get; set; }
    }
}
