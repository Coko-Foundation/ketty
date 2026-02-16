import React from 'react'
import { useMutation } from '@apollo/client'
import { useCurrentUser } from '@coko/client'

import { UPDATE_USER_PROFILE, UPDATE_USER_PASSWORD } from '../graphql'
import { Profile } from '../ui'

const ProfilePage = () => {
  const { currentUser, setCurrentUser } = useCurrentUser()
  const [updateProfileMutation] = useMutation(UPDATE_USER_PROFILE)
  const [updatePasswordMutation] = useMutation(UPDATE_USER_PASSWORD)

  const handleProfileUpdate = values => {
    const { givenNames, surname, displayName, email, avatar, avatarAlt } =
      values

    const variables = {
      input: {
        id: currentUser?.id,
        givenNames,
        surname,
        displayName,
        email,
        avatar: avatar?.originFileObj,
        avatarAlt,
      },
    }

    return updateProfileMutation({ variables }).then(
      ({ data: { updateUserProfile } = {} }) => {
        setCurrentUser({
          ...currentUser,
          displayName: updateUserProfile?.displayName,
          givenNames: updateUserProfile?.givenNames,
          surname: updateUserProfile?.surname,
          avatar: updateUserProfile?.avatar,
          defaultIdentity: {
            ...currentUser.defaultIdentity,
            email: updateUserProfile?.defaultIdentity?.email,
          },
        })
      },
    )
  }

  const handlePasswordUpdate = values => {
    const { currentPassword, newPassword } = values

    const variables = {
      input: {
        id: currentUser?.id,
        currentPassword,
        newPassword,
      },
    }

    return updatePasswordMutation({ variables })
  }

  return (
    <Profile
      currentUser={currentUser}
      onPasswordUpdate={handlePasswordUpdate}
      onProfileUpdate={handleProfileUpdate}
    />
  )
}

export default ProfilePage
