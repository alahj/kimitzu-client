import { IonHeader, IonSearchbar, IonToolbar } from '@ionic/react'
import React, { useState } from 'react'

import { localeInstance } from '../../i18n'

const HomeHeader = () => {
  const [query, setQuery] = useState<string>('')
  const handleQueryChange = e => {
    setQuery(e.target.value)
  }
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const dmEvent = new CustomEvent('srchEvent', { detail: query })
    window.dispatchEvent(dmEvent)
  }
  const handleClearQuery = () => {
    setQuery('')
  }

  return (
    <IonHeader>
      <IonToolbar color="primary">
        <form onSubmit={handleSearchSubmit}>
          <IonSearchbar
            color="light"
            onIonClear={handleClearQuery}
            onIonChange={handleQueryChange}
            placeholder={localeInstance.get.localizations.mobileHeader.searchPlaceholder}
          />
        </form>
      </IonToolbar>
    </IonHeader>
  )
}

export default HomeHeader