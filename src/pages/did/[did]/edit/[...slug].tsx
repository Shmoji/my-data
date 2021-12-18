import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { DataModel } from '@glazed/datamodel'
import { DIDDataStore } from '@glazed/did-datastore'
import { useCeramicStore } from "stores/ceramicStore"
import DefaultLayout from "components/layouts/DefaultLayout"
import CeramicClient from "@ceramicnetwork/http-client"
import classNames from "classnames"

const Edit = () => {
  const ceramic = useCeramicStore((state: any) => state.ceramic)
  const router = useRouter()
  const slug = router.query.slug || [] as any
  const did = router.query.did
  const valueToEdit = slug ? slug[slug?.length - 1] : null
  const [record, setRecord] = useState<any>(null)
  const [data, setData] = useState(null)
  const [newData, setNewData] = useState<any>('')

  /*
   * Explanation of this method: https://stackoverflow.com/a/6906859/13759422
   */
  function getNestedValue(record: any, propString: any) {
    if (!propString)
      return record
  
    var prop, props = propString.split('.')
  
    for (var i = 0, iLen = props.length - 1; i < iLen; i++) {
      prop = props[i]
  
      var candidate = record[prop]
      if (candidate !== undefined) {
        record = candidate
      } else {
        break
      }
    }
    
    // props[i] is the key
    // record[props[i]] is the value for that key
    return record[props[i]]
  }

  /*
   * Uses recursion to set nested value in record
   */
  const updateObjProp = (record: any, newValue: any, propPath: string) => {
    const [head, ...rest] = propPath.split('.');

    !rest.length
        ? record[head] = newValue
        : updateObjProp(record[head], newValue, rest.join('.'));
}

  const submitChanges = async () => {
    const publishedModel = {}
    const model = new DataModel({ ceramic, model: publishedModel })
    const dataStore = new DIDDataStore({ ceramic, model })

    // Get data based on slugs
    let slugString = ''
    slug.forEach((s: any, i: number) => {
      if (i !== 0) {
        slugString += `${s}${i + 1 === slug.length ? '': '.'}`
      }
    })
    // Make sure to do a DEEP copy or it gets confusing because references change stuff
    const newRecord = JSON.parse(JSON.stringify(record))
    updateObjProp(newRecord, newData, slugString) // This directly changes first argument

    try {
      await dataStore.setRecord(slug[0], newRecord) as any
      setRecord(newRecord)
      setData(newData)
    } catch(error) {
      console.error(error)
    }
    
    console.log('new data submitted')
  }

  useEffect(() => {
    const getInitialRecord = async () => {
      const ceramic = new CeramicClient('http://localhost:7007')
      const publishedModel = {}
      const model = new DataModel({ ceramic, model: publishedModel })
      const dataStore = new DIDDataStore({ ceramic, model })
      const record = await dataStore.getRecord(slug[0], did as any) as any
      // Get data based on slugs
      let slugString = ''
      slug.forEach((s: any, i: number) => {
        if (i !== 0) {
          slugString += `${s}${i + 1 === slug.length ? '': '.'}`
        }
      })
      const loadedData = getNestedValue(record, slugString)
      setRecord(record)
      setData(loadedData)
    }

    if (slug && slug.length > 0 && did) {
      getInitialRecord()
    }
  }, [ceramic, did])

  const path = slug.join(" / ")
  const isConnectedDIDTheOwner = !ceramic || !did ? false : did === ceramic.did.id

  return (
    <div className="px-4 md:px-20 flex justify-center">
      <div className="w-8/12">
        {data ? (
          <>
            <div>Path: {path}</div>
            <div>Property: {valueToEdit || "Not found"}</div>
            <div>Data: {data || "No record found"}</div>
            <textarea
              value={newData}
              onChange={(e) => setNewData(e.target.value)}
              className="mt-4 p-2 border rounded-md w-full"
              placeholder="Enter new data..."
            />
            <button
              onClick={submitChanges}
              disabled={!isConnectedDIDTheOwner}
              className={classNames(
                !isConnectedDIDTheOwner ? 'bg-gray-200' : 'bg-blue-600 hover:bg-blue-800',
                "px-2 py-1 text-white rounded-lg"
              )}
            >
              Submit Changes
            </button>
            {!isConnectedDIDTheOwner && (
              <div className="text-red-400">
                You must be the owner of this data to edit it
              </div>
            )}
          </>
        ): (
          <div>HOLD YOUR HORSES! Data is loading friends...</div>
        )}
      </div>
    </div>
  )
}

Edit.layoutProps = {
  Layout: DefaultLayout,
}

export default Edit
