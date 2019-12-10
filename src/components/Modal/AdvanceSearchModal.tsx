import React, { useState } from 'react'
import PhysicalCharacteristics from '../../constants/PhysicalCharacteristics.json'
import { localeInstance } from '../../i18n/index'
import { searchInstance } from '../../models/Search'

interface AdvanceSearchInterface {
  [key: string]: any
}

const AdvanceSearchModal = ({ onSearchSubmit }) => {
  const [filters, setFilters] = useState({} as AdvanceSearchInterface)
  const locale = localeInstance.get.localizations

  function handleChange(name, value) {
    const rawFilter = { ...filters }
    if (!value) {
      delete rawFilter[name]
    } else {
      if (typeof value === 'object') {
        if (!value.min) {
          value.min = 0
        }
        if (!value.max) {
          value.max = 99999
        }
      }
      rawFilter[name] = value
    }
    setFilters(rawFilter)
  }

  async function executeSearch() {
    window.UIkit.modal('#advance-search-modal').hide()
    const parsedAdvancedSearchFilters = Object.keys(filters).map(filter => {
      const searchObject = filters[filter]
      if (typeof searchObject === 'object') {
        const template =
          '(asInt(getPropAsString(doc.vendorID.peerID, "%fieldName%")) >= %min% && asInt(getPropAsString(doc.vendorID.peerID, "%fieldName%")) <= %max%) && hasProp(doc.vendorID.peerID, "%fieldName%")'
        return template
          .replace(/%fieldName%/g, filter)
          .replace(/%min%/g, searchObject.min)
          .replace(/%max%/g, searchObject.max)
      } else {
        const template =
          'getPropAsString(doc.vendorID.peerID, "%fieldName%") == "%fieldValue%" && hasProp(doc.vendorID.peerID, "%fieldName%")'
        return template.replace(/%fieldName%/g, filter).replace(/%fieldValue%/g, searchObject)
      }
    })
    searchInstance.advancedSearch = parsedAdvancedSearchFilters
    await onSearchSubmit()
  }

  async function resetAdvancedFilters() {
    if (Object.keys(filters).length > 0) {
      setFilters({})
      searchInstance.advancedSearch = []
      await onSearchSubmit()
    } else {
      window.UIkit.modal('#advance-search-modal').hide()
    }
  }

  return (
    <div id="advance-search-modal" className="uk-modal" data-uk-modal bg-close="false">
      <form
        className="uk-modal-dialog"
        onSubmit={evt => {
          evt.preventDefault()
          executeSearch()
        }}
      >
        <button className="uk-modal-close-default" type="button" data-uk-close />
        <div className="uk-modal-header">
          <h2 className="uk-modal-title">{locale.advancedSearch}</h2>
        </div>
        <div className="uk-modal-body">
          <div className="uk-grid uk-grid-small" data-uk-grid>
            {Object.keys(PhysicalCharacteristics).map((characteristic, index) => {
              const values = PhysicalCharacteristics[characteristic]

              if (Array.isArray(values)) {
                return (
                  <div className="uk-width-1-2@m uk-width-1-1@s" key={characteristic}>
                    <label className="uk-form-label color-primary">{characteristic}</label>
                    <div className="uk-form-controls">
                      <select
                        className="uk-select"
                        id="form-horizontal-select"
                        onChange={evt => {
                          handleChange(characteristic, evt.target.value)
                        }}
                      >
                        {values.map((value, valueIndex) => {
                          return (
                            <option key={`${value}-${valueIndex}`} value={value}>
                              {value}
                            </option>
                          )
                        })}
                      </select>
                    </div>
                  </div>
                )
              } else {
                return (
                  <div className="uk-width-1-2@m uk-width-1-1@s" key={characteristic}>
                    <label className="uk-form-label color-primary">{characteristic}</label>
                    <div className="uk-form-controls">
                      <input
                        key={`${index}-input-start`}
                        className="uk-input uk-width-1-2"
                        type={values}
                        placeholder={locale.minimum}
                        onChange={evt => {
                          let filterValue = filters[characteristic]
                          if (!filterValue) {
                            filterValue = {}
                          }
                          filterValue.min = evt.target.value
                          handleChange(characteristic, filterValue)
                        }}
                      />
                      <input
                        key={`${index}-input-end`}
                        className="uk-input uk-width-1-2"
                        type={values}
                        min="0"
                        placeholder={locale.maximum}
                        onChange={evt => {
                          let filterValue = filters[characteristic]
                          if (!filterValue) {
                            filterValue = {}
                          }
                          filterValue.max = evt.target.value
                          handleChange(characteristic, filterValue)
                        }}
                      />
                    </div>
                  </div>
                )
              }
            })}
          </div>
        </div>
        <div className="uk-modal-footer uk-text-right">
          <button className="uk-button uk-margin-right" type="reset" onClick={resetAdvancedFilters}>
            {Object.keys(filters).length > 0 ? locale.reset : locale.close}
          </button>
          <button className="uk-button uk-button-primary" type="submit">
            {locale.search}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdvanceSearchModal