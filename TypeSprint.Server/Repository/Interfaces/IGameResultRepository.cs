using TypeSprint.Server.Models.DTOs;
using TypeSprint.Server.Models;

namespace TypeSprint.Server.Repository.Interfaces
{
    public interface IGameResultRepository
    {
        Task<IEnumerable<GameResult>> GetAllGameResultsAsync();
        Task<GameResult> GetGameResultByIdAsync(int id);
        Task AddGameResultAsync(GameResult gameResult);
        Task UpdateGameResultAsync(GameResult gameResult);
        Task DeleteGameResultAsync(int id);
        Task<IEnumerable<GameResultDto>> GetLeaderboardAsync();
        Task<IEnumerable<GameResult>> GetUserGameResultsAsync(string userId);
        Task<UserStatsDto> GetUserStatsAsync(string userId);
        Task<bool> GameResultExistsAsync(int id);
    }
}
