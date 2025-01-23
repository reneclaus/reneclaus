'use client'
import { createContext, useCallback, useRef, ReactNode, useContext } from 'react'

export const FigureIdContext = createContext((id) => {
  return 0
})

export function FigureIdTracker({ children }) {
  const figureTracker = useRef({ next_id: 1, existing_ids: {} })

  const getFigureId = useCallback(
    (id) => {
      if (id in figureTracker.current.existing_ids) {
        return figureTracker.current.existing_ids[id]
      }
      const new_id = figureTracker.current.next_id++
      figureTracker.current.existing_ids[id] = new_id
      return new_id
    },
    [figureTracker]
  )

  return <FigureIdContext.Provider value={getFigureId}>{children}</FigureIdContext.Provider>
}

export function FigureRef({id, children}: {id: string, children: ReactNode}) {
  const getFigureId = useContext(FigureIdContext)
  const figureId = getFigureId(id)
  if (!children) {
    children = `Figure ${figureId}`
  }
  return <a href={`#${id}`}>{children}</a>
}