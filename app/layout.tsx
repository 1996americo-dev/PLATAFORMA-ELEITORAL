import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'PLATAFORMA ELEITORAL 2026',
  description: 'Voto seguro com auditoria CPF',
  manifest: '/manifest.json',
  themeColor: '#000000',
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="https://cdn-icons-png.flaticon.com/512/942/942781.png" />
      </head>
      <body>{children}</body>
    </html>
  )
}
