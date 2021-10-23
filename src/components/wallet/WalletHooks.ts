import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { setWeb3 } from 'stores/WalletStore'

import { injected, connectorsById } from './Connectors'
import { useCeramicStore } from 'stores/ceramicStore'
import CeramicClient from '@ceramicnetwork/http-client'
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver'
import { EthereumAuthProvider, ThreeIdConnect } from '@3id/connect'
import { DID } from 'dids'

export function useEagerConnect() {
  const { account, activate, active, library } = useWeb3React()
  const setCeramic = useCeramicStore((state: any) => state.setCeramic)

  const [tried, setTried] = useState(false)

  useEffect(() => {
    let isCancelled = false

    async function run() {
      const walletStr = localStorage.getItem('WALLET_TYPE')
      // If connected before, connect back
      if (walletStr) {
        const previousConnector = connectorsById[parseInt(walletStr)]
        if (
          previousConnector.isAuthorized &&
          (await previousConnector.isAuthorized())
        ) {
          if (isCancelled) {
            return
          }

          activate(previousConnector).catch(() => {
            setTried(true)
          })
        }
      }
    }

    run()

    return () => {
      isCancelled = true
    }
  }, [])

  useEffect(() => {
    async function connectToDID() {
      const ceramic = new CeramicClient("https://ceramic-clay.3boxlabs.com")
      const threeIdConnect = new ThreeIdConnect()
      const provider = new EthereumAuthProvider((window as any).ethereum, account as any)

      await threeIdConnect.connect(provider)

      const did = new DID({
        provider: threeIdConnect.getDidProvider(),
        resolver: {
          ...ThreeIdResolver.getResolver(ceramic)
        }
      })
      
      ceramic.setDID(did)
      await ceramic?.did?.authenticate()
      setCeramic(ceramic) // Make sure to set this AFTER authenticating
    }
  
    // if the connection worked, wait until we get confirmation of that to flip the flag
    if (!tried && active) {
      setWeb3(library, undefined)
      if (localStorage.getItem('IS_DID_CONNECTED') === 'true') {
        connectToDID()
      }
      setTried(true)
    }
  }, [tried, active])

  return tried
}

export function useInactiveListener(suppress: boolean = false) {
  const { active, error, activate } = useWeb3React()

  useEffect((): any => {
    const { ethereum } = window as any
    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleConnect = () => {
        activate(injected)
      }
      const handleChainChanged = (chainId: string | number) => {
        activate(injected)
      }
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          activate(injected)
        }
      }
      const handleNetworkChanged = (networkId: string | number) => {
        activate(injected)
      }

      ethereum.on('connect', handleConnect)
      ethereum.on('chainChanged', handleChainChanged)
      ethereum.on('accountsChanged', handleAccountsChanged)
      ethereum.on('networkChanged', handleNetworkChanged)

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('connect', handleConnect)
          ethereum.removeListener('chainChanged', handleChainChanged)
          ethereum.removeListener('accountsChanged', handleAccountsChanged)
          ethereum.removeListener('networkChanged', handleNetworkChanged)
        }
      }
    }
  }, [active, error, suppress, activate])
}
