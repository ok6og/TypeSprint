namespace TypeSprint.Server.Models
{
    public class SourceType
    {
        public int SourceTypeId { get; set; }
        public string TypeName { get; set; } // e.g., 'Movie', 'Game', 'Book'
        public ICollection<Source> Sources { get; set; }
    }
}
