import React from 'react'

import './RadioButtons.css'

interface Option {
  label: string
  value: string | boolean
}

interface Props {
  selectedVal: string
  handleSelect: (selectedItem: string | boolean) => void
  options: Option[]
}

const RadioButtons = (props: Props) => {
  const { selectedVal, handleSelect, options } = props
  return (
    <div id="radio-btns" className="uk-form-controls uk-form-controls-text">
      {options.map((option: Option) => (
        <label id="radio-label" key={option.value.toString()}>
          <input
            id="radio-input"
            className="uk-radio"
            type="radio"
            checked={option.value.toString() === selectedVal}
            onChange={evt => {
              if (evt.target.checked) {
                handleSelect(option.value)
              }
            }}
            name={option.value.toString()}
          />
          {option.label}
        </label>
      ))}
    </div>
  )
}

export default RadioButtons
