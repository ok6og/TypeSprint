using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using TypeSprint.Server.Data;

namespace TypeSprint.Server.Models
{
    public class GameResult
    {
        public int GameResultId { get; set; }
        public string UserId { get; set; }
        public int WordsPerMinute { get; set; }
        public double Accuracy { get; set; }
        public DateTime DatePlayed { get; set; }

        // Foreign Key to Quote
        public int QuoteId { get; set; }
        public Quote Quote { get; set; }

        // Navigation property
        [ValidateNever]
        public ApplicationUser User { get; set; }
    }
}
