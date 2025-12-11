import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { grid, th } from '@coko/client'
import { useTranslation } from 'react-i18next'
import { Button, Form, Input } from '../common'

const UpdateResult = styled.span`
  color: ${props => (props.$success ? th('colorSuccess') : th('colorError'))};
  display: inline-flex;
  gap: ${grid(1)};
  margin-inline-start: ${grid(2)};
`

const PdfDimensionsLabelForm = props => {
  const { availableDimensions, onLabelsUpdate } = props
  const [labelUpdateResult, setLabelUpdateResult] = useState()

  const [dimensionsForm] = Form.useForm()

  const { t } = useTranslation(null, { keyPrefix: 'pages.templateManager' })

  useEffect(() => {
    dimensionsForm.setFieldsValue(
      availableDimensions.reduce((acc, curr) => {
        acc[curr.value] = curr.label
        return acc
      }, {}),
    )
  }, [availableDimensions])

  const handleFormSubmit = () => {
    dimensionsForm.validateFields().then(vals => {
      const labelsArray = Object.keys(vals).map(key => ({
        value: key,
        label: vals[key],
      }))

      setLabelUpdateResult({ loading: true })

      onLabelsUpdate(labelsArray)
        .then(() => {
          setLabelUpdateResult({
            success: true,
            message: t('pdfDimensions.actions.save.success'),
          })
          setTimeout(() => {
            setLabelUpdateResult(null)
          }, 5000)
        })
        .catch(() => {
          setLabelUpdateResult({
            success: false,
            message: t('pdfDimensions.actions.save.error'),
          })
          setTimeout(() => {
            setLabelUpdateResult(null)
          }, 5000)
        })
    })
  }

  return (
    <Form
      form={dimensionsForm}
      labelAlign="left"
      labelCol={{ span: 3 }}
      onFinish={handleFormSubmit}
    >
      {availableDimensions.map(d => (
        <Form.Item
          label={d.value}
          name={d.value}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input disabled={labelUpdateResult?.loading} />
        </Form.Item>
      ))}
      <div>
        <Button htmlType="submit" loading={labelUpdateResult?.loading}>
          {t('pdfDimensions.actions.save')}
        </Button>
        <UpdateResult $success={labelUpdateResult?.success} role="status">
          {labelUpdateResult?.message && (
            <>
              {labelUpdateResult?.success ? (
                <CheckOutlined />
              ) : (
                <CloseOutlined />
              )}

              {labelUpdateResult?.message}
            </>
          )}
        </UpdateResult>
      </div>
    </Form>
  )
}

PdfDimensionsLabelForm.propTypes = {
  availableDimensions: PropTypes.arrayOf(PropTypes.shape()),
  onLabelsUpdate: PropTypes.func,
}

PdfDimensionsLabelForm.defaultProps = {
  onLabelsUpdate: null,
  availableDimensions: [],
}

export default PdfDimensionsLabelForm
