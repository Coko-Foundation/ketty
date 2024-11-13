import React from 'react'
import PropTypes from 'prop-types'
import { Col, Row, DatePicker } from 'antd'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Form, Input } from '../common'

const StyledDatePicker = styled(DatePicker)`
  width: 100%;
`

const CopyrightInputs = props => {
  const { namePrefix, canChangeMetadata, selected } = props
  const { t } = useTranslation()

  return (
    <Row gutter={[12, 0]}>
      <Col span={18}>
        <Form.Item
          label={t('copyright_holder')}
          labelCol={{ span: 24 }}
          name={`${namePrefix}CopyrightHolder`}
          rules={[
            {
              required: selected,
              message: t('copyright_holder_required'),
            },
          ]}
        >
          <Input disabled={!canChangeMetadata} />
        </Form.Item>
      </Col>

      <Col span={6}>
        <Form.Item
          label={t('copyright_year')}
          labelCol={{ span: 24 }}
          name={`${namePrefix}CopyrightYear`}
          rules={[
            { required: selected, message: t('copyright_year_required') },
          ]}
        >
          <StyledDatePicker disabled={!canChangeMetadata} picker="year" />
        </Form.Item>
      </Col>
    </Row>
  )
}

CopyrightInputs.propTypes = {
  namePrefix: PropTypes.string.isRequired,
  canChangeMetadata: PropTypes.bool.isRequired,
  selected: PropTypes.bool.isRequired,
}

export default CopyrightInputs
