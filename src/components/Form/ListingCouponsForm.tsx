import React from 'react'

import { InputSelector } from '../Input'
import InlineFormFields from './InlineFormFields'

const discountOptions = [
  {
    label: 'Percent',
    value: 'percent',
  },
  {
    label: 'USD',
    value: 'usd',
  },
]

interface Coupon {
  title: string
  code: string
  discountType: string
  discount: number
}

interface Props {
  coupons: Coupon[]
  handleInputChange: () => void
  handleSelectorChange: () => void
  handleAddCoupon: () => void
  handleContinue: () => void
}

const ListingCouponsForm = ({
  coupons,
  handleAddCoupon,
  handleContinue,
  handleInputChange,
  handleSelectorChange,
}: Props) => {
  const coupon1 = coupons.splice(0, 1)[0]
  return (
    <form className="uk-form-stacked">
      <fieldset className="uk-fieldset">
        <InlineFormFields
          fields={[
            {
              component: (
                <input
                  className="uk-input"
                  type="text"
                  value={coupon1 ? coupon1.title : ''}
                  onChange={handleInputChange}
                />
              ),
              label: {
                name: 'TITLE',
                required: true,
              },
            },
            {
              component: (
                <input
                  className="uk-input"
                  type="text"
                  value={coupon1 ? coupon1.code : ''}
                  onChange={handleInputChange}
                />
              ),
              label: {
                name: 'COUPON CODE',
                required: true,
              },
            },
            {
              component: (
                <InputSelector
                  options={discountOptions}
                  inputProps={{
                    value: coupon1 ? coupon1.discount : '',
                    onChange: handleInputChange,
                  }}
                  selectProps={{
                    onChange: handleSelectorChange,
                  }}
                  defaultSelectorVal={coupon1 ? coupon1.discountType : 'percent'}
                />
              ),
              label: {
                name: 'DISCOUNT',
                required: true,
              },
            },
          ]}
        />
        {coupons.map((coupon: Coupon) => (
          <InlineFormFields
            key={coupon.code}
            fields={[
              {
                component: (
                  <input
                    className="uk-input"
                    type="text"
                    value={coupon.title}
                    onChange={handleInputChange}
                  />
                ),
              },
              {
                component: (
                  <input
                    className="uk-input"
                    type="text"
                    value={coupon.code}
                    onChange={handleInputChange}
                  />
                ),
              },
              {
                component: (
                  <InputSelector
                    options={discountOptions}
                    inputProps={{
                      value: coupon.discount,
                      onChange: handleInputChange,
                    }}
                    selectProps={{
                      onChange: handleSelectorChange,
                    }}
                    defaultSelectorVal={coupon.discountType}
                  />
                ),
              },
            ]}
          />
        ))}
        <div>
          <a className="add-field" onClick={handleAddCoupon}>
            ADD COUPON +
          </a>
        </div>
      </fieldset>
      <div className="submit-btn-div">
        <button className="uk-button uk-button-primary" onClick={handleContinue}>
          CONTINUE
        </button>
      </div>
    </form>
  )
}

export default ListingCouponsForm
