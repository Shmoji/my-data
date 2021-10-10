import router from "next/router"
import { useEffect, useState } from "react"
import { useDataStore } from "store/dataStore"
import { DataModel } from '@glazed/datamodel'
import { DIDDataStore } from '@glazed/did-datastore'
import { CeramicClient } from '@ceramicnetwork/http-client'

const PrettyData = ({ record, definitionId, did }: any) => {
  const [definition, setDefinition] = useState<any>(null)
  const setCurrentData = useDataStore((state: any) => state.setCurrentData) as any

  const goToNextPage = () => {
    setCurrentData(record)
    router.push(`/did/${did}/${definitionId}`)
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
    <div>
      {definition && <div onClick={goToNextPage} className="cursor-pointer">--Definition name: {definition.name}--</div>}
    </div>
  )
}

export default PrettyData
