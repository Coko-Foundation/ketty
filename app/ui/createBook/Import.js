import React, { useState } from 'react'
import { Button, Col, Row, Space } from 'antd'
import { grid } from '@coko/client'
import { InfoCircleFilled } from '@ant-design/icons'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Upload, Page } from '../common'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  padding: ${grid(4)};
`

const Import = ({ onClickContinue, canImport, loading }) => {
  const [filesToImport, setFilesToImport] = useState([])

  return (
    <Page maxWidth={1200}>
      <Wrapper>
        <h1>Import</h1>
        <Row gutter={[24, 12]}>
          <Col md={12} xs={24}>
            <p>
              Files supported: <strong>.docx</strong>
            </p>
            <p>
              <InfoCircleFilled /> Each file you upload will be a separate
              chapter in your book. You can reorder chapters and import more
              chapters later.
            </p>
          </Col>
          <Col md={12} xs={24}>
            <Space direction="vertical" style={{ display: 'flex' }}>
              <Upload
                accept=".docx"
                disabled={!canImport}
                multiple
                onFilesChange={setFilesToImport}
              />

              <Row justify="end">
                <Button
                  disabled={!filesToImport.length || !canImport || loading}
                  loading={loading}
                  onClick={() => onClickContinue(filesToImport)}
                  size="large"
                  type="primary"
                >
                  Continue
                </Button>
              </Row>
            </Space>
          </Col>
        </Row>
      </Wrapper>
    </Page>
  )
}

Import.propTypes = {
  onClickContinue: PropTypes.func.isRequired,
  canImport: PropTypes.bool,
  loading: PropTypes.bool,
}
Import.defaultProps = {
  canImport: false,
  loading: false,
}

export default Import
