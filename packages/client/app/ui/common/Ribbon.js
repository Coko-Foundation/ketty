import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

import { grid } from '@coko/client'

const Wrapper = styled.div`
  background: ${props => {
    const { status } = props
    if (status === 'success') return props.theme.colorSuccess
    if (status === 'error' || status === 'danger') return props.theme.colorError
    if (status === 'warning') return props.theme.colorWarning
    return props.theme.colorBackgroundHue
  }};
  border-radius: ${props => props.theme.borderRadius};
  color: ${props => {
    const { status } = props
    if (['success', 'error', 'danger', 'warning'].includes(status))
      return props.theme.colorTextReverse
    return props.theme.colorText
  }};
  opacity: 1;
  padding: ${grid(1)} ${grid(2)};
  text-align: center;
  transition: opacity 0.2s ease-in-out;

  /* stylelint-disable-next-line order/properties-alphabetical-order */
  ${props =>
    props.hide &&
    css`
      opacity: 0;
      visibility: hidden;
    `}
`

const Ribbon = props => {
  const { className, children, hide, status, ...rest } = props

  return (
    <Wrapper className={className} hide={hide} status={status} {...rest}>
      {children}
    </Wrapper>
  )
}

Ribbon.propTypes = {
  hide: PropTypes.bool,
  status: PropTypes.oneOf(['success', 'error', 'danger']),
}

Ribbon.defaultProps = {
  hide: false,
  status: null,
}

export default Ribbon
