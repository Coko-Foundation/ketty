import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useTranslation, Trans } from 'react-i18next'
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
  const { t } = useTranslation(null, { keyPrefix: 'pages.admin.userSignup' })

  return (
    <>
      <Heading>{t('heading')}</Heading>
      <p>
        <Trans
          components={[<Link to="/users-manager" />]}
          i18nKey="pages.admin.userSignup.explanation"
          values={{ userName: 'Manage Users page' }}
        />
      </p>
      <StyledControlWrapper>
        <span>{t('setting')}</span>
        <Switch
          checked={allowSignups}
          data-test="admindb-signup-switch"
          loading={paramsLoading}
          onChange={onSignupToggleChange}
        />
        <SignupToggleIndicator>
          {allowSignups ? t('state.on') : t('state.off')}
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
