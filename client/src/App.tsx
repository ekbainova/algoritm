import { Header } from './components/layout/Header';
import { ProgressBar } from './components/layout/ProgressBar';
import { WelcomeScreen } from './components/onboarding/WelcomeScreen';
import { ProfileForm } from './components/onboarding/ProfileForm';
import { LevelQuiz } from './components/onboarding/LevelQuiz';
import { TrajectoryScreen } from './components/trajectory/TrajectoryScreen';
import { LessonScreen } from './components/lesson/CodeEditor';
import { ReviewScreen } from './components/lesson/ReviewPanel';
import { useStudentStore } from './store/studentStore';

function App() {
  const { phase } = useStudentStore();
  const isLesson = phase === 'lesson';

  return (
    <div className="min-h-screen bg-[#f8f5fb] flex flex-col">
      <Header />
      <ProgressBar />
      <main className={isLesson ? 'flex-1' : 'flex-1 flex flex-col items-center w-full'}>
        {phase === 'welcome' && <WelcomeScreen />}
        {phase === 'profile' && <ProfileForm />}
        {phase === 'quiz' && <LevelQuiz />}
        {phase === 'trajectory' && <TrajectoryScreen />}
        {phase === 'lesson' && <LessonScreen />}
        {phase === 'review' && <ReviewScreen />}
      </main>
    </div>
  );
}

export default App;
