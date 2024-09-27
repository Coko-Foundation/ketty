import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { CaretRightFilled } from '@ant-design/icons'
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
        description="All Rights Reserved licensing. Your work cannot be distributed, remixed, or otherwise used without your express consent."
        key="SCL"
        name="SCL"
        onChange={handleChange}
        selected={value === 'SCL'}
        title="All Rights Reserved - Standard Copyright License"
      >
        <CopyrightInputs
          canChangeMetadata={canChangeMetadata}
          namePrefix="nc"
          selected={value === 'SCL'}
        />
      </CopyrightLicenseOption>

      <CopyrightLicenseOption
        canChangeMetadata={canChangeMetadata}
        description="Some rights are reserved, based on the specific Creative Commons Licensing you select."
        key="CC"
        link="https://creativecommons.org/about/cclicenses/"
        linkText="What is Creative Commons?"
        name="CC"
        onChange={handleChange}
        selected={value === 'CC'}
        title="Some Rights Reserved - Creative Commons (CC BY)"
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
        description="No rights are reserved and the work is freely available for anyone to use, distribute, and alter in any way."
        key="PD"
        name="PD"
        onChange={handleChange}
        selected={value === 'PD'}
        title="No Rights Reserved - Public Domain"
      >
        <Form.Item name="publicDomainType">
          <Radio.Group
            disabled={!canChangeMetadata}
            options={[
              {
                label: (
                  <div>
                    <strong>Creative Commons Zero (CC 0)</strong>
                    <StyledParagraph>
                      You waive any copyright and release of your work to the
                      public domain. Use only if you are the copyright holder or
                      have permission from the copyright holder to release the
                      work.
                    </StyledParagraph>
                  </div>
                ),
                value: 'cc0',
              },
              {
                label: (
                  <div>
                    <strong>No Known Copyright (Public Domain)</strong>
                    <StyledParagraph>
                      By selecting this option, you certify that, to the best of
                      your knowledge, the work is free of copyright worldwide.
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
