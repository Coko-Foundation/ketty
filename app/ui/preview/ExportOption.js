import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

import { grid, th } from '@coko/client'

const Wrapper = styled.div`
  max-width: 500px;
`

const Label = styled.div`
  color: ${th('colorTextLight')};
  text-transform: capitalize;

  /* stylelint-disable-next-line order/properties-alphabetical-order */
  ${props =>
    props.inline
      ? css`
          display: inline-block;
          margin-right: ${grid(1)};
        `
      : css`
          margin-bottom: ${grid(2)};
        `}
`

const ChildWrapper = styled.div`
  align-items: center;
  display: ${props => (props.inline ? 'inline-flex' : 'block')};
  gap: 4px;

  > &:focus-within {
    outline: 1px solid ${th('colorOutline')};
  }
`

const ExportOption = props => {
  const { className, children, label, inline, labelId } = props

  return (
    <Wrapper {...(labelId ? { id: labelId } : {})} className={className}>
      <Label inline={inline}>{label}:</Label>
      <ChildWrapper inline={inline}>{children}</ChildWrapper>
    </Wrapper>
  )
}

ExportOption.propTypes = {
  label: PropTypes.string.isRequired,
  labelId: PropTypes.string,
  inline: PropTypes.bool,
}

ExportOption.defaultProps = {
  inline: false,
  labelId: null,
}

export default ExportOption
