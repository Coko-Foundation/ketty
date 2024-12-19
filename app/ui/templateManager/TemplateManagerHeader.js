import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Button } from '../common'

const Wrapper = styled.header`
  align-items: center;
  display: flex;
  justify-content: space-between;
`

const TemplateManagerHeader = props => {
  const { openNewTemplateModal } = props
  return (
    <Wrapper>
      <h1>Template manager</h1>
      <Button onClick={openNewTemplateModal}>+ Add template</Button>
    </Wrapper>
  )
}

TemplateManagerHeader.propTypes = {
  openNewTemplateModal: PropTypes.func,
}

TemplateManagerHeader.defaultProps = {
  openNewTemplateModal: null,
}

export default TemplateManagerHeader
