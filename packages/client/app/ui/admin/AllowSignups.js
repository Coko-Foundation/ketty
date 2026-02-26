import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Link, Switch } from '../common'
import StyledControlWrapper from './StyledControlWrapper'

const Heading = styled.h2`
  &::first-letter {
    text-transform: capitalize;
  }
`

const SignupToggleIndicator = styled.p`
  flex-basis: 100%;
  text-align: end;
`

const AllowSignups = props => {
  const { allowSignups, paramsLoading, onSignupToggleChange } = props

  return (
    <>
      <Heading>User signup</Heading>
      <p>
        By toggling the button below you can allow or disallow new users to sign
        up freely in your instance from the signup page. As an admin you can
        always invite users in the{' '}
        <Link to="/users-manager">Manage Users page</Link>.
      </p>
      <StyledControlWrapper>
        <span>Open user signup to the instance</span>
        <Switch
          checked={allowSignups}
          data-test="admindb-signup-switch"
          loading={paramsLoading}
          onChange={onSignupToggleChange}
        />
        <SignupToggleIndicator>
          Signups are {allowSignups ? 'open' : 'closed'}
        </SignupToggleIndicator>
      </StyledControlWrapper>
    </>
  )
}

AllowSignups.propTypes = {
  onSignupToggleChange: PropTypes.func,
  allowSignups: PropTypes.bool,
  paramsLoading: PropTypes.bool,
}

AllowSignups.defaultProps = {
  onSignupToggleChange: null,
  allowSignups: false,
  paramsLoading: false,
}

export default AllowSignups
