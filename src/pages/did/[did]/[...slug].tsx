import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDataStore } from 'store/dataStore'
import { DataModel } from '@glazed/datamodel'
import { DIDDataStore } from '@glazed/did-datastore'
import { CeramicClient } from '@ceramicnetwork/http-client'
import classNames from 'classnames'

const DataList = () => {
  const router = useRouter()
  const slug = router.query.slug || [] as any

  const [dataKeyValues, setDataKeyValues] = useState<any>([])
  const [definition, setDefinition] = useState<any>(null)
  const setCurrentData = useDataStore((state: any) => state.setCurrentData) as any
  const currentData = useDataStore((state: any) => state.currentData)

  const goToNextPage = (dataPair: any) => {
    setCurrentData(dataPair[1])
    let newSlug = ''
    slug.forEach((key: any) => {
      newSlug += `/${key}`
    })
    newSlug += `/${dataPair[0]}`
    router.push(`/did/${router.query.did}${newSlug}`)
  }

  /*
   * Explanation of this method: https://stackoverflow.com/a/6906859/13759422
   */
  function getNestedValue(obj: any, propString: any) {
    if (!propString)
      return obj
  
    var prop, props = propString.split('.')
  
    for (var i = 0, iLen = props.length - 1; i < iLen; i++) {
      prop = props[i]
  
      var candidate = obj[prop]
      if (candidate !== undefined) {
        obj = candidate
      } else {
        break
      }
    }
    return obj[props[i]]
  }

  useEffect(() => {
    const getDefinition = async () => {
      // Connect to the local Ceramic node
      const ceramic = new CeramicClient('http://localhost:7007')
      const publishedModel = {}
      const model = new DataModel({ ceramic, model: publishedModel })
      const dataStore = new DIDDataStore({ ceramic, model })
      const def = await dataStore.getDefinition(slug[0])
      setDefinition(def)

      let loadedData = null
      // If no current data, then we need to load it from Ceramic
      if (!currentData) {
        const record = await dataStore.getRecord(slug[0], router.query.did as any) as any
        // Get data based on slugs
        let slugString = ''
        slug.forEach((s: any, i: number) => {
          if (i !== 0) {
            slugString += `${s}${i + 1 === slug.length ? '': '.'}`
          }
        })
        loadedData = getNestedValue(record, slugString)
      } 

      const finalData = currentData ? currentData : loadedData
      // If data is array, do not need to get keys because each key will just be incremental number
      if (finalData) {
        if (Array.isArray(finalData)) {
          // Create array from 0-n based on length of array
          setDataKeyValues(finalData.map((data, index) => [index, data]))
        } else {
          setDataKeyValues(Object.entries(finalData))
        }
      }
    }
    
    if (slug && slug.length > 0) {
      getDefinition()
    }
  }, [currentData, slug])

  return (
    <div className="px-4 md:px-20 flex justify-center">
      <div className="w-full">
        Path: {slug}
        <div className="border">
          {dataKeyValues.map((pair: any, i: any) => {
            const valueType = Array.isArray(pair[1]) ? 'array' : typeof pair[1]
            return (
              <div
                className={classNames(
                  i + 1 !== dataKeyValues.length && 'border-b',
                  'px-3 py-2',
                )}
                key={i}
              >
                {valueType !== 'array' && valueType !== 'object' ? (
                  <span>{pair[0]}:{pair[1]}</span>
                ): (
                  <span onClick={() => goToNextPage(pair)} className="cursor-pointer">{pair[0]}</span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default DataList
