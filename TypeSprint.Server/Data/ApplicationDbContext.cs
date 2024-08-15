using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;
using TypeSprint.Server.Models;

namespace TypeSprint.Server.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<GameResult> GameResults { get; set; }
        public DbSet<Quote> Quotes { get; set; }
        public DbSet<Source> Sources { get; set; }
        public DbSet<SourceType> SourceTypes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Quote>()
            .HasOne(q => q.Source)
            .WithMany(s => s.Quotes)
            .HasForeignKey(q => q.SourceId);

            modelBuilder.Entity<Source>()
                .HasOne(s => s.SourceType)
                .WithMany(st => st.Sources)
                .HasForeignKey(s => s.SourceTypeId);
        }
    }
}
