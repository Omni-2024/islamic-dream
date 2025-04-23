export default function generateMetadata() {
  return {
    title: 'Ruqya',
    description: 'Ruqya is a web application that helps you to perform Ruqya on yourself or others.',
    icons: {
      icon: [
        {
          url: '/logo-icon.ico',
          sizes: 'any',
        },
      ],
      shortcut: '/logo-icon.ico',
      apple: '/logo-icon.ico',
    },
    manifest: '/manifest.json',
  }
}
