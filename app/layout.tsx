import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const lato = Lato({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-lato",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Freemason International | Join the Freemason Brotherhood",
  description: "Apply for Freemason membership and join a global fraternity dedicated to character, leadership, and community service.",
  keywords: ["Freemason membership", "Join Freemasons", "Freemasonry fraternity", "Brotherhood organization", "Masonic membership application"],
  authors: [{ name: "Freemason International" }],
  openGraph: {
    title: "Freemason International | Join the Freemason Brotherhood",
    description: "Apply for Freemason membership and join a global fraternity dedicated to character, leadership, and community service.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${lato.variable} font-body antialiased`}>
        {children}
      </body>
    </html>
  );
}
