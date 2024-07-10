import {Reddit_Mono} from 'next/font/google';
import "./globals.css";
const redditMono = Reddit_Mono({ subsets: ["latin"],display: 'swap' });

export const metadata = {
  title: "Discord Clone",
};
export default async function RootLayout({ children }) {
  return (
    <html lang="en" className={redditMono.className}>
      <body >{children}</body>
    </html>
  );
}
