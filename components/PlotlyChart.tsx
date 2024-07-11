'use client'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import siteMetadata from '@/data/siteMetadata'

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

export default function PlotlyChart({ src }: { src: string }) {
  if (src[0] == '/') {
    src = siteMetadata.siteUrl + '/' + src
  }
  const [file, setFile] = useState(undefined)

  useEffect(() => {
    fetch(src)
      .then((response) => response.json())
      .then((data) => setFile(data))
      .catch((error) => console.error(error))
  }, [src])
  if (!file) {
    return <></>
  }
  // const config = {
  //   displaylogo: false,
  //   modeBarButtons: [['toImage', 'zoom2d', 'pan2d', 'resetViews']],
  // }
  return (
    <Plot
      data={file['data']}
      layout={file['layout']}
      useResizeHandler={true}
      style={{ width: '100%', height: '100%' }}
    />
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
