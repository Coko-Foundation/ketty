import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Wax } from 'wax-prosemirror-core'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { grid, th } from '@coko/client'
import { Button } from '../common'
import { SimpleLayout } from '../wax/layout'
import simpleConfig from '../wax/config/simpleConfig'

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
  const { termsAndConditions, onTCUpdate } = props

  const { t } = useTranslation(null, {
    keyPrefix: 'pages.admin.termsAndConditions',
  })

  const waxRef = useRef()
  const [tcUpdateResult, setTCUpdateResult] = useState()

  const udpateTermsAndConditions = () => {
    setTCUpdateResult({ loading: true })
    onTCUpdate(waxRef.current.getContent())
      .then(() => {
        setTCUpdateResult({
          success: true,
          message: t('update.success'),
        })
        setTimeout(() => {
          setTCUpdateResult(null)
        }, 5000)
      })
      .catch(() => {
        setTCUpdateResult({
          success: false,
          message: t('update.error'),
        })
        setTimeout(() => {
          setTCUpdateResult(null)
        }, 5000)
      })
  }

  return (
    <>
      <TCHeader>{t('heading')}</TCHeader>
      <p>{t('explanation')}</p>
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
            {t('update')}
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
}

TermsAndConditions.defaultProps = {
  termsAndConditions: '',
  onTCUpdate: null,
}

export default TermsAndConditions
