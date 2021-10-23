import 'tailwindcss/tailwind.css'
import 'styles/globals.css'
import type { AppProps } from 'next/app'
import { Fragment, ReactNode, useEffect } from 'react'
import { Web3ReactProvider } from '@web3-react/core'
import Web3 from 'web3'
import { useDataStore } from 'stores/dataStore'
import router from 'next/router'
import Web3ReactManager from 'components/wallet/Web3ReactManager'
import ModalRoot from 'components/modals/ModalRoot'

function getLibrary(provider: any): Web3 {
  return new Web3(provider)
}

function MyApp({ Component, pageProps }: AppProps) {
  const Layout =
    (
      Component as typeof Component & {
        layoutProps: {
          Layout: (props: { children: ReactNode } & unknown) => JSX.Element
        }
      }
    ).layoutProps?.Layout || Fragment

    const clearCurrentData = useDataStore((state: any) => state.clearCurrentData) as any

  useEffect(() => {
    // Whenever the browser back or forward button is pressed, this clears the global data state so slug page can load new data
    // https://nextjs.org/docs/api-reference/next/router#routerbeforepopstate
    router.beforePopState(() => {
      clearCurrentData()
      return true
    })
  }, [clearCurrentData])

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ReactManager>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Web3ReactManager>
      {/* <WrongNetworkOverlay /> */}
      <ModalRoot />
    </Web3ReactProvider>
  )
}

export default MyApp
