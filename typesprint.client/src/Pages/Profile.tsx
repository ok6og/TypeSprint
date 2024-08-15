import UserProgress from '../Components/Stats/UserProgressComponent';
import UserStats from '../Components/Stats/UserStats';
function ProfilePage() {
    return (
        <div className="user-progress">
            <main>
                <UserProgress />
                <UserStats/>
            </main>
        </div>
    );
}

export default ProfilePage;
