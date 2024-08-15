namespace TypeSprint.Server.Models.DTOs
{
    public class SourceCreateDto
    {
        public string SourceName { get; set; }
        public int SourceTypeId { get; set; } // Only the ID is needed when creating
    }
}
