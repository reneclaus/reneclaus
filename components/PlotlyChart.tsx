'use client'
import { useEffect, useState, useContext, ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { FigureIdContext } from './FigureIdContext'
import { ModeBarButtonAny } from 'plotly.js'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

export default function PlotlyChart({
  src,
  id = null,
  title = null,
  children,
}: {
  src: string
  id: string | null
  title: string | null
  children: ReactNode
}) {
  // if (src[0] == '/') {
  //   src = siteMetadata.siteUrl + '/' + src
  // }
  const [file, setFile] = useState(undefined)
  const [isFullScreen, setFullScreen] = useState(false)
  const getFigureId = useContext(FigureIdContext)
  const figureId = getFigureId(id ? id : src)
  id = id || `figure_${figureId}`

  useEffect(() => {
    const abortController = new AbortController()
    fetch(src, { signal: abortController.signal })
      .then((response) => response.json())
      .then((data) => {
        if ('layout' in data && 'title' in data['layout'] && 'text' in data['layout']['title']) {
          data['title'] = data['layout']['title']['text']
          delete data['layout']['title']
          data['layout']['margin'] = { l: 0, r: 0, b: 0, t: 0, pad: 0 }
        }
        setFile(data)
      })
      .catch((error) => console.error(error))
    return () => {
      abortController.abort()
    }
  }, [src])
  if (!file) {
    return <figure id={id}>
      <figcaption>
        <h4>
          <a href={`#${id}`}>Figure {figureId}:</a>{' '}
        </h4>
        {children}
      </figcaption>
    </figure>
  }
  const config = {
    displaylogo: false,
    modeBarButtons: [['toImage', 'zoom2d', 'pan2d', 'resetViews', {
      name: 'Fullscreen',
      icon: {
        'width': 512,
        'height': 512,
        'path': "M512 512v-208l-80 80-96-96-48 48 96 96-80 80z M512 0h-208l80 80-96 96 48 48 96-96 80 80z M0 512h208l-80-80 96-96-48-48-96 96-80-80z M0 0v208l80-80 96 96 48-48-96-96 80-80z"
      },
      click: function(gd) {
        setFullScreen(!isFullScreen)
      }
    }]] as ModeBarButtonAny[][],
  }
  var plotFigure = <Plot
    data={file['data']}
    layout={file['layout']}
    useResizeHandler={true}
    config={config}
    style={{ width: '100%', height: '100%' }}
  />
  if (isFullScreen) {
    plotFigure = <Modal size={"full"} isOpen={true} onClose={() => setFullScreen(false)} hideCloseButton={true}>
      <ModalContent>
      <ModalBody>{plotFigure}</ModalBody>
      </ModalContent>
    </Modal>
  }
  return (
    <figure id={id}>
      {plotFigure}
      <figcaption>
        <h4>
          <a href={`#${id}`}>Figure {figureId}:</a>{' '}
          <span className="font-normal">{title != null ? title : file['title']}</span>
        </h4>
        {children}
      </figcaption>
    </figure>
  )
}


export function PlotlyChartNoFigure({
  src,
  remove_title = false,
  xlabel = null,
  ylabel = null,
}: {
  src: string
  remove_title: boolean  // some figures have titles that format weird
  xlabel: string | null
  ylabel: string | null
}) {
  // if (src[0] == '/') {
  //   src = siteMetadata.siteUrl + '/' + src
  // }
  const [file, setFile] = useState(undefined)
  const [isFullScreen, setFullScreen] = useState(false)

  useEffect(() => {
    const abortController = new AbortController()
    fetch(src, { signal: abortController.signal })
      .then((response) => response.json())
      .then((data) => {
        if (remove_title && 'layout' in data && 'title' in data['layout'] && 'text' in data['layout']['title']) {
          data['title'] = data['layout']['title']['text']
          delete data['layout']['title']
          data['layout']['margin'] = { l: 0, r: 0, b: 0, t: 0, pad: 0 }
        }
        if (xlabel != null) {
          data['layout']['xaxis']['title'] = xlabel
        }
        if (ylabel != null) {
          data['layout']['yaxis']['title'] = xlabel
        }
        delete data['layout']['width']
        // delete data['layout']['height']
        // if ('layout' in data && 'height' in data['layout']) {
        //   delete data['layout']['height']
        // }
        if ('layout' in data && 'height' in data['layout']) {
          delete data['layout']['width']
        }
        setFile(data)
      })
      .catch((error) => console.error(error))
    return () => {
      abortController.abort('Cancel existing fetch.')
    }
  }, [src, xlabel, ylabel])
  if (!file) {
    return <></>
  }
  const config = {
    displaylogo: false,
    modeBarButtons: [['toImage', 'zoom2d', 'pan2d', 'resetViews', {
      name: 'Fullscreen',
      icon: {
        'width': 512,
        'height': 512,
        'path': "M512 512v-208l-80 80-96-96-48 48 96 96-80 80z M512 0h-208l80 80-96 96 48 48 96-96 80 80z M0 512h208l-80-80 96-96-48-48-96 96-80-80z M0 0v208l80-80 96 96 48-48-96-96 80-80z"
      },
      click: function(gd) {
        setFullScreen(!isFullScreen)
      }
    }]] as ModeBarButtonAny[][],
  }
  const plotFigure = <Plot
      data={file['data']}
      layout={file['layout']}
      useResizeHandler={true}
      config={config}
      style={{ width: '100%', height: '100%' }}
    />
  if (isFullScreen) {
    return (
      <Modal size={"full"} isOpen={true} onClose={() => setFullScreen(false)} hideCloseButton={true}>
        <ModalContent>
        <ModalBody>{plotFigure}</ModalBody>
        </ModalContent>
      </Modal>
    )
  } else {
    return plotFigure
  }
}