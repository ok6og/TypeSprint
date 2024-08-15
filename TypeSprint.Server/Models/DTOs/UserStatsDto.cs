namespace TypeSprint.Server.Models.DTOs
{
    public class UserStatsDto
    {
        public double AverageWpm { get; set; }
        public int TotalRaces { get; set; }
        public double BestWpm { get; set; }
        public double LastRaceWpm { get; set; }
        public double LastTenRacesAverageWpm { get; set; }
    }
}
