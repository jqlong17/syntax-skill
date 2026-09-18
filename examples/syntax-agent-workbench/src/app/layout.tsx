import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Syntax Agent Workbench",
  description: "A JSON-first workspace for designing reliable AI agents.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
