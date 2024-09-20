import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'lodash/isEqual'
import styled from 'styled-components'
import { isEmpty } from 'lodash'
import { th } from '@coko/client'
import { PlusOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import mapValues from 'lodash/mapValues'
import { Form, Upload, Image } from 'antd'
import { Box, Center, Input, TextArea, Spin } from '../common'
import CopyrightLicenseInput from './CopyrightLicenseInput'
import ISBNList from './ISBNList'

const FormSection = styled.div`
  border-top: 2px solid ${th('colorText')};
`

const BookMetadataForm = ({
  initialValues,
  onSubmitBookMetadata,
  canChangeMetadata,
  onUploadBookCover,
}) => {
  const [form] = Form.useForm()
  const { coverUrl, ...rest } = initialValues

  const transformedInitialValues = mapValues(rest, (value, key) => {
    const dateFields = ['ncCopyrightYear', 'saCopyrightYear']
    return dateFields.includes(key) && dayjs(value).isValid()
      ? dayjs(value)
      : value
  })

  const [initialFormValues, setInitialFormValues] = useState(
    transformedInitialValues,
  )

  if (isEmpty(transformedInitialValues.isbns)) {
    transformedInitialValues.isbns = []
  }

  useEffect(() => {
    if (!isEqual(initialFormValues, transformedInitialValues)) {
      form.setFieldsValue(transformedInitialValues)
      setInitialFormValues(transformedInitialValues)
    }
  }, [form, rest])

  useEffect(() => {
    if (coverUrl) {
      setCover([
        {
          uid: '-1',
          name: 'cover',
          status: 'done',
          url: coverUrl,
        },
      ])
    }
  }, [coverUrl])

  const [cover, setCover] = useState(
    coverUrl
      ? [
          {
            uid: '-1',
            name: 'cover',
            status: 'done',
            url: coverUrl,
          },
        ]
      : [],
  )

  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')

  const handleCoverUpload = ({ file }) => {
    if (file.status === 'removed') {
      onUploadBookCover(null)
    } else {
      onUploadBookCover(file).then(({ data: { uploadBookCover } = {} }) => {
        setCover([
          {
            uid: uploadBookCover.cover[0].fileId,
            name: 'cover',
            status: 'done',
            url: uploadBookCover.cover[0].coverUrl,
          },
        ])
      })
    }
  }

  const handlePreview = async file => {
    setPreviewImage(file.url || file.preview)
    setPreviewOpen(true)
  }

  const handleFormUpdate = () => {
    form
      .validateFields()
      .then(values => {
        onSubmitBookMetadata(values)
      })
      .catch(info => {
        console.error('Validate Failed:', info)
      })
  }

  if (!initialValues.title) {
    return (
      <Spin style={{ display: ' grid', placeContent: 'center' }} spinning />
    )
  }

  return (
    <Box>
      <Center>
        <Form
          form={form}
          initialValues={transformedInitialValues}
          onValuesChange={handleFormUpdate}
          preserve={false}
        >
          <p>
            This information will be used for additional book pages that are
            optional, go to Preview to see the pages and decide which ones you
            want to include in your book
          </p>
          <FormSection>
            <h2>COVER PAGE</h2>
            <Form.Item
              label="Upload cover image"
              labelCol={{ span: 24 }}
              valuePropName="fileList"
            >
              <Upload
                accept="image/*"
                beforeUpload={() => false}
                disabled={!canChangeMetadata}
                fileList={cover}
                listType="picture-card"
                maxCount={1}
                onChange={handleCoverUpload}
                onPreview={handlePreview}
                onRemove={() => setCover([])}
              >
                {cover?.length === 0 ? (
                  <button
                    style={{ border: 0, background: 'none' }}
                    type="button"
                  >
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </button>
                ) : null}
              </Upload>
              {previewImage && (
                <Image
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: visible => setPreviewOpen(visible),
                    afterOpenChange: visible => !visible && setPreviewImage(''),
                  }}
                  src={previewImage}
                  wrapperStyle={{ display: 'none' }}
                />
              )}
            </Form.Item>
            {cover?.length > 0 ? (
              <Form.Item
                label="Alt text for cover image"
                labelCol={{ span: 24 }}
                name="coverAlt"
              >
                <Input disabled={!canChangeMetadata} />
              </Form.Item>
            ) : null}
          </FormSection>
          <FormSection>
            <h2>TITLE PAGE</h2>
            <Form.Item
              label="Title"
              labelCol={{ span: 24 }}
              name="title"
              rules={[{ required: true, message: 'Title is required' }]}
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
            <h2>COPYRIGHT PAGE</h2>
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
        </Form>
      </Center>
    </Box>
  )
}

BookMetadataForm.propTypes = {
  /* eslint-disable-next-line react/forbid-prop-types */
  initialValues: PropTypes.shape({
    coverUrl: PropTypes.string,
    coverAlt: PropTypes.string,
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
  canChangeMetadata: PropTypes.bool.isRequired,
  onSubmitBookMetadata: PropTypes.func.isRequired,
  onUploadBookCover: PropTypes.func.isRequired,
}

export default BookMetadataForm
