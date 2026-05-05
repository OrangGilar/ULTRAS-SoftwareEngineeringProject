import { PageContainer } from "@/components/layout/PageContainer";

export default function MatchLayout({ children }: { children: React.ReactNode }) {
  return <PageContainer width="sm" className="space-y-8">{children}</PageContainer>;
}
