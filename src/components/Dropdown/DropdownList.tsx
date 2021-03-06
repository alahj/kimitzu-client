import React from 'react'

import './DropdownList.css'

interface Item {
  id?: string
  title: string
  tags?: string[]
  children?: Item[]
}

interface Style {
  [key: string]: string
}

interface Props {
  items: Item[]
  listIndex: number
  show?: boolean
  dataUkDropdown?: string
  handleHoverItem?: (dropdownIndex: number, itemIndex: number) => void
  handlePointerLeave?: (dropdownIndex) => void
  handleItemSelect: (itemValue: string, itemId?: string) => void
  closeDropdown: () => void
  selectedIndex?: number
  style?: Style
  id: string
}

const DropdownList = ({
  dataUkDropdown,
  listIndex,
  items,
  show,
  handleHoverItem,
  handlePointerLeave,
  handleItemSelect,
  closeDropdown,
  selectedIndex,
  style,
  id,
}: Props) => {
  return (
    <div
      style={style}
      className={`uk-dropdown uk-padding-small uk-margin-remove ${
        show ? 'dropdown-keep-open' : ''
      }`}
      data-uk-dropdown={dataUkDropdown}
      onPointerLeave={
        handlePointerLeave
          ? () => handlePointerLeave(listIndex)
          : () => {
              console.log('do nothing')
            }
      }
    >
      <ul id={`${id}-dropdown-list-items`} className="uk-nav uk-dropdown-nav">
        {items.map((item: Item, index: number) => (
          <li
            key={item.title}
            id={selectedIndex === index ? 'selected-list-item' : ''}
            onPointerEnter={
              handleHoverItem
                ? () => handleHoverItem(listIndex, index)
                : () => {
                    console.log('do nothing')
                  }
            }
            className="uk-flex uk-flex-row uk-flex-middle"
            onClick={e => {
              e.stopPropagation()
              handleItemSelect(item.title, item.id)
              closeDropdown()
            }}
          >
            <a id="dropdown-item-title" href="/#" onClick={evt => evt.preventDefault()}>
              {item.title}
            </a>
            {(item.children && item.children.length > 0) || (item.tags && item.tags.length > 0) ? (
              <span className="uk-flex-1 uk-text-right" data-uk-icon="icon: triangle-right" />
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default DropdownList
