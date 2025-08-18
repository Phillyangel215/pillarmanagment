import ErrorBoundary from '@/components/common/ErrorBoundary';
import DemoGallery from './DemoGallery';
import Footer from '@/components/layout/Footer';

export default function App() {
  return (
    <ErrorBoundary>
      <DemoGallery />
      <Footer />
    </ErrorBoundary>
  );
}