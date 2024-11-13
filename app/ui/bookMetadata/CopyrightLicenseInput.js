import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { CaretRightFilled } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { Form, Collapse, Radio } from '../common'
import CopyrightLicenseOption from './CopyrightLicenseOption'
import CopyrightInputs from './CopyrightInputs'
import LicenseTypes from './LicenseTypes'

const StyledParagraph = styled.p`
  margin-top: 0;
`

const ExpandIcon = ({ isActive }) => {
  return <CaretRightFilled rotate={isActive ? 270 : 90} />
}

ExpandIcon.propTypes = {
  isActive: PropTypes.bool.isRequired,
}

const CopyrightLicenseInput = props => {
  const { onChange, value, canChangeMetadata } = props
  const [activeKey, setActiveKey] = useState(value)
  const { t } = useTranslation()

  const handleChange = v => {
    onChange(v)
    setActiveKey(v)
  }

  return (
    <Collapse
      accordion
      activeKey={activeKey}
      destroyInactivePanel
      expandIcon={ExpandIcon}
      expandIconPosition="end"
    >
      <CopyrightLicenseOption
        canChangeMetadata={canChangeMetadata}
        description={t('copyright_scl_description')}
        key="SCL"
        name="SCL"
        onChange={handleChange}
        selected={value === 'SCL'}
        title={t('copyright_scl')}
      >
        <CopyrightInputs
          canChangeMetadata={canChangeMetadata}
          namePrefix="nc"
          selected={value === 'SCL'}
        />
      </CopyrightLicenseOption>

      <CopyrightLicenseOption
        canChangeMetadata={canChangeMetadata}
        description={t('copyright_cc_description')}
        key="CC"
        link="https://creativecommons.org/about/cclicenses/"
        linkText={t('copyright_cc_link')}
        name="CC"
        onChange={handleChange}
        selected={value === 'CC'}
        title={t('copyright_cc')}
      >
        <CopyrightInputs
          canChangeMetadata={canChangeMetadata}
          namePrefix="sa"
          selected={value === 'CC'}
        />
        <Form.Item name="licenseTypes">
          <LicenseTypes canChangeMetadata={canChangeMetadata} />
        </Form.Item>
      </CopyrightLicenseOption>

      <CopyrightLicenseOption
        canChangeMetadata={canChangeMetadata}
        description={t('copyright_pd_description')}
        key="PD"
        name="PD"
        onChange={handleChange}
        selected={value === 'PD'}
        title={t('copyright_pd')}
      >
        <Form.Item name="publicDomainType">
          <Radio.Group
            disabled={!canChangeMetadata}
            options={[
              {
                label: (
                  <div>
                    <strong>{t('copyright_pd_cc0')}</strong>
                    <StyledParagraph>
                      {t('copyright_pd_cc0_info')}
                    </StyledParagraph>
                  </div>
                ),
                value: 'cc0',
              },
              {
                label: (
                  <div>
                    <strong>{t('copyright_pd_pd')}</strong>
                    <StyledParagraph>
                      {t('copyright_pd_pd_info')}
                    </StyledParagraph>
                  </div>
                ),
                value: 'public',
              },
            ]}
          />
        </Form.Item>
      </CopyrightLicenseOption>
    </Collapse>
  )
}

CopyrightLicenseInput.propTypes = {
  value: PropTypes.oneOf(['SCL', 'PD', 'CC']),
  onChange: PropTypes.func,
  canChangeMetadata: PropTypes.bool,
}

CopyrightLicenseInput.defaultProps = {
  value: null,
  onChange: () => {},
  canChangeMetadata: true,
}

export default CopyrightLicenseInput
