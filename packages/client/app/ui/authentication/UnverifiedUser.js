import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { useTranslation } from 'react-i18next'
import { Page, Result, Button } from '../common'

const Wrapper = styled.div``

const ExtraWrapper = styled.div``

const UnverifiedUser = props => {
  const { className, resend } = props

  const { t } = useTranslation(null, { keyPrefix: 'pages.login' })

  return (
    <Page maxWidth={600}>
      <Wrapper className={className}>
        <Result
          extra={
            <ExtraWrapper>
              <Button onClick={resend} type="primary">
                {t('unverified.action')}
              </Button>
            </ExtraWrapper>
          }
          status="warning"
          subTitle={t('unverified.subtitle')}
          title={t('unverified.title')}
        />
      </Wrapper>
    </Page>
  )
}

UnverifiedUser.propTypes = {
  resend: PropTypes.func.isRequired,
}

export default UnverifiedUser
