import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useDataStore } from "stores/dataStore"
import classNames from "classnames"
import A from "components/A"
import DefaultLayout from "components/layouts/DefaultLayout"

/**
 * streamId is always the 1st slug
 */
const Stream = () => {
  const router = useRouter()
  const streamId = router.query.slug && router.query.slug[0]
  const slug = router.query.slug || [] as any

  const [dataKeyValues, setDataKeyValues] = useState<any>([])
  const setCurrentData = useDataStore((state: any) => state.setCurrentData) as any
  const currentData = useDataStore((state: any) => state.currentData)

  const goToNextPage = (dataPair: any) => {
    setCurrentData(dataPair[1])
    let newSlug = ''
    slug.forEach((key: any) => {
      newSlug += `/${key}`
    })
    newSlug += `/${dataPair[0]}`
    router.push(`/stream${newSlug}`)
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
    const getStream = async () => {
      let loadedData = null
      // If no current data, then we need to load it from Ceramic
      // if (!currentData) {
        const data = await (await fetch(`http://localhost:7007/api/v0/streams/${streamId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })).json()

        // Get data based on slugs
        let slugString = ''
        slug.forEach((s: any, i: number) => {
          if (i !== 0) {
            slugString += `${s}${i + 1 === slug.length ? '': '.'}`
          }
        })
        loadedData = getNestedValue(data, slugString)
      // } 

      const finalData = loadedData
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

    if (streamId) {
      getStream()
    }
  }, [streamId, currentData, slug])

  const path = (
    <div>
      {slug.map((s: string, index: number) => (
        <A href={`/stream/${slug.slice(0, index + 1).join('/')}`} disabled={index + 1 >= slug.length} key={s}>
          <span className={classNames(index + 1 < slug.length ? 'text-blue-800' : 'cursor-default')}>{s}</span>{index + 1 < slug.length ? ' / ' : ''}
        </A>
      ))}
    </div>
  )

  return (
    <div className="px-4 md:px-20 flex justify-center">
      <div className="w-8/12">
      {dataKeyValues.length > 0 ? (
          <>
            <div className="my-3">{path}</div>
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
                      <div>
                        <span>{pair[0]} ({valueType}): {pair[1]}</span>
                      </div>
                    ): (
                      <span onClick={() => goToNextPage(pair)} className="cursor-pointer">{pair[0]} ({valueType})</span>
                    )}
                  </div>
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

Stream.layoutProps = {
  Layout: DefaultLayout,
}

export default Stream
