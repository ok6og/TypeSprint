import TypingRace from "../Components/Game/TypingRace.tsx";
import AuthorizeView from "../Components/Auth/AuthorizeView.tsx";
import Leaderboard from "../Components/Leaderboard/LeaderboardComponent.tsx"

function Home() {
    return (
        <AuthorizeView>
            <TypingRace />
            <Leaderboard /> 
        </AuthorizeView>
    );
}

export default Home;