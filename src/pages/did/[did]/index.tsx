import { useEffect, useState } from 'react'
import { DataModel } from '@glazed/datamodel'
import { DIDDataStore } from '@glazed/did-datastore'
import { CeramicClient } from '@ceramicnetwork/http-client'
import PrettyData from 'components/PrettyData'
import { useRouter } from 'next/router'

const Index = () => {
  const router = useRouter()
  const [index, setIndex] = useState({})
  const [records, setRecords] = useState([] as any)
  const [definitionIds, setDefinitionIds] = useState([] as any)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const getIndex = async () => {
      setIsLoading(true)
      // Connect to the local Ceramic node
      const ceramic = new CeramicClient('http://localhost:7007')
      const publishedModel = {}
      const model = new DataModel({ ceramic, model: publishedModel })
      const dataStore = new DIDDataStore({ ceramic, model })
      const responseIndex = await dataStore.getIndex(router.query.did as any)
      setIndex(responseIndex)
      const definitionIds = Object.keys(responseIndex)
      const responseRecords = await Promise.all(definitionIds.map(async (defId) => {
        const record = await dataStore.getRecord(defId, router.query.did as any)
        return record
      }))
  
      setRecords(responseRecords)
      setDefinitionIds(definitionIds)
      setIsLoading(false)
    }

    if (router?.query?.did) {
      getIndex()
    }
  }, [router.query.did])

  return (
    <div className="px-4 py-4 md:px-20 flex justify-center">
      <div className="w-8/12">
        {!isLoading ? (
          <>
            <div className="mb-4">Index of DID: {router.query.did}</div>
            <div className="border">
              {records.map((record: any, i: number) => {
                return (
                  <PrettyData key={i} record={record} definitionId={definitionIds[i]} did={router.query.did} />
                )
              })}
            </div>
          </>
        ): (
          <div>HOLD YOUR HORSES! Data is loading friends...</div>
        )}
      </div>
    </div>
  )
}

export default Index
