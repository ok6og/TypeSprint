namespace TypeSprint.Server.Models.DTOs
{
    public class SourceDto
    {
        public int SourceId { get; set; }
        public string SourceName { get; set; }
        public int SourceTypeId { get; set; }
        public SourceTypeDto SourceType { get; set; }
    }
}
