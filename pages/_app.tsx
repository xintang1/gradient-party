import '@/styles/global.sass'
import type { AppProps } from 'next/app'

// Test
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Component {...pageProps} />
  );
}

export default MyApp;