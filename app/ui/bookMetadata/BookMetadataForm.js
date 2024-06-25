import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { isEmpty } from 'lodash'
import { th } from '@coko/client'
import dayjs from 'dayjs'
import mapValues from 'lodash/mapValues'
import debounce from 'lodash/debounce'
import { Form } from 'antd'
import { Input, TextArea } from '../common'
import CopyrightLicenseInput from './CopyrightLicenseInput'
import ISBNList from './ISBNList'
import Center from '../common/styledPrimitives/Center'

const StyledForm = styled(Form)`
  height: 100%;
  margin: 0 auto;
  /* max-width: 800px; */
  overflow-y: auto;
  padding-right: 8px;
  width: 100%;
`

const FormSection = styled.div`
  border-top: 2px solid ${th('colorText')};
`

const BookMetadataForm = ({
  initialValues,
  onSubmitBookMetadata,
  canChangeMetadata,
  open,
  closeModal,
}) => {
  const [form] = Form.useForm()

  const isFirstRender = useRef(true)

  // useEffect(() => {
  //   if (isFirstRender.current) {
  //     console.log('this????')
  //     form.setFieldsValue(initialValues)
  //     isFirstRender.current = false
  //   }
  // }, [form, initialValues])

  const transformedInitialValues = mapValues(initialValues, (value, key) => {
    const dateFields = ['ncCopyrightYear', 'saCopyrightYear']
    return dateFields.includes(key) && dayjs(value).isValid()
      ? dayjs(value)
      : value
  })

  if (isEmpty(transformedInitialValues.isbns)) {
    transformedInitialValues.isbns = []
  }

  useEffect(() => {
    if (isFirstRender.current) {
      // form.setFieldsValue(initialValues)
      form.setFieldsValue(transformedInitialValues)
      isFirstRender.current = false
    }
  }, [form, initialValues])

  // <>
  // // <Modal
  // //   cancelText="Close"
  // //   centered
  // //   destroyOnClose
  // //   maskClosable={false}
  // //   okButtonProps={{
  // //     style: { backgroundColor: canChangeMetadata ? 'black' : '' },
  // //     disabled: !canChangeMetadata,
  // //   }}
  // //   okText="Save"
  // //   onCancel={closeModal}
  // //   onOk={() => {
  // //     form
  // //       .validateFields()
  // //       .then(values => {
  // //         onSubmitBookMetadata(values)
  // //         closeModal()
  // //       })
  // //       .catch(info => {
  // //         console.error('Validate Failed:', info)
  // //       })
  // //   }}
  // //   open={open}
  // //   title="Book Metadata"
  // //   width={840}
  // // >
  const handleMetadataUpdate = vals => {
    // console.log(vals)
    // console.log(form.getFieldsValue())
    debounce(() => {
      form.validateFields().then(values => {
        onSubmitBookMetadata(values)
      })
    }, 2000)()
  }

  return (
    <StyledForm
      form={form}
      initialValues={transformedInitialValues}
      // preserve={false}
      onValuesChange={handleMetadataUpdate}
    >
      <Center>
        <h2>BOOK METADATA</h2>
        <p>
          This information will be used for additional book pages that are
          optional, go to Preview to see the pages and decide which ones you
          want to include in your book
        </p>
        <FormSection>
          <h3>TITLE PAGE</h3>
          <Form.Item
            label="Title"
            labelCol={{ span: 24 }}
            name="title"
            // rules={[{ required: true, message: 'Title is required' }]}
            wrapperCol={{ span: 24 }}
          >
            <Input
              disabled={!canChangeMetadata}
              // placeholder="The history of future past"
            />
          </Form.Item>
          <Form.Item
            label="Subtitle"
            labelCol={{ span: 24 }}
            name="subtitle"
            wrapperCol={{ span: 24 }}
          >
            <Input disabled={!canChangeMetadata} placeholder="Optional" />
          </Form.Item>
          <Form.Item
            label="Authors"
            labelCol={{ span: 24 }}
            name="authors"
            // rules={[{ required: true, message: 'Authors is required' }]}
            wrapperCol={{ span: 24 }}
          >
            <Input disabled={!canChangeMetadata} placeholder="Jhon, Smith" />
          </Form.Item>
        </FormSection>

        <FormSection>
          <h3>COPYRIGHT PAGE</h3>
          <Form.Item
            label="ISBN List"
            labelCol={{ span: 24 }}
            style={{ marginBottom: '0px' }}
            wrapperCol={{ span: 24 }}
          >
            <ISBNList canChangeMetadata={canChangeMetadata} name="isbns" />
          </Form.Item>
          <Form.Item
            label="Top of the page"
            labelCol={{ span: 24 }}
            name="topPage"
            wrapperCol={{ span: 24 }}
          >
            <TextArea
              disabled={!canChangeMetadata}
              placeholder="Optional - Provide additional description that will appear on the top of the Copyright page"
            />
          </Form.Item>
          <Form.Item
            label="Bottom of the page"
            labelCol={{ span: 24 }}
            name="bottomPage"
            wrapperCol={{ span: 24 }}
          >
            <TextArea
              disabled={!canChangeMetadata}
              placeholder="Optional - Provide additional description that will appear on the top of the Copyright page"
            />
          </Form.Item>
          <Form.Item
            label="Copyright License"
            labelCol={{ span: 24 }}
            name="copyrightLicense"
            wrapperCol={{ span: 24 }}
          >
            <CopyrightLicenseInput canChangeMetadata={canChangeMetadata} />
          </Form.Item>
        </FormSection>
      </Center>
    </StyledForm>
  )
}

BookMetadataForm.propTypes = {
  /* eslint-disable-next-line react/forbid-prop-types */
  initialValues: PropTypes.shape({
    title: PropTypes.string,
    subtitle: PropTypes.string,
    authors: PropTypes.string.isRequired,
    isbns: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        isbn: PropTypes.string.isRequired,
      }),
    ).isRequired,
    topPage: PropTypes.string,
    bottomPage: PropTypes.string,
    copyrightLicense: PropTypes.oneOf(['SCL', 'PD', 'CC']),
    ncCopyrightHolder: PropTypes.string,
    ncCopyrightYear: PropTypes.string,
    // ncCopyrightYear: PropTypes.instanceOf(dayjs),
    saCopyrightHolder: PropTypes.string,
    saCopyrightYear: PropTypes.string,

    // saCopyrightYear: PropTypes.instanceOf(dayjs),
    licenseTypes: PropTypes.shape({
      NC: PropTypes.bool,
      SA: PropTypes.bool,
      ND: PropTypes.bool,
    }),
    publicDomainType: PropTypes.oneOf(['cc0', 'public']),
  }).isRequired,
  open: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  canChangeMetadata: PropTypes.bool.isRequired,
  onSubmitBookMetadata: PropTypes.func.isRequired,
}

export default BookMetadataForm
