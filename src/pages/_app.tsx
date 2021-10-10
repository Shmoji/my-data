import '../styles/globals.css'
import type { AppProps } from 'next/app'
import 'tailwindcss/tailwind.css'
import { useEffect } from 'react'
import { useDataStore } from 'store/dataStore'
import router from 'next/router'

function MyApp({ Component, pageProps }: AppProps) {
  const clearCurrentData = useDataStore((state: any) => state.clearCurrentData) as any

  useEffect(() => {
    // Whenever the browser back or forward button is pressed, this clears the global data state so slug page can load new data
    // https://nextjs.org/docs/api-reference/next/router#routerbeforepopstate
    router.beforePopState(() => {
      clearCurrentData()
      return true
    })
  }, [clearCurrentData])

  return <Component {...pageProps} />
}
export default MyApp
