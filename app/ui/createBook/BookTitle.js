import React from 'react'
import styled from 'styled-components'
import { grid } from '@coko/client'
import { Button } from 'antd'
import PropTypes from 'prop-types'
import { Form, Page } from '../common'

const StyledInput = styled.input`
  border: 0;
  font-size: 2em;

  :focus-visible {
    /* stylelint-disable-next-line declaration-no-important */
    outline: 0 !important;
  }
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  padding: ${grid(4)};
`

const BookTitle = ({ onClickContinue, title, canRename }) => {
  const [form] = Form.useForm()
  const bookTitle = Form.useWatch('bookTitle', form)

  const handleContinue = () => {
    if (!bookTitle || !canRename) {
      return
    }

    onClickContinue(bookTitle)
  }

  return (
    <Page maxWidth={1200}>
      <Wrapper>
        <Form
          form={form}
          initialValues={{ bookTitle: title }}
          onFinish={handleContinue}
        >
          <Form.Item name="bookTitle">
            <StyledInput autoFocus placeholder="Book title" type="text" />
          </Form.Item>
          <p>Don&apos;t overthink it, you can change your title at any time</p>
          <Button
            disabled={!bookTitle || !canRename}
            onClick={handleContinue}
            type="primary"
          >
            Continue
          </Button>
        </Form>
      </Wrapper>
    </Page>
  )
}

BookTitle.propTypes = {
  onClickContinue: PropTypes.func.isRequired,
  title: PropTypes.string,
  canRename: PropTypes.bool.isRequired,
}

BookTitle.defaultProps = { title: null }

export default BookTitle
