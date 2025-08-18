import ErrorBoundary from '@/components/common/ErrorBoundary';
import DemoGallery from './DemoGallery';
// import { IS_DEMO } from '@/config/appConfig'
// import { supabase } from '@/lib/supabase'
// import { useSession } from '@/auth/session'

export default function App() {
  return (
    <ErrorBoundary>
      {/* In non-demo builds, we will later render real app shell; demo stays intact */}
      <DemoGallery />
    </ErrorBoundary>
  );
}