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
using TypeSprint.Server.Repository;
using TypeSprint.Server.Repository.Interfaces;

namespace TypeSprint.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GameResultsController : ControllerBase
    {
        private readonly IGameResultRepository _gameResultRepository;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public GameResultsController(IGameResultRepository gameResultRepository, IHttpContextAccessor httpContextAccessor)
        {
            _gameResultRepository = gameResultRepository;
            _httpContextAccessor = httpContextAccessor;
        }

        // GET: api/GameResults
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GameResult>>> GetGameResults()
        {
            var results = await _gameResultRepository.GetAllGameResultsAsync();
            return Ok(results);
        }

        // GET: api/GameResults/5
        [HttpGet("{id}")]
        public async Task<ActionResult<GameResult>> GetGameResult(int id)
        {
            var gameResult = await _gameResultRepository.GetGameResultByIdAsync(id);

            if (gameResult == null)
            {
                return NotFound();
            }

            return Ok(gameResult);
        }

        // PUT: api/GameResults/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGameResult(int id, GameResult gameResult)
        {
            if (id != gameResult.GameResultId)
            {
                return BadRequest();
            }

            try
            {
                await _gameResultRepository.UpdateGameResultAsync(gameResult);
            }
            catch (Exception ex)
            {
                if (!await _gameResultRepository.GameResultExistsAsync(id))
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

            await _gameResultRepository.AddGameResultAsync(gameResult);

            return CreatedAtAction("GetGameResult", new { id = gameResult.GameResultId }, gameResult);
        }

        // DELETE: api/GameResults/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGameResult(int id)
        {
            if (!await _gameResultRepository.GameResultExistsAsync(id))
            {
                return NotFound();
            }

            await _gameResultRepository.DeleteGameResultAsync(id);
            return NoContent();
        }


        [HttpGet("leaderboard")]
        public async Task<ActionResult<IEnumerable<GameResult>>> GetLeaderboard()
        {
            var leaderboard = await _gameResultRepository.GetLeaderboardAsync();
            return Ok(leaderboard);
        }

        [HttpGet("games")]
        public async Task<ActionResult<IEnumerable<GameResult>>> GetUserGameResults()
        {
            try
            {
                var userIdString = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
                var results = await _gameResultRepository.GetUserGameResultsAsync(userIdString);
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
                var userStats = await _gameResultRepository.GetUserStatsAsync(userIdString);
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
