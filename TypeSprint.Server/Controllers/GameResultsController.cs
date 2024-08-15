using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TypeSprint.Server.Data;
using TypeSprint.Server.Models;
using TypeSprint.Server.Models.DTOs;

namespace TypeSprint.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GameResultsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public GameResultsController(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        // GET: api/GameResults
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GameResult>>> GetGameResults()
        {
            return await _context.GameResults.ToListAsync();
        }

        // GET: api/GameResults/5
        [HttpGet("{id}")]
        public async Task<ActionResult<GameResult>> GetGameResult(int id)
        {
            var gameResult = await _context.GameResults.FindAsync(id);

            if (gameResult == null)
            {
                return NotFound();
            }

            return gameResult;
        }

        // PUT: api/GameResults/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGameResult(int id, GameResult gameResult)
        {
            if (id != gameResult.GameResultId)
            {
                return BadRequest();
            }

            _context.Entry(gameResult).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GameResultExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/GameResults
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<GameResult>> PostGameResult([FromBody]GameResultAddDto gameResultDto)
        {

            var gameResult = new GameResult
            {
                WordsPerMinute = gameResultDto.WordsPerMinute,
                Accuracy = gameResultDto.Accuracy,
                DatePlayed = gameResultDto.DatePlayed,
                QuoteId = gameResultDto.QuoteId,
                UserId = gameResultDto.UserId
            };

            _context.GameResults.Add(gameResult);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetGameResult", new { id = gameResult.GameResultId }, gameResult);
        }

        // DELETE: api/GameResults/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGameResult(int id)
        {
            var gameResult = await _context.GameResults.FindAsync(id);
            if (gameResult == null)
            {
                return NotFound();
            }

            _context.GameResults.Remove(gameResult);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool GameResultExists(int id)
        {
            return _context.GameResults.Any(e => e.GameResultId == id);
        }


        [HttpGet("leaderboard")]
        public async Task<ActionResult<IEnumerable<GameResult>>> GetLeaderboard()
        {
            var leaderboard = await _context.GameResults
           .OrderByDescending(gr => gr.WordsPerMinute)
           .ThenBy(gr => gr.DatePlayed) // Optional: Break ties with the date
           .Take(10) // Limit to top 10 results
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

            return Ok(leaderboard);
        }

        [HttpGet("games")]
        public async Task<ActionResult<IEnumerable<GameResult>>> GetUserGameResults()
        {
            try
            {
                // Get the user ID from the HTTP context
                var userIdString = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

                var results = await _context.GameResults
                    .Where(gr => gr.UserId == userIdString)
                    .OrderBy(gr => gr.DatePlayed) // Sort by date
                    .ToListAsync();

                return Ok(results);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error fetching user game results: " + ex.Message);
                return StatusCode(500, "Failed to fetch user game results");
            }
        }

        [HttpGet("userStats")]
        public async Task<ActionResult<UserStatsDto>> GetUserStats()
        {
            try
            {
                var userIdString = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

                var results = await _context.GameResults
                    .Where(gr => gr.UserId == userIdString)
                    .OrderByDescending(gr => gr.DatePlayed)
                    .ToListAsync();

                if (results.Count == 0)
                {
                    return Ok(new UserStatsDto
                    {
                        AverageWpm = 0,
                        TotalRaces = 0,
                        BestWpm = 0,
                        LastRaceWpm = 0,
                        LastTenRacesAverageWpm = 0
                    });
                }

                var averageWpm = results.Average(gr => gr.WordsPerMinute);
                var bestWpm = results.Max(gr => gr.WordsPerMinute);
                var lastRaceWpm = results.FirstOrDefault()?.WordsPerMinute ?? 0;
                var lastTenRaces = results.Take(10).ToList();
                var lastTenRacesAverageWpm = lastTenRaces.Any() ? lastTenRaces.Average(gr => gr.WordsPerMinute) : 0;

                var userStats = new UserStatsDto
                {
                    AverageWpm = averageWpm,
                    TotalRaces = results.Count,
                    BestWpm = bestWpm,
                    LastRaceWpm = lastRaceWpm,
                    LastTenRacesAverageWpm = lastTenRacesAverageWpm
                };

                return Ok(userStats);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error fetching user stats: " + ex.Message);
                return StatusCode(500, "Failed to fetch user stats");
            }
        }
    }
}
