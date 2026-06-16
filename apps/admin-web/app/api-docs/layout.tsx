import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Smart Event AI OS — API Documentation",
  description: "Documentation de l'API Smart Event AI OS",
};

export default function ApiDocsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
