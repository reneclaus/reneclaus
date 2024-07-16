'use client'
import { createContext, useCallback, useRef } from 'react'

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

// export function FigureIdTracker({ children }) {
//   const chapterRef = useRef(null)
//   const figureTracker = useRef(1)

//   const updateImageNumbers = () => {
//     const imageTags = [...chapterRef.current.querySelectorAll('.image')]
//     Object.values(figureTracker.current).forEach((imageData) => {
//       const imageIndex = imageTags.indexOf(figureData.ref.current)
//       if (imageIndex === -1) delete figureData.number
//       else figureData.number = imageIndex + 1 // Count from 1.
//     })
//   }
//   const registerFigure = useCallback(
//     (id, ref) => {
//       figureTracker.current[id] = { ref }
//       updateImageNumbers()
//     },
//     [figureTracker]
//   )
//   const unregisterFigure = useCallback(
//     (id) => {
//       delete figureTracker.current[id]
//       updateImageNumbers()
//     },
//     [figureTracker]
//   )

//   const data = {
//     registerFigure,
//     unregisterFigure,
//     figureData: figureTracker.current,
//   }
//   return <FigureIdContext.Provider value={data}>{children}</FigureIdContext.Provider>
// }
