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

const Heading = styled.h2`
  &::first-letter {
    text-transform: capitalize;
  }
`

const Wrapper = styled.div`
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

const UpdateResult = styled.span`
  color: ${props => (props.$success ? th('colorSuccess') : th('colorError'))};
  display: inline-flex;
  gap: ${grid(1)};
`

const A11yStatementEditor = props => {
  const { a11yStatement, onA11yStatementUpdate } = props

  const { t } = useTranslation(null, { keyPrefix: 'pages.admin' })

  const waxRef = useRef()
  const [a11yUpdateResult, setA11YUpdateResult] = useState()

  const udpateA11yStatement = () => {
    setA11YUpdateResult({ loading: true })
    onA11yStatementUpdate(waxRef.current.getContent())
      .then(() => {
        setA11YUpdateResult({
          success: true,
          message: t('termsAndConditions.update.success'),
        })
        setTimeout(() => {
          setA11YUpdateResult(null)
        }, 5000)
      })
      .catch(() => {
        setA11YUpdateResult({
          success: false,
          message: t('termsAndConditions.update.error'),
        })
        setTimeout(() => {
          setA11YUpdateResult(null)
        }, 5000)
      })
  }

  return (
    <>
      <Heading>Accessibility statement</Heading>
      <p>You can edit the accessibility statement in the editor below</p>
      <Wrapper>
        <Wax
          autoFocus={false}
          config={simpleConfig}
          id="a11yStatementEditor"
          key={a11yStatement}
          layout={SimpleLayout}
          ref={waxRef}
          value={a11yStatement}
        />
        <div>
          <Button onClick={udpateA11yStatement}>
            {t('termsAndConditions.update')}
          </Button>
          <UpdateResult $success={a11yUpdateResult?.success} role="status">
            {a11yUpdateResult?.message && (
              <>
                {a11yUpdateResult?.success ? (
                  <CheckOutlined />
                ) : (
                  <CloseOutlined />
                )}

                {a11yUpdateResult?.message}
              </>
            )}
          </UpdateResult>
        </div>
      </Wrapper>
    </>
  )
}

A11yStatementEditor.propTypes = {
  a11yStatement: PropTypes.string,
  onA11yStatementUpdate: PropTypes.func,
}
A11yStatementEditor.defaultProps = {
  a11yStatement: '',
  onA11yStatementUpdate: null,
}

export default A11yStatementEditor
