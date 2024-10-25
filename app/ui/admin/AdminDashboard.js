/* stylelint-disable string-quotes */
import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { grid, th } from '@coko/client'
import { Wax } from 'wax-prosemirror-core'
import { Button, Divider, Switch, Input, Form, Center, Stack } from '../common'
import { SimpleLayout } from '../wax/layout'
import simpleConfig from '../wax/config/simpleConfig'

const StyledControlWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row wrap;
  gap: ${grid(4)};
  justify-content: space-between;
  max-width: 400px;
`

const TCWrapper = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: ${grid(5)};

  > div:last-child {
    align-items: center;
    display: flex;
    gap: calc(16px);
  }
`

const ChatGPTAPIKeyWrapper = styled.div`
  flex-grow: 1;
  height: ${props => (props.$hidden ? 0 : '100%')};
  overflow: visible clip;
  padding-block: ${props => (props.$hidden ? 0 : grid(2))};
  transition: height 0.1s ease, padding-block 0.1s ease 0.1s;

  form > div:last-child {
    align-items: center;
    display: flex;
    gap: ${grid(4)};
  }
`

const UpdateResult = styled.span`
  color: ${props => (props.$success ? th('colorSuccess') : th('colorError'))};
  display: inline-flex;
  gap: ${grid(1)};
`

const AdminDashboard = props => {
  const {
    aiEnabled,
    aiToggleIntegration,
    chatGptApiKey,
    luluToggleConfig,
    paramsLoading,
    luluConfigEnabled,
    termsAndConditions,
    onTCUpdate,
    onChatGPTKeyUpdate,
    exportOptions,
    exportConfigUpdate,
  } = props

  const waxRef = useRef()

  const [apiKeyForm] = Form.useForm()
  const [keyUpdateResult, setKeyUpdateResult] = useState()
  const [tcUpdateResult, setTCUpdateResult] = useState()

  useEffect(() => {
    apiKeyForm.setFieldsValue({ apiKey: chatGptApiKey })
  }, [chatGptApiKey])

  const udpateTermsAndConditions = () => {
    setTCUpdateResult({ loading: true })
    onTCUpdate(waxRef.current.getContent())
      .then(() => {
        setTCUpdateResult({
          success: true,
          message: 'Terms and Conditions updated successfully',
        })
        setTimeout(() => {
          setTCUpdateResult(null)
        }, 5000)
      })
      .catch(() => {
        setTCUpdateResult({
          success: false,
          message: 'Terms and Conditions update failed',
        })
        setTimeout(() => {
          setTCUpdateResult(null)
        }, 5000)
      })
  }

  const handleChatGPTKeyUpdate = val => {
    setKeyUpdateResult({ loading: true })
    onChatGPTKeyUpdate(val.apiKey)
      .then(() => {
        setKeyUpdateResult({ success: true, message: 'API key updated' })
        setTimeout(() => {
          setKeyUpdateResult(null)
        }, 5000)
      })
      .catch(() => {
        setKeyUpdateResult({ success: false, message: 'API key is invalid' })
        setTimeout(() => {
          setKeyUpdateResult(null)
        }, 5000)
      })
  }

  return (
    <Center
      style={{ '--max-width': '90ch', '--s1': '16px', 'margin-bottom': '3rem' }}
    >
      <h1>Admin</h1>
      <Divider />
      <h2>AI integration</h2>
      <StyledControlWrapper>
        <span>AI supplier integration</span>
        <Switch
          checked={aiEnabled}
          loading={paramsLoading}
          onChange={aiToggleIntegration}
          data-test="admindb-ai-switch"
        />
        <ChatGPTAPIKeyWrapper $hidden={!aiEnabled}>
          <Form
            disabled={!aiEnabled}
            form={apiKeyForm}
            layout="vertical"
            onFinish={handleChatGPTKeyUpdate}
            requiredMark={false}
          >
            <Form.Item
              label="API Key"
              name="apiKey"
              rules={[{ required: true, message: 'You need to provide a key' }]}
            >
              <Input placeholder="Insert key" data-test="admindb-aikey-input" />
            </Form.Item>
            <div>
              <Button
                htmlType="submit"
                loading={keyUpdateResult?.loading}
                data-test="admindb-updateKey-btn"
              >
                Update Key
              </Button>
              <UpdateResult $success={keyUpdateResult?.success} role="status">
                {keyUpdateResult?.message && (
                  <>
                    {keyUpdateResult?.success ? (
                      <CheckOutlined />
                    ) : (
                      <CloseOutlined />
                    )}

                    {keyUpdateResult?.message}
                  </>
                )}
              </UpdateResult>
            </div>
          </Form>
        </ChatGPTAPIKeyWrapper>
      </StyledControlWrapper>
      <Divider />
      <h2>Publishing, downloads and integration</h2>
      <Stack style={{ '--space': '2rem' }}>
        <h3>Downloads</h3>
        <Stack style={{ '--space': '1rem' }}>
          <StyledControlWrapper>
            <span>PDF</span>
            <Switch
              checked={exportOptions?.pdfDownload?.enabled}
              loading={paramsLoading}
              onChange={val => exportConfigUpdate(val, 'pdfDownload')}
              data-test="admindb-dwPDF-switch"
            />
          </StyledControlWrapper>
          <StyledControlWrapper>
            <span>EPUB</span>
            <Switch
              checked={exportOptions?.epubDownload?.enabled}
              loading={paramsLoading}
              onChange={val => exportConfigUpdate(val, 'epubDownload')}
              data-test="admindb-dwEPUB-switch"
            />
          </StyledControlWrapper>
        </Stack>
        <h3>Publishing integrations</h3>
        <StyledControlWrapper>
          <span>Publish online with Flax</span>
          <Switch
            checked={exportOptions?.webPublish?.enabled}
            loading={paramsLoading}
            onChange={val => exportConfigUpdate(val, 'webPublish')}
            data-test="admindb-pubWeb-switch"
          />
          {exportOptions?.webPublish?.enabled && (
            <Stack
              style={{
                '--space': '1em',
                paddingInlineStart: '3ch',
              }}
            >
              <p style={{ 'grid-column': 'span 2' }}>
                Allow book owners to include the following downloads when
                publishing online:
              </p>
              <StyledControlWrapper>
                <span>PDF</span>
                <Switch
                  checked={exportOptions?.webPdfDownload?.enabled}
                  loading={paramsLoading}
                  onChange={val => exportConfigUpdate(val, 'webPdfDownload')}
                  data-test="admindb-pubPDF-switch"
                />
              </StyledControlWrapper>
              <StyledControlWrapper>
                <span>EPUB</span>
                <Switch
                  checked={exportOptions?.webEpubDownload?.enabled}
                  loading={paramsLoading}
                  onChange={val => exportConfigUpdate(val, 'webEpubDownload')}
                  data-test="admindb-pubEPUB-switch"
                />
              </StyledControlWrapper>
            </Stack>
          )}
        </StyledControlWrapper>
        <StyledControlWrapper>
          <span>Print-on-demand with Lulu</span>
          <Switch
            checked={luluConfigEnabled}
            loading={paramsLoading}
            onChange={luluToggleConfig}
            data-test="admindb-lulu-switch"
          />
        </StyledControlWrapper>
      </Stack>
      {/* <h2>Print on demand supplier integration</h2> */}

      <Divider />
      <h2>Terms and conditions</h2>
      <p>
        Provide the terms and conditions that users must agree to on sign up.
      </p>
      <TCWrapper>
        <Wax
          autoFocus={false}
          config={simpleConfig}
          id="termsAndConditionsEditor"
          key={termsAndConditions}
          layout={SimpleLayout}
          ref={waxRef}
          value={termsAndConditions}
        />
        <div>
          <Button
            onClick={udpateTermsAndConditions}
            data-test="admindb-updateTC-btn"
          >
            Update Terms and Conditions
          </Button>
          <UpdateResult $success={tcUpdateResult?.success} role="status">
            {tcUpdateResult?.message && (
              <>
                {tcUpdateResult?.success ? (
                  <CheckOutlined />
                ) : (
                  <CloseOutlined />
                )}

                {tcUpdateResult?.message}
              </>
            )}
          </UpdateResult>
        </div>
      </TCWrapper>
    </Center>
  )
}

AdminDashboard.propTypes = {
  aiEnabled: PropTypes.bool,
  aiToggleIntegration: PropTypes.func,
  luluToggleConfig: PropTypes.func,
  paramsLoading: PropTypes.bool,
  luluConfigEnabled: PropTypes.bool,
  termsAndConditions: PropTypes.string,
  onTCUpdate: PropTypes.func,
  chatGptApiKey: PropTypes.string,
  onChatGPTKeyUpdate: PropTypes.func,
  exportOptions: PropTypes.shape(),
  exportConfigUpdate: PropTypes.func,
}

AdminDashboard.defaultProps = {
  aiEnabled: false,
  aiToggleIntegration: null,
  luluToggleConfig: null,
  paramsLoading: false,
  luluConfigEnabled: false,
  termsAndConditions: '',
  onTCUpdate: null,
  chatGptApiKey: '',
  onChatGPTKeyUpdate: null,
  exportOptions: {},
  exportConfigUpdate: null,
}

export default AdminDashboard
