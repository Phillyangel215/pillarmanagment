import logoUrl from '@/assets/logo.svg';
export default function Logo({ title='PILLAR' }: { title?: string }) {
  return <img src={logoUrl} alt={`${title} logo`} className="h-8 w-auto" />;
}
