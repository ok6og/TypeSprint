using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.RazorPages;
using TypeSprint.Server.Models;

namespace TypeSprint.Server.Data
{
    public class ApplicationUser : IdentityUser
    {
        public ICollection<GameResult> GameResults { get; set; }
    }
}
