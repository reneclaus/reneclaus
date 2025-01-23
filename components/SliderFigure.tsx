'use client'

import { useState, useContext, ReactElement } from 'react'
import {Slider} from "@heroui/slider";
import { FigureIdContext } from './FigureIdContext'
import {PlotlyChartNoFigure} from './PlotlyChart'

export default function SliderFigure(props) {
  const getFigureId = useContext(FigureIdContext)
  const figureId = getFigureId(props.id)
  const id = props.id || `figure_${figureId}`

  let src = props.src
  let sliders: ReactElement[] = []
  for (var i = 0; i < props.sliders.length; i++) {
    const slider_name = props.sliders[i]
    const [sliderValue, setSliderValue] = useState(props[`${slider_name}_init`] || 0)
    const slider = <Slider
      key={`slider_${slider_name}`}
      label={slider_name}
      minValue={0}
      maxValue={props[`${slider_name}_max`]}
      value={sliderValue}
      showTooltip={true}
      showSteps={true}
      step={1}
      onChange={(value) => setSliderValue(value)}
    />
    src = src.replace(`\$\{${slider_name}\}`, sliderValue)
    sliders.push(slider)
  }

  return <>
  <figure id={id}>
    <PlotlyChartNoFigure {...props} src={src}/>
    {sliders}
    <figcaption>
      <h4>
        <a href={`#${id}`}>Figure {figureId}:</a>{' '}
        <span className="font-normal">{props.title}</span>
      </h4>
      {props.children}
    </figcaption>
  </figure>
  </>
}