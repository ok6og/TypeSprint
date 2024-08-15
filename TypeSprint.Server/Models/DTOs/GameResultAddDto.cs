using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using TypeSprint.Server.Data;

namespace TypeSprint.Server.Models.DTOs
{
    public class GameResultAddDto
    {
        public int GameResultId { get; set; }
        public string UserId { get; set; }
        public int WordsPerMinute { get; set; }
        public double Accuracy { get; set; }
        public DateTime DatePlayed { get; set; }
        public int QuoteId { get; set; }
    }
}
