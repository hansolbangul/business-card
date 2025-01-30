import { Inter } from "next/font/google";
import "./globals.css";
import { ModalPortal } from "@/shared/ui/ModalPortal";
import { Header } from "@/widgets/Header/ui/Header";
import { Footer } from "@/widgets/Footer/ui/Footer";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://business-card.hansolbangul.com"),
  title: {
    template: "%s | 명함 제작 도구",
    default: "명함 제작 도구 - 전문적인 디지털 명함 제작",
  },
  description:
    "대화형 에디터로 전문적인 디지털 명함을 제작하고 커스터마이징하세요. 드래그 앤 드롭 요소, 커스텀 텍스트 편집, 이미지 조작, 모바일 반응형 디자인 등 다양한 기능을 제공합니다.",
  keywords: [
    "명함",
    "디지털 명함",
    "명함 제작",
    "명함 메이커",
    "전문 명함",
    "온라인 명함",
    "명함 디자인",
    "명함 에디터",
  ],
  authors: [{ name: "지한솔", url: "https://github.com/hansolbangul" }],
  creator: "지한솔",
  publisher: "지한솔",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://business-card.hansolbangul.com",
    title: "명함 제작 도구 - 전문적인 디지털 명함 제작",
    description:
      "대화형 에디터로 전문적인 디지털 명함을 제작하고 커스터마이징하세요. 드래그 앤 드롭 요소, 커스텀 텍스트 편집, 이미지 조작, 모바일 반응형 디자인 등 다양한 기능을 제공합니다.",
    siteName: "명함 제작 도구",
    images: [
      {
        url: "/assets/profile.png",
        width: 1200,
        height: 630,
        alt: "명함 제작 도구 미리보기",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "명함 제작 도구 - 전문적인 디지털 명함 제작",
    description:
      "대화형 에디터로 전문적인 디지털 명함을 제작하고 커스터마이징하세요. 드래그 앤 드롭 요소, 커스텀 텍스트 편집, 이미지 조작, 모바일 반응형 디자인 등 다양한 기능을 제공합니다.",
    images: ["/assets/profile.png"],
    creator: "@hansolbangul",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification",
    other: {
      "naver-site-verification": "your-naver-site-verification",
    },
  },
  alternates: {
    canonical: "https://business-card.hansolbangul.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
        <ModalPortal />
      </body>
    </html>
  );
}
