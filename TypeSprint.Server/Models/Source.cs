namespace TypeSprint.Server.Models
{
    public class Source
    {
        public int SourceId { get; set; }
        public string SourceName { get; set; }
        public int SourceTypeId { get; set; }
        public SourceType SourceType { get; set; }
        public ICollection<Quote> Quotes { get; set; }
    }
}
