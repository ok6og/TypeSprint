import WeatherForecast from "../Components/WeatherForecast.tsx";
import TypingRace from "../Components/TypingRace.tsx";
import LogoutLink from "../Components/LogoutLink.tsx";
import Navbar from "../Components/Navbar.tsx";
import AuthorizeView, { AuthorizedUser } from "../Components/AuthorizeView.tsx";
import Leaderboard from "../Components/LeaderboardComponent.tsx"

function Home() {
    return (

        <AuthorizeView>
            <TypingRace />
            <Leaderboard /> 
        </AuthorizeView>
        
        //<AuthorizeView>
        //    {/*<Navbar />*/}
        //    <span><LogoutLink>Logout <AuthorizedUser value="email" /></LogoutLink></span>
        //    <WeatherForecast />
            
        //</AuthorizeView>
    );
}

export default Home;