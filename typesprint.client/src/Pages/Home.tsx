import WeatherForecast from "../Components/WeatherForecast.tsx";
import TypingRace from "../Components/TypingRace.tsx";
import LogoutLink from "../Components/LogoutLink.tsx";
import AuthorizeView, { AuthorizedUser } from "../Components/AuthorizeView.tsx";

function Home() {
    return (
        <AuthorizeView>
            <span><LogoutLink>Logout <AuthorizedUser value="email" /></LogoutLink></span>
            <WeatherForecast />
            <TypingRace />
        </AuthorizeView>
    );
}

export default Home;