'use client'
import { useEffect, useState, useContext, ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { FigureIdContext } from './FigureIdContext'
import { ModeBarButtonAny } from 'plotly.js'

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

export default function PlotlyChart({
  src,
  id = null,
  children,
}: {
  src: string
  id: string | null
  children: ReactNode
}) {
  // if (src[0] == '/') {
  //   src = siteMetadata.siteUrl + '/' + src
  // }
  const [file, setFile] = useState(undefined)
  const getFigureId = useContext(FigureIdContext)
  const figureId = getFigureId(id ? id : src)
  id = id || `figure_${figureId}`

  useEffect(() => {
    const abortController = new AbortController()
    fetch(src, { signal: abortController.signal })
      .then((response) => response.json())
      .then((data) => {
        data['title'] = data['layout']['title']['text']
        delete data['layout']['title']
        data['layout']['margin'] = { l: 0, r: 0, b: 0, t: 0, pad: 0 }
        setFile(data)
      })
      .catch((error) => console.error(error))
    return () => {
      abortController.abort()
    }
  }, [src])
  if (!file) {
    return <></>
  }
  const config = {
    displaylogo: false,
    modeBarButtons: [['toImage', 'zoom2d', 'pan2d', 'resetViews']] as ModeBarButtonAny[][],
  }
  return (
    <figure id={id}>
      <Plot
        data={file['data']}
        layout={file['layout']}
        useResizeHandler={true}
        config={config}
        style={{ width: '100%', height: '100%' }}
      />
      <figcaption>
        <h4>
          <a href={`#${id}`}>Figure {figureId}:</a>{' '}
          <span className="font-normal">{file['title']}</span>
        </h4>
        {children}
      </figcaption>
    </figure>
  )
}

// function PlotlyChart2({ filename }: { filename: string }) {
//   const image_filename = filename.replaceAll('json', 'webp')
//   const [file, setFile] = useState(undefined)
//   const load_plotly_fig = () => {
//     fetch(filename).then(response => response.json()).then(data => applyThemeTemplateLayout(data)).then(data => setFile(data)).catch(error => console.error(error));
//   }
//   useEffect(load_plotly_fig, [filename])

//   if (!file) {
//     return <div onClick={load_plotly_fig}><Image src={image_filename} width={704} height={460}  /></div>
//   }
//   return <Plot data={file['data']} layout={file['layout']} />
// }
