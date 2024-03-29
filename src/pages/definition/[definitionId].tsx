import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { DataModel } from '@glazed/datamodel'
import { DIDDataStore } from '@glazed/did-datastore'
import { CeramicClient } from '@ceramicnetwork/http-client'
import DefaultLayout from "components/layouts/DefaultLayout"

const Definition = () => {
  const router = useRouter()
  const definitionId = router.query.definitionId
  const [definition, setDefinition] = useState<any>(null)

  useEffect(() => {
    const getDefinition = async () => {
      // Connect to the local Ceramic node
      const ceramic = new CeramicClient('http://localhost:7007')
      const publishedModel = {}
      const model = new DataModel({ ceramic, model: publishedModel })
      const dataStore = new DIDDataStore({ ceramic, model })
      const def = await dataStore.getDefinition(definitionId as string)
      setDefinition(def)
    }

    if (definitionId) {
      getDefinition()
    }
  }, [definitionId])

  return (
    <div className="px-4 md:px-20 flex justify-center">
      <div className="w-8/12">
        {definition ? (
          <>
            <div>Definition details:</div>
            <div className="border border-black rounded-md">
              <div className="border-b border-black px-3 py-2">
                name: {definition.name}
              </div>
              <div className="border-b border-black px-3 py-2">
                description: {definition.description}
              </div>
              <div className="border-b border-black px-3 py-2">
                id: {definition.id.toString()}
              </div>
              <div className="px-3 py-2">
                schema: {definition.schema}
              </div>
            </div>
          </>
        ): (
          <div>HOLD YOUR HORSES! Data is loading friends...</div>
        )}
      </div>
    </div>
  )
}

Definition.layoutProps = {
  Layout: DefaultLayout,
}

export default Definition
