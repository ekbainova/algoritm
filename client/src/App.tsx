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
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Background glow */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -300, left: '50%', transform: 'translateX(-50%)', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,40,149,0.06) 0%, transparent 70%)' }} />
      </div>
      <Header />
      <ProgressBar />
      <main style={isLesson ? { flex: 1, position: 'relative', zIndex: 10 } : { flex: 1, display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 10 }}>
        <div style={isLesson ? { height: '100%' } : { width: '100%', maxWidth: 560, padding: '32px 24px' }}>
          {phase === 'welcome' && <WelcomeScreen />}
          {phase === 'profile' && <ProfileForm />}
          {phase === 'quiz' && <LevelQuiz />}
          {phase === 'trajectory' && <TrajectoryScreen />}
          {phase === 'lesson' && <LessonScreen />}
          {phase === 'review' && <ReviewScreen />}
        </div>
      </main>
    </div>
  );
}

export default App;
