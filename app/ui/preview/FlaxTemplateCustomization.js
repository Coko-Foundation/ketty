/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Divider } from 'antd'
import styled from 'styled-components'
import { grid, th } from '@coko/client'
import { Modal, Button, Stack } from '../common'

const StyledButton = styled(Button)`
  align-self: start;
`

const StyledTextarea = styled.textarea`
  --space: ${grid(2)};
  border: 1px solid ${th('colorBorder')};
`

const FlaxTemplateCustomization = props => {
  const {
    onApplyChanges,
    runningBlocks: { header, footer },
    loading,
  } = props

  const [openModal, setOpenModal] = useState(false)
  const headerRef = useRef()
  const footerRef = useRef()

  const handleApplyChanges = () => {
    onApplyChanges({
      customHeader: headerRef.current.value,
      customFooter: footerRef.current.value,
    })

    setOpenModal(false)
  }

  return (
    <>
      <Divider />
      <StyledButton disabled={loading} onClick={() => setOpenModal(true)}>
        {!!header || !!footer
          ? 'Edit custom header & footer'
          : 'Add custom header & footer'}
      </StyledButton>

      <Modal
        okText="Apply changes"
        onCancel={() => setOpenModal(false)}
        onOk={handleApplyChanges}
        open={openModal}
        title="Flax template customisation"
      >
        <Stack>
          <Stack>
            <label htmlFor="customHeader">Custom header</label>
            <StyledTextarea
              defaultValue={header}
              id="customHeader"
              placeholder="HTML that will appear on top of the web page"
              ref={headerRef}
              rows={7}
            />
          </Stack>
          <Stack>
            <label htmlFor="customFooter">Custom footer</label>
            <StyledTextarea
              defaultValue={footer}
              id="customFooter"
              placeholder="HTML that will appear at the bootom of the web page"
              ref={footerRef}
              rows={7}
            />
          </Stack>
        </Stack>
      </Modal>
    </>
  )
}

FlaxTemplateCustomization.propTypes = {
  onApplyChanges: PropTypes.func,
  runningBlocks: PropTypes.shape({
    header: PropTypes.string,
    footer: PropTypes.string,
  }),
  loading: PropTypes.bool,
}

FlaxTemplateCustomization.defaultProps = {
  onApplyChanges: null,
  runningBlocks: {},
  loading: false,
}

export default FlaxTemplateCustomization
