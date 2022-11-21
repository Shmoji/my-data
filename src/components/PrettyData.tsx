import router from "next/router"
import { useEffect, useState } from "react"
import { useDataStore } from "stores/dataStore"
import { DataModel } from '@glazed/datamodel'
import { DIDDataStore } from '@glazed/did-datastore'
import { CeramicClient } from '@ceramicnetwork/http-client'

const PrettyData = ({ record, definitionId, did }: any) => {
  const [definition, setDefinition] = useState<any>(null)
  const setCurrentData = useDataStore((state: any) => state.setCurrentData) as any

  const goToRecord = () => {
    setCurrentData(record)
    router.push(`/did/${did}/records/${definitionId}`)
  }

  const goToDefinitionDetails = () => {
    router.push(`/definition/${definitionId}`)
  }

  useEffect(() => {
    const getDefinition = async () => {
      // Connect to the local Ceramic node
      const ceramic = new CeramicClient('http://localhost:7007')
      const publishedModel = {}
      const model = new DataModel({ ceramic, model: publishedModel })
      const dataStore = new DIDDataStore({ ceramic, model })
      const def = await dataStore.getDefinition(definitionId)
      setDefinition(def)
    }
    
    getDefinition()
  }, [])

  return (
    <div className="px-3 py-2 border-b border-black">
      {definition && (
        <div className="flex justify-between items-center">
          <span className="w-72">{definition.name}</span>
          <button onClick={goToDefinitionDetails} className="px-2 py-1 text-white rounded-lg bg-blue-600 hover:bg-blue-800">Get Definition</button>
          <button onClick={goToRecord} className="px-2 py-1 text-white rounded-lg bg-blue-600 hover:bg-blue-800">Get Record</button>
        </div>
      )}
    </div>
  )
}

export default PrettyData
