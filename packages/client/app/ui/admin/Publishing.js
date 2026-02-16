import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Form, Collapse } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { grid, th } from '@coko/client'
import { Stack, Switch, Input, Button } from '../common'
import StyledControlWrapper from './StyledControlWrapper'

const StyledCollapse = styled(Collapse)`
  width: 100%;

  .ant-collapse-content-box > ${Stack} {
    --space: 1em;
    padding-inline-start: 3ch;
  }
`

const StyledP = styled.p`
  background-color: ${th('colorWarning')};
  border-radius: ${th('borderRadius')};
  color: #333;
  margin: 0;
  padding-inline: ${grid(3)};
`

const UpdateResult = styled.span`
  color: ${props => (props.$success ? th('colorSuccess') : th('colorError'))};
  display: inline-flex;
  gap: ${grid(1)};
`

const Publishing = props => {
  const {
    paramsLoading,
    exportOptions,
    exportConfigUpdate,
    luluConfig,
    luluToggleConfig,
    luluUpdateConfig,
  } = props

  const { t } = useTranslation(null, { keyPrefix: 'pages.admin' })

  const [luluConfigForm] = Form.useForm()
  const [luluConfigUpdateResult, setLuluConfigUpdateResult] = useState()

  useEffect(() => {
    luluConfig &&
      luluConfigForm.setFieldsValue({
        ...luluConfig,
        redirectUri:
          luluConfig.redirectUri && new URL(luluConfig.redirectUri).pathname,
      })
  }, [luluConfig])

  const updateLuluConfig = () => {
    const { location } = window
    luluConfigForm.validateFields().then(vals => {
      const data = {
        ...vals,
        redirectUri: `${location.protocol}//${location.host}${vals.redirectUri}`,
      }

      luluUpdateConfig(data)
        .then(() => {
          setLuluConfigUpdateResult({
            success: true,
            message: t('integrations.lulu.updateConfig.success'),
          })
          setTimeout(() => {
            setLuluConfigUpdateResult(null)
          }, 5000)
        })
        .catch(() => {
          setLuluConfigUpdateResult({
            success: false,
            message: t('integrations.lulu.updateConfig.error'),
          })
          setTimeout(() => {
            setLuluConfigUpdateResult(null)
          }, 5000)
        })
    })
  }

  return (
    <>
      <h2>{t('publishing.heading')}</h2>
      <Stack style={{ '--space': '2rem' }}>
        <h3>{t('downloads.heading')}</h3>
        <Stack style={{ '--space': '1rem' }}>
          <StyledControlWrapper>
            <span>{t('downloads.pdf')}</span>
            <Switch
              checked={exportOptions?.pdfDownload?.enabled}
              data-test="admindb-dwPDF-switch"
              loading={paramsLoading}
              onChange={val => exportConfigUpdate(val, 'pdfDownload')}
            />
          </StyledControlWrapper>
          <StyledControlWrapper>
            <span>{t('downloads.epub')}</span>
            <Switch
              checked={exportOptions?.epubDownload?.enabled}
              data-test="admindb-dwEPUB-switch"
              loading={paramsLoading}
              onChange={val => exportConfigUpdate(val, 'epubDownload')}
            />
          </StyledControlWrapper>
        </Stack>
        <h3>{t('integrations.heading')}</h3>
        <StyledControlWrapper>
          <span>{t('integrations.flax')}</span>
          <Switch
            checked={exportOptions?.webPublish?.enabled}
            data-test="admindb-pubWeb-switch"
            loading={paramsLoading}
            onChange={val => exportConfigUpdate(val, 'webPublish')}
          />
          {exportOptions?.webPublish?.enabled && (
            <StyledCollapse
              ghost
              items={[
                {
                  key: '1',
                  label: 'Flax settings',
                  children: (
                    <Stack>
                      <p style={{ gridColumn: 'span 2' }}>
                        {t('integrations.flax.explanation')}
                      </p>
                      <StyledControlWrapper>
                        <span>
                          {t('integrations.flax.downloadOptions.pdf')}
                        </span>
                        <Switch
                          checked={exportOptions?.webPdfDownload?.enabled}
                          data-test="admindb-pubPDF-switch"
                          loading={paramsLoading}
                          onChange={val =>
                            exportConfigUpdate(val, 'webPdfDownload')
                          }
                        />
                      </StyledControlWrapper>
                      <StyledControlWrapper>
                        <span>
                          {t('integrations.flax.downloadOptions.epub')}
                        </span>
                        <Switch
                          checked={exportOptions?.webEpubDownload?.enabled}
                          data-test="admindb-pubEPUB-switch"
                          loading={paramsLoading}
                          onChange={val =>
                            exportConfigUpdate(val, 'webEpubDownload')
                          }
                        />
                      </StyledControlWrapper>
                      <p style={{ gridColumn: 'span 2' }}>
                        {t('integrations.flax.customize.info')}
                      </p>
                      <StyledControlWrapper>
                        <span>{t('integrations.flax.customize.label')}</span>
                        <Switch
                          checked={exportOptions?.webCustomHTML?.enabled}
                          data-test="admindb-pubEPUB-switch"
                          loading={paramsLoading}
                          onChange={val =>
                            exportConfigUpdate(val, 'webCustomHTML')
                          }
                        />
                      </StyledControlWrapper>
                    </Stack>
                  ),
                },
              ]}
            />
          )}
        </StyledControlWrapper>
        <StyledControlWrapper>
          <span>{t('integrations.lulu')}</span>
          <Switch
            checked={!luluConfig?.disabled}
            data-test="admindb-lulu-switch"
            disabled
            loading={paramsLoading}
            onChange={luluToggleConfig}
          />

          <StyledP>
            This feature is temporarily disabled. We will enable it again in a
            future update.
          </StyledP>
          {!luluConfig?.disabled && (
            <StyledCollapse
              ghost
              items={[
                {
                  key: '1',
                  forceRender: true,
                  label: t('integrations.lulu.details'),
                  children: (
                    <Stack>
                      <Form
                        form={luluConfigForm}
                        layout="vertical"
                        onFinish={updateLuluConfig}
                      >
                        <Form.Item
                          label={t('integrations.lulu.details.baseApiUrl')}
                          name="baseAPIURL"
                          rules={[{ required: true }]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          label={t('integrations.lulu.details.loginUrl')}
                          name="loginUrl"
                          rules={[{ required: true }]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          label={t('integrations.lulu.details.redirectUri')}
                          name="redirectUri"
                          rules={[{ required: true }]}
                        >
                          <Input
                            addonBefore={`${window.location.protocol}//${window.location.host}`}
                            type="url"
                          />
                        </Form.Item>
                        <Form.Item
                          label={t('integrations.lulu.details.projectBaseUrl')}
                          name="projectBaseUrl"
                          rules={[{ required: true }]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          label={t('integrations.lulu.details.tokenUrl')}
                          name="tokenUrl"
                          rules={[{ required: true }]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          label={t('integrations.lulu.details.clientId')}
                          name="clientId"
                          rules={[{ required: true }]}
                        >
                          <Input />
                        </Form.Item>
                        <StyledControlWrapper>
                          <Button htmlType="submit" loading={paramsLoading}>
                            {t('integrations.lulu.updateConfig.update')}
                          </Button>
                          <UpdateResult
                            $success={luluConfigUpdateResult?.success}
                            role="status"
                          >
                            {luluConfigUpdateResult?.message && (
                              <>
                                {luluConfigUpdateResult?.success ? (
                                  <CheckOutlined />
                                ) : (
                                  <CloseOutlined />
                                )}

                                {luluConfigUpdateResult?.message}
                              </>
                            )}
                          </UpdateResult>
                        </StyledControlWrapper>
                      </Form>
                    </Stack>
                  ),
                },
              ]}
            />
          )}
        </StyledControlWrapper>
      </Stack>
    </>
  )
}

Publishing.propTypes = {
  paramsLoading: PropTypes.bool,
  exportOptions: PropTypes.shape(),
  exportConfigUpdate: PropTypes.func,
  luluToggleConfig: PropTypes.func,
  luluUpdateConfig: PropTypes.func,
  luluConfig: PropTypes.shape(),
}

Publishing.defaultProps = {
  paramsLoading: false,
  exportOptions: {},
  exportConfigUpdate: null,
  luluToggleConfig: null,
  luluUpdateConfig: null,
  luluConfig: null,
}

export default Publishing
