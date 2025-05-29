import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { CaretRightFilled } from '@ant-design/icons'
import { grid } from '@coko/client'
import { useTranslation } from 'react-i18next'
import { Form, Collapse, Radio } from '../../common'
import CopyrightInputs from './CopyrightInputs'
import LicenseTypes from './LicenseTypes'

const StyledParagraph = styled.p`
  margin-top: 0;
`

const PanelHeaderWrapper = styled.div`
  align-items: center;
  display: flex;

  .ant-radio {
    margin-inline-end: ${grid(2)};
  }
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

  const { t } = useTranslation(null, {
    keyPrefix: 'pages.producer.bookMetadataTab.sections.copyrightPage',
  })

  const handleChange = v => {
    if (canChangeMetadata && v[0]) {
      onChange(v[0])
      setActiveKey(v[0])
    }
  }

  const items = [
    {
      key: 'SCL',
      label: (
        <PanelHeaderWrapper>
          <Radio checked={value === 'SCL'} disabled={!canChangeMetadata}>
            <strong>{t('options.allRightsReserved')}</strong>
            <p>{t('options.allRightsReserved.detail')}</p>
          </Radio>
        </PanelHeaderWrapper>
      ),
      children: (
        <CopyrightInputs
          canChangeMetadata={canChangeMetadata}
          namePrefix="nc"
          selected={value === 'SCL'}
        />
      ),
    },
    {
      key: 'CC',
      label: (
        <PanelHeaderWrapper>
          <Radio checked={value === 'CC'} disabled={!canChangeMetadata}>
            <strong>{t('options.creativeCommons')}</strong>
            <p>{t('options.creativeCommons.detail')}</p>
            <a
              href="https://creativecommons.org/about/cclicenses/"
              rel="noreferrer"
              target="_blank"
            >
              {t('options.creativeCommons.link')}
            </a>
          </Radio>
        </PanelHeaderWrapper>
      ),
      children: (
        <>
          <CopyrightInputs
            canChangeMetadata={canChangeMetadata}
            namePrefix="sa"
            selected={value === 'CC'}
          />
          <Form.Item name="licenseTypes">
            <LicenseTypes canChangeMetadata={canChangeMetadata} />
          </Form.Item>
        </>
      ),
    },
    {
      key: 'PD',
      label: (
        <PanelHeaderWrapper>
          <Radio checked={value === 'PD'} disabled={!canChangeMetadata}>
            <strong>{t('options.publicDomain')}</strong>
            <p>{t('options.publicDomain.detail')}</p>
          </Radio>
        </PanelHeaderWrapper>
      ),
      children: (
        <Form.Item name="publicDomainType">
          <Radio.Group
            disabled={!canChangeMetadata}
            options={[
              {
                label: (
                  <div>
                    <strong>{t('options.publicDomain.cc0')}</strong>
                    <StyledParagraph>
                      {t('options.publicDomain.cc0.details')}
                    </StyledParagraph>
                  </div>
                ),
                value: 'cc0',
              },
              {
                label: (
                  <div>
                    <strong>{t('options.publicDomain.noCc')}</strong>
                    <StyledParagraph>
                      {t('options.publicDomain.noCc.details')}
                    </StyledParagraph>
                  </div>
                ),
                value: 'public',
              },
            ]}
          />
        </Form.Item>
      ),
    },
  ]

  return (
    <Collapse
      accordion
      activeKey={activeKey}
      destroyInactivePanel
      expandIcon={ExpandIcon}
      expandIconPosition="end"
      items={items}
      onChange={handleChange}
    />
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
