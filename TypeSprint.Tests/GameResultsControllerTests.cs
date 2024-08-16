using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using TypeSprint.Server.Controllers;
using TypeSprint.Server.Models;
using TypeSprint.Server.Models.DTOs;
using TypeSprint.Server.Repository.Interfaces;

namespace TypeSprint.Tests
{
    public class GameResultsControllerTests
    {

        private readonly Mock<IGameResultRepository> _mockRepo;
        private readonly Mock<IHttpContextAccessor> _mockHttpContextAccessor;
        private readonly GameResultsController _controller;


        public GameResultsControllerTests()
        {
            _mockRepo = new Mock<IGameResultRepository>();
            _mockHttpContextAccessor = new Mock<IHttpContextAccessor>();
            _controller = new GameResultsController(_mockRepo.Object, _mockHttpContextAccessor.Object);
        }


        [Fact]
        public async Task GetGameResults_ReturnsOkResult_WithListOfGameResults()
        {
            // Setup
            var gameResults = new List<GameResult>
            {
                new GameResult { GameResultId = 1, WordsPerMinute = 100, Accuracy = 95 },
                new GameResult { GameResultId = 2, WordsPerMinute = 110, Accuracy = 97 }
            };
            _mockRepo.Setup(repo => repo.GetAllGameResultsAsync()).ReturnsAsync(gameResults);

            // Act
            var result = await _controller.GetGameResults();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<List<GameResult>>(okResult.Value);
            Assert.Equal(2, returnValue.Count);
        }

        [Fact]
        public async Task GetGameResult_ReturnsNotFound_WhenGameResultDoesNotExist()
        {
            // Arrange
            _mockRepo.Setup(repo => repo.GetGameResultByIdAsync(1)).ReturnsAsync((GameResult)null);

            // Act
            var result = await _controller.GetGameResult(1);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task GetGameResult_ReturnsOkResult_WithGameResult()
        {
            // Arrange
            var gameResult = new GameResult { GameResultId = 1, WordsPerMinute = 100, Accuracy = 95 };
            _mockRepo.Setup(repo => repo.GetGameResultByIdAsync(1)).ReturnsAsync(gameResult);

            // Act
            var result = await _controller.GetGameResult(1);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<GameResult>(okResult.Value);
            Assert.Equal(100, returnValue.WordsPerMinute);
        }

        [Fact]
        public async Task PostGameResult_ReturnsCreatedAtActionResult_WithGameResult()
        {
            // Arrange
            var gameResultDto = new GameResultAddDto { WordsPerMinute = 100, Accuracy = 95, DatePlayed = System.DateTime.UtcNow, QuoteId = 1, UserId = "userId" };
            var gameResult = new GameResult { GameResultId = 1, WordsPerMinute = 100, Accuracy = 95, DatePlayed = gameResultDto.DatePlayed, QuoteId = 1, UserId = "userId" };

            _mockRepo.Setup(repo => repo.AddGameResultAsync(It.IsAny<GameResult>())).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.PostGameResult(gameResultDto);

            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returnValue = Assert.IsType<GameResult>(createdAtActionResult.Value);
            Assert.Equal(gameResult.WordsPerMinute, returnValue.WordsPerMinute);
        }

        [Fact]
        public async Task DeleteGameResult_ReturnsNoContent_WhenGameResultExists()
        {
            // Arrange
            _mockRepo.Setup(repo => repo.GameResultExistsAsync(1)).ReturnsAsync(true);
            _mockRepo.Setup(repo => repo.DeleteGameResultAsync(1)).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.DeleteGameResult(1);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task DeleteGameResult_ReturnsNotFound_WhenGameResultDoesNotExist()
        {
            // Arrange
            _mockRepo.Setup(repo => repo.GameResultExistsAsync(1)).ReturnsAsync(false);

            // Act
            var result = await _controller.DeleteGameResult(1);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task GetUserGameResults_ReturnsOkResult_WithListOfGameResults()
        {
            // Arrange
            var gameResults = new List<GameResult>
            {
                new GameResult { GameResultId = 1, WordsPerMinute = 100, Accuracy = 95, UserId = "userId" }
            };

            var mockUser = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, "userId")
            }));

            _mockHttpContextAccessor.Setup(a => a.HttpContext.User).Returns(mockUser);
            _mockRepo.Setup(repo => repo.GetUserGameResultsAsync("userId")).ReturnsAsync(gameResults);

            // Act
            var result = await _controller.GetUserGameResults();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<List<GameResult>>(okResult.Value);
            Assert.Single(returnValue);
        }
    }
}
