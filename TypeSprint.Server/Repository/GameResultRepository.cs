using Microsoft.EntityFrameworkCore;
using TypeSprint.Server.Data;
using TypeSprint.Server.Models.DTOs;
using TypeSprint.Server.Models;
using TypeSprint.Server.Repository.Interfaces;

namespace TypeSprint.Server.Repository
{
    public class GameResultRepository : IGameResultRepository
    {
        private readonly ApplicationDbContext _context;

        public GameResultRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<GameResult>> GetAllGameResultsAsync()
        {
            return await _context.GameResults.ToListAsync();
        }

        public async Task<GameResult> GetGameResultByIdAsync(int id)
        {
            return await _context.GameResults.FindAsync(id);
        }

        public async Task AddGameResultAsync(GameResult gameResult)
        {
            _context.GameResults.Add(gameResult);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateGameResultAsync(GameResult gameResult)
        {
            _context.Entry(gameResult).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteGameResultAsync(int id)
        {
            var gameResult = await _context.GameResults.FindAsync(id);
            if (gameResult != null)
            {
                _context.GameResults.Remove(gameResult);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<GameResultDto>> GetLeaderboardAsync()
        {
            return await _context.GameResults
                .OrderByDescending(gr => gr.WordsPerMinute)
                .ThenBy(gr => gr.DatePlayed)
                .Take(10)
                .Select(gr => new GameResultDto
                {
                    GameResultId = gr.GameResultId,
                    UserId = gr.UserId,
                    WordsPerMinute = gr.WordsPerMinute,
                    Accuracy = gr.Accuracy,
                    DatePlayed = gr.DatePlayed,
                    Quote = new QuoteDto
                    {
                        QuoteId = gr.Quote.QuoteId,
                        QuoteText = gr.Quote.QuoteText,
                        SourceId = gr.Quote.SourceId,
                        Source = new SourceDto
                        {
                            SourceId = gr.Quote.Source.SourceId,
                            SourceName = gr.Quote.Source.SourceName,
                            SourceTypeId = gr.Quote.Source.SourceTypeId
                        }
                    }
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<GameResult>> GetUserGameResultsAsync(string userId)
        {
            return await _context.GameResults
                .Where(gr => gr.UserId == userId)
                .OrderBy(gr => gr.DatePlayed)
                .ToListAsync();
        }

        public async Task<bool> GameResultExistsAsync(int id)
        {
            return await _context.GameResults.AnyAsync(e => e.GameResultId == id);
        }

        public async Task<UserStatsDto> GetUserStatsAsync(string userId)
        {
            var results = await _context.GameResults
                .Where(gr => gr.UserId == userId)
                .OrderByDescending(gr => gr.DatePlayed)
                .ToListAsync();

            if (results.Count == 0)
            {
                return new UserStatsDto
                {
                    AverageWpm = 0,
                    TotalRaces = 0,
                    BestWpm = 0,
                    LastRaceWpm = 0,
                    LastTenRacesAverageWpm = 0
                };
            }

            var averageWpm = results.Average(gr => gr.WordsPerMinute);
            var bestWpm = results.Max(gr => gr.WordsPerMinute);
            var lastRaceWpm = results.FirstOrDefault()?.WordsPerMinute ?? 0;
            var lastTenRaces = results.Take(10).ToList();
            var lastTenRacesAverageWpm = lastTenRaces.Any() ? lastTenRaces.Average(gr => gr.WordsPerMinute) : 0;

            return new UserStatsDto
            {
                AverageWpm = averageWpm,
                TotalRaces = results.Count,
                BestWpm = bestWpm,
                LastRaceWpm = lastRaceWpm,
                LastTenRacesAverageWpm = lastTenRacesAverageWpm
            };


        }
    }
}
