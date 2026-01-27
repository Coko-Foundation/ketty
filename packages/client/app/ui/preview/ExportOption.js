import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { grid, th } from '@coko/client'

const Label = styled.label`
  align-items: center;
  color: ${th('colorText')};
  display: flex;
  flex-wrap: wrap;
  gap: ${grid(2)};
  max-width: 500px;
  min-block-size: 32px;
  white-space: nowrap;

  > * {
    width: fit-content;
  }

  &:focus-within > * {
    outline: 2px solid ${th('colorOutline')};
  }
`

const ExportOption = props => {
  const { className, children, label, id } = props

  return (
    <Label className={className} {...(id ? { id } : {})}>
      {label}
      {children}
    </Label>
  )
}

ExportOption.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string,
  inline: PropTypes.bool,
}

ExportOption.defaultProps = {
  inline: false,
  id: null,
}

export default ExportOption
