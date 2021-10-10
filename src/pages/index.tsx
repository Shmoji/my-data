import type { NextPage } from 'next'
import { useState } from 'react'
import { DataModel } from '@glazed/datamodel'
import { DIDDataStore } from '@glazed/did-datastore'
import { CeramicClient } from '@ceramicnetwork/http-client'
import PrettyData from '../components/PrettyData'

const Home: NextPage = () => {
  const [did, setDid] = useState('')
  const [index, setIndex] = useState({})
  const [records, setRecords] = useState([] as any)
  const [definitionIds, setDefinitionIds] = useState([] as any)
  const [isLoading, setIsLoading] = useState(false)

  const getIndex = async () => {
    setIsLoading(true)
    // Connect to the local Ceramic node
    const ceramic = new CeramicClient('http://localhost:7007')
    const publishedModel = {}
    const model = new DataModel({ ceramic, model: publishedModel })
    const dataStore = new DIDDataStore({ ceramic, model })
    const responseIndex = await dataStore.getIndex(did)
    setIndex(responseIndex)
    const definitionIds = Object.keys(responseIndex)
    const responseRecords = await Promise.all(definitionIds.map(async (defId) => {
      const record = await dataStore.getRecord(defId, did)
      return record
    }))

    setRecords(responseRecords)
    setDefinitionIds(definitionIds)
    setIsLoading(false)
  }

  return (
    <div>
      <input onChange={(e) => setDid(e.target.value)} value={did} className="border rounded-md" />
      <button onClick={getIndex}>Get Index</button>
      {!isLoading && records.map((record: any, i: number) => {
        return (
          <PrettyData key={i} record={record} definitionId={definitionIds[i]} did={did} />
        )
      })}
    </div>
  )
}

export default Home
