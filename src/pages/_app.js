import connectDB from '@/db'
import '@/styles/globals.css'
connectDB()

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
