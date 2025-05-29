import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { Form } from 'antd'
import { grid, th } from '@coko/client'
import { useTranslation } from 'react-i18next'
import StyledControlWrapper from './StyledControlWrapper'
import { Switch, Input, Button } from '../common'

const ChatGPTAPIKeyWrapper = styled.div`
  flex-grow: 1;
  height: ${props => (props.$hidden ? 0 : '100%')};
  overflow: visible clip;
  padding-block: ${props => (props.$hidden ? 0 : grid(2))};
  transition: height 0.1s ease, padding-block 0.1s ease 0.1s;
  width: 100%;

  form > div:last-child {
    align-items: center;
    display: flex;
    gap: ${grid(4)};
  }
`

const StyledFormItem = styled(Form.Item)`
  .ant-form-item-row {
    justify-content: space-between;
  }

  .ant-form-item-control {
    flex: 0 1 50px;
  }
`

const UpdateResult = styled.span`
  color: ${props => (props.$success ? th('colorSuccess') : th('colorError'))};
  display: inline-flex;
  gap: ${grid(1)};
`

const AiIntegration = props => {
  const { onChatGPTKeyUpdate, aiEnabled, paramsLoading, chatGptApiKey } = props

  const { t } = useTranslation(null, { keyPrefix: 'pages.admin' })

  const [apiKeyForm] = Form.useForm()
  const [enableAI, setEnableAI] = useState(aiEnabled)
  const [keyUpdateResult, setKeyUpdateResult] = useState()

  useEffect(() => {
    apiKeyForm.setFieldsValue({ apiKey: chatGptApiKey })
  }, [chatGptApiKey])

  const handleChatGPTKeyUpdate = val => {
    setKeyUpdateResult({ loading: true })

    onChatGPTKeyUpdate(val)
      .then(() => {
        setKeyUpdateResult({
          success: true,
          message: t('aiIntegration.updateKey.success'),
        })
        setTimeout(() => {
          setKeyUpdateResult(null)
        }, 5000)
      })
      .catch(() => {
        setKeyUpdateResult({
          success: false,
          message: t('aiIntegration.updateKey.error'),
        })
        setTimeout(() => {
          setKeyUpdateResult(null)
        }, 5000)
      })
  }

  return (
    <>
      <h2>{t('aiIntegration.heading')}</h2>
      <StyledControlWrapper>
        <ChatGPTAPIKeyWrapper>
          <Form
            form={apiKeyForm}
            layout="vertical"
            onFinish={handleChatGPTKeyUpdate}
            requiredMark={false}
          >
            <StyledFormItem
              label={t('aiIntegration.supplier')}
              layout="horizontal"
              name="aiOn"
            >
              <Switch
                data-test="admindb-ai-switch"
                defaultChecked={aiEnabled}
                loading={paramsLoading}
                onChange={setEnableAI}
              />
            </StyledFormItem>
            <Form.Item
              label={t('aiIntegration.apiKey')}
              name="apiKey"
              rules={[
                {
                  required: enableAI && true,
                  message: t('aiIntegration.apiKey.error.noValue'),
                },
              ]}
            >
              <Input
                data-test="admindb-aikey-input"
                disabled={!enableAI}
                placeholder={t('aiIntegration.apiKey.placeholder')}
              />
            </Form.Item>
            <div>
              <Button
                data-test="admindb-updateKey-btn"
                htmlType="submit"
                loading={keyUpdateResult?.loading}
              >
                {t('aiIntegration.updateKey')}
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
    </>
  )
}

AiIntegration.propTypes = {
  onChatGPTKeyUpdate: PropTypes.func,
  aiEnabled: PropTypes.bool,
  paramsLoading: PropTypes.bool,
  chatGptApiKey: PropTypes.string,
}
AiIntegration.defaultProps = {
  onChatGPTKeyUpdate: null,
  aiEnabled: false,
  paramsLoading: false,
  chatGptApiKey: null,
}

export default AiIntegration
