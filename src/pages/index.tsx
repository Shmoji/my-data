import type { NextPage } from 'next'
import { useState } from 'react'
import { useRouter } from 'next/router'
import DefaultLayout from 'components/layouts/DefaultLayout'

const Home: NextPage = () => {
  const router = useRouter()
  const [did, setDid] = useState('')
  const [definitionID, setDefinitionID] = useState('')
  const [schemaID, setSchemaID] = useState('')

  const goToIndex = () => {
    router.push(`/did/${did}`)
  }

  const goToDefinition = () => {
    router.push(`/definition/${definitionID}`)
  }

  return (
    <div className="px-4 md:px-20 flex justify-center">
      <div className="w-8/12">
        <div className="flex justify-center mb-4">
          <input onChange={(e) => setDid(e.target.value)} value={did} placeholder="Enter DID (decentralized identity)..." className="w-1/2 mr-2 border rounded-md p-1" />
          <button onClick={goToIndex} className="px-2 py-1 text-white rounded-lg bg-blue-600 hover:bg-blue-800">Get Data Index</button>
        </div>

        <div className="flex justify-center mb-4">
          <input onChange={(e) => setDefinitionID(e.target.value)} value={definitionID} placeholder="Enter definition ID..." className="w-1/2 mr-2 border rounded-md p-1" />
          <button onClick={goToDefinition} className="px-2 py-1 text-white rounded-lg bg-blue-600 hover:bg-blue-800">Get Definition</button>
        </div>
      </div>
    </div>
  )
}

Home.layoutProps = {
  Layout: DefaultLayout,
}

export default Home
