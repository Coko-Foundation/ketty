import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Wax } from 'wax-prosemirror-core'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { grid, th } from '@coko/client'
import { Button, Divider, Link, Switch } from '../common'
import { SimpleLayout } from '../wax/layout'
import simpleConfig from '../wax/config/simpleConfig'
import StyledControlWrapper from './StyledControlWrapper'

const SignupToggleIndicator = styled.p`
  flex-basis: 100%;
  text-align: end;
`

const TCWrapper = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: ${grid(5)};

  > div:last-child {
    align-items: center;
    display: flex;
    gap: calc(16px);
  }

  button[disabled] {
    /* stylelint-disable-next-line declaration-no-important */
    opacity: 1 !important;
  }
`

const TCHeader = styled.h2`
  &::first-letter {
    text-transform: capitalize;
  }
`

const UpdateResult = styled.span`
  color: ${props => (props.$success ? th('colorSuccess') : th('colorError'))};
  display: inline-flex;
  gap: ${grid(1)};
`

const TermsAndConditions = props => {
  const {
    termsAndConditions,
    onTCUpdate,
    onSignupToggleChange,
    allowSignups,
    paramsLoading,
  } = props

  const { t } = useTranslation(null, { keyPrefix: 'pages.admin' })

  const waxRef = useRef()
  const [tcUpdateResult, setTCUpdateResult] = useState()

  const udpateTermsAndConditions = () => {
    setTCUpdateResult({ loading: true })
    onTCUpdate(waxRef.current.getContent())
      .then(() => {
        setTCUpdateResult({
          success: true,
          message: t('termsAndConditions.update.success'),
        })
        setTimeout(() => {
          setTCUpdateResult(null)
        }, 5000)
      })
      .catch(() => {
        setTCUpdateResult({
          success: false,
          message: t('termsAndConditions.update.error'),
        })
        setTimeout(() => {
          setTCUpdateResult(null)
        }, 5000)
      })
  }

  return (
    <>
      <TCHeader>User signup</TCHeader>
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
      <Divider />
      <TCHeader>{t('termsAndConditions.heading')}</TCHeader>
      <p>{t('termsAndConditions.explanation')}</p>
      <TCWrapper>
        <Wax
          autoFocus={false}
          config={simpleConfig}
          id="termsAndConditionsEditor"
          key={termsAndConditions}
          layout={SimpleLayout}
          ref={waxRef}
          value={termsAndConditions}
        />
        <div>
          <Button
            data-test="admindb-updateTC-btn"
            onClick={udpateTermsAndConditions}
          >
            {t('termsAndConditions.update')}
          </Button>
          <UpdateResult $success={tcUpdateResult?.success} role="status">
            {tcUpdateResult?.message && (
              <>
                {tcUpdateResult?.success ? (
                  <CheckOutlined />
                ) : (
                  <CloseOutlined />
                )}

                {tcUpdateResult?.message}
              </>
            )}
          </UpdateResult>
        </div>
      </TCWrapper>
    </>
  )
}

TermsAndConditions.propTypes = {
  termsAndConditions: PropTypes.string,
  onTCUpdate: PropTypes.func,
  onSignupToggleChange: PropTypes.func,
  allowSignups: PropTypes.bool,
  paramsLoading: PropTypes.bool,
}
TermsAndConditions.defaultProps = {
  termsAndConditions: '',
  onTCUpdate: null,
  onSignupToggleChange: null,
  allowSignups: false,
  paramsLoading: false,
}

export default TermsAndConditions
