import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
// import { EditOutlined } from '@ant-design/icons'

import { grid } from '@coko/client'

import { Select } from '../common'

// #region styled
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${grid(2)};
`

// #endregion styled

const ProfileRow = props => {
  const {
    // canModifyProfiles,
    className,
    // isNewProfileSelected,
    onProfileChange,
    // onProfileRename,
    profiles,
    selectedProfile,
    loadingPreview,
  } = props

  const handleSelectProfile = (_, option) => {
    onProfileChange(option.value)
  }

  return (
    <Wrapper className={className}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label htmlFor="select-profile">Choose a saved profile</label>
      <Select
        disabled={loadingPreview}
        id="select-profile"
        onChange={handleSelectProfile}
        optionLabelProp="label"
        options={profiles}
        size="large"
        value={selectedProfile.value}
      />
    </Wrapper>
  )
}

ProfileRow.propTypes = {
  // canModifyProfiles: PropTypes.bool.isRequired,
  profiles: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }),
  ),
  selectedProfile: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  }),
  // isNewProfileSelected: PropTypes.bool.isRequired,
  onProfileChange: PropTypes.func.isRequired,
  loadingPreview: PropTypes.bool,
  // onProfileRename: PropTypes.func.isRequired,
}

ProfileRow.defaultProps = {
  profiles: [],
  selectedProfile: null,
  loadingPreview: false,
}

export default ProfileRow
