import "../styles/globals.css";
import "@/styles/animations.css";
import LayoutClient from './LayoutClient';

export const metadata = {
  title: 'Islamic Dreams',
  description: 'Islamic Dreams is a web application dedicated to making authentic Islamic dream interpretation accessible to everyone.',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png' }
    ]
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      <link rel="icon" type="image/png" href="/Dream-logo.png" />
      </head>
      <body>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
