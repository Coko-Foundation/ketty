/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react'
import { Divider } from 'antd'
import styled from 'styled-components'
import { Modal, Button, Stack } from '../common'

const StyledButton = styled(Button)`
  align-self: start;
`

const StyledTextarea = styled.textarea`
  --space: 8px;
  border: 1px solid gainsboro;
`

const FlaxTemplateCustomization = props => {
  const {
    onApplyChanges,
    customParts: { customHeader, customFooter } = {},
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

  useEffect(() => {
    if (openModal) {
      if (customHeader && headerRef.current && !headerRef.current.value) {
        headerRef.current.value = customHeader
      }

      if (customFooter && footerRef.current && !footerRef.current.value) {
        footerRef.current.value = customFooter
      }
    }
  }, [
    customHeader,
    customFooter,
    headerRef.current,
    footerRef.current,
    openModal,
  ])

  return (
    <>
      <Divider />
      <StyledButton disabled={loading} onClick={() => setOpenModal(true)}>
        {!!customHeader || !!customFooter
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
              id="customHeader"
              key={headerRef.current?.value}
              placeholder="HTML that will appear on top of the web page"
              ref={headerRef}
              rows={7}
            />
          </Stack>
          <Stack>
            <label htmlFor="customFooter">Custom footer</label>
            <StyledTextarea
              id="customFooter"
              key={footerRef.current?.value}
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

export default FlaxTemplateCustomization
