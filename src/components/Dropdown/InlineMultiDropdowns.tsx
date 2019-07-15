import React, { useEffect, useState } from 'react'
import useForceUpdate from 'use-force-update'

import ServiceCategories from '../../constants/ServiceCategories.json'

import DropdownList from './DropdownList'

interface Item {
  id: string
  title: string
  tags: string[]
  children?: Item[]
}

interface InlineMultiDropdownsProps {
  handleItemSelect: (selectedItem: string) => void
  title: string
}

const InlineMultiDropdowns = ({ handleItemSelect, title }: InlineMultiDropdownsProps) => {
  const forceUpdate = useForceUpdate()
  const [listItems, setListItems] = useState<Item[][]>([ServiceCategories])
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([])
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const [minDropdownHeight, setMinDropdownHeight] = useState(0)
  const [dropdownWidth] = useState(250)

  const closeDropdown = () => {
    setFocusedIndex(-1)
    setSelectedIndexes([])
  }
  const handlePointerLeave = (dropdownIndex: number) => {
    if (focusedIndex + 1 === dropdownIndex) {
      closeDropdown()
      forceUpdate()
    }
  }
  const handleHoverItem = (dropdownIndex: number, itemIndex: number) => {
    const nextDropdownIndex = dropdownIndex + 1
    let indexes = selectedIndexes
    indexes[dropdownIndex] = itemIndex
    if (dropdownIndex < focusedIndex) {
      indexes = indexes.slice(0, dropdownIndex)
      setSelectedIndexes(indexes)
    }
    setFocusedIndex(dropdownIndex)
    listItems[nextDropdownIndex] = listItems[dropdownIndex][itemIndex].children || []
    setListItems(listItems)
    forceUpdate()
  }
  useEffect(() => {
    window.addEventListener('mousedown', closeDropdown)
    if (minDropdownHeight === 0) {
      const dropdownElem = document.getElementById('dropdownlist')
      if (dropdownElem && dropdownElem.children[1]) {
        setMinDropdownHeight(dropdownElem.children[1].clientHeight)
      }
    }
    return () => {
      window.removeEventListener('mousedown', closeDropdown)
    }
  })

  return (
    <ul className="uk-subnav uk-subnav-pill">
      <li id="dropdownlist">
        <a onClick={() => (focusedIndex !== -1 ? setFocusedIndex(-1) : setFocusedIndex(0))}>
          {title}
          <span data-uk-icon="icon: triangle-down" />
        </a>
        {listItems.map((items, index) => {
          return items.length > 0 ? (
            <DropdownList
              key={`drop${index}`}
              style={{
                minHeight: index !== 0 ? `${minDropdownHeight}px` : '',
                width: `${dropdownWidth}px`,
                left: `${20 + index * dropdownWidth}px`,
              }}
              selectedIndex={selectedIndexes[index]}
              dataUkDropdown={`${index === 0 ? 'mode: click' : 'pos: right-center'}`}
              listIndex={index}
              show={focusedIndex > -1 && index <= focusedIndex + 1}
              items={items}
              handlePointerLeave={handlePointerLeave}
              handleHoverItem={handleHoverItem}
              handleItemSelect={handleItemSelect}
            />
          ) : null
        })}
      </li>
    </ul>
  )
}

export default InlineMultiDropdowns