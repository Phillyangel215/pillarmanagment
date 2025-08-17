import ErrorBoundary from '@/components/common/ErrorBoundary';
import DemoGallery from './DemoGallery';

export default function App() {
  return (
    <ErrorBoundary>
      <DemoGallery />
    </ErrorBoundary>
  );
}