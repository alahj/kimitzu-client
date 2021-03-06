import React from 'react'

import { FollowersCardGroup, ListingCardGroup } from '../CardGroup'
import { ProfileBasicInfoSegment, RatingsAndReviewsSegment } from '../Segment'

import { ListingResponse } from '../../models/Listing'
import Profile from '../../models/Profile'

import { localeInstance } from '../../i18n'
import KimitzuCompletionRatings from '../../models/KimitzuCompletionRatings'
import KimitzuFulfillmentRatings from '../../models/KimitzuFulfillmentRatings'

interface Props {
  profile: Profile
  currentUser: Profile
  listings: ListingResponse[]
  followersList: string[]
  followingList: string[]
  kimitzuFulfillmentRatings: KimitzuFulfillmentRatings
  kimitzuCompletionRatings: KimitzuCompletionRatings
}

const ProfileSwitcher = ({
  followersList,
  followingList,
  profile,
  currentUser,
  listings,
  kimitzuCompletionRatings,
  kimitzuFulfillmentRatings,
}: Props) => {
  const { profilePage } = localeInstance.get.localizations

  return (
    <ul id="container-profile" className="uk-switcher">
      <li>
        <ProfileBasicInfoSegment profile={profile} />
      </li>
      <li>
        {listings ? (
          <ListingCardGroup data={listings} targetCurrency={currentUser.preferences.fiat} />
        ) : (
          <div className="uk-flex uk-flex-center uk-flex-middle">
            <h4>{profilePage.noListingsHeader}</h4>
          </div>
        )}
      </li>
      <li id="profile-ratings">
        <div className="uk-flex">
          <div className="uk-flex-1 uk-padding divider border-remove-vertical border-remove-left">
            <h4 className="uk-text-bold uk-text-center">{profilePage.buyerRatingsHeader}</h4>
            <div className="uk-padding-small uk-padding-remove-horizontal">
              <RatingsAndReviewsSegment ratings={kimitzuCompletionRatings} />
            </div>
          </div>
          <div className="uk-flex-1 uk-padding">
            <h4 className="uk-text-bold uk-text-center">{profilePage.sellerRatingsHeader}</h4>
            <div className="uk-padding-small uk-padding-remove-horizontal">
              <RatingsAndReviewsSegment ratings={kimitzuFulfillmentRatings} />
            </div>
          </div>
        </div>
      </li>
      <li>
        <FollowersCardGroup peerIDs={followersList} />
      </li>
      <li>
        <FollowersCardGroup peerIDs={followingList} isFollowingList />
      </li>
      <li>{profilePage.redirectSpinnerText}</li>
      <li>{profilePage.redirectSpinnerText}</li>
    </ul>
  )
}

export default ProfileSwitcher
