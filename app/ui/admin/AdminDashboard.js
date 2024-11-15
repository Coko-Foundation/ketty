/* stylelint-disable declaration-no-important */
/* stylelint-disable string-quotes */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { Form, Upload, Collapse } from 'antd'
import { grid, serverUrl, th, uuid } from '@coko/client'
import { Wax } from 'wax-prosemirror-core'
import { useTranslation } from 'react-i18next'
import { Button, Divider, Switch, Input, Center, Stack } from '../common'
import { SimpleLayout } from '../wax/layout'
import simpleConfig from '../wax/config/simpleConfig'

const StyledControlWrapper = styled.div`
  align-items: center;
  column-gap: ${grid(4)};
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  max-width: 400px;
  row-gap: ${grid(1)};

  > .ant-form-item {
    margin-bottom: 0 !important;
  }
`

const LanguageWrapper = styled(Stack)`
  :has([role='switch'][aria-checked='false']) > :nth-child(2) {
    display: none;
  }
`

const DescriptionParagraph = styled.p`
  font-size: ${th('fontSizeBaseSmall')};
  margin-block: 0;
  width: 100%;
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

const TCHeader = styled.h2`
  &::first-letter {
    text-transform: capitalize;
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

const StyledUpload = styled(Upload)`
  &:has(.ant-upload-list-item) {
    .ant-upload-select {
      display: none;
    }
  }

  .ant-upload-list-item {
    margin-block-start: 0 !important;
  }
`

const UploadBtn = styled.span`
  align-items: center;
  border: 1px solid gainsboro;
  border-radius: 2px;
  cursor: pointer;
  display: inline-flex;
  height: 20px;
  justify-content: center;
  transition: border-color 0.2s ease;
  width: 20px;

  &:hover {
    border-color: ${th('colorText')};
  }
`

const normFile = e => {
  if (Array.isArray(e)) {
    return e
  }

  return e?.fileList
}

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
    onLanguagesUpdate,
    exportOptions,
    exportConfigUpdate,
    languages,
    onTranslationsUpload,
  } = props

  const waxRef = useRef()
  const { t } = useTranslation()

  const [apiKeyForm] = Form.useForm()
  const [newLanguageForm] = Form.useForm()
  const [keyUpdateResult, setKeyUpdateResult] = useState()
  const [tcUpdateResult, setTCUpdateResult] = useState()
  const [newLanguage, setNewLanguage] = useState()
  const [translationFile, setTranslationFile] = useState()

  useEffect(() => {
    apiKeyForm.setFieldsValue({ apiKey: chatGptApiKey })
  }, [chatGptApiKey])

  const udpateTermsAndConditions = () => {
    setTCUpdateResult({ loading: true })
    onTCUpdate(waxRef.current.getContent())
      .then(() => {
        setTCUpdateResult({
          success: true,
          message: t('tc_update_success'),
        })
        setTimeout(() => {
          setTCUpdateResult(null)
        }, 5000)
      })
      .catch(() => {
        setTCUpdateResult({
          success: false,
          message: t('tc_update_error'),
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
        setKeyUpdateResult({ success: true, message: t('ai_key_updated') })
        setTimeout(() => {
          setKeyUpdateResult(null)
        }, 5000)
      })
      .catch(() => {
        setKeyUpdateResult({ success: false, message: t('ai_key_invalid') })
        setTimeout(() => {
          setKeyUpdateResult(null)
        }, 5000)
      })
  }

  const addLanguage = () => {
    newLanguageForm
      .validateFields()
      .then(async vals => {
        if (translationFile) {
          const code = uuid().substring(0, 7)
          await onTranslationsUpload(translationFile, code)
          setTranslationFile(null)

          onLanguagesUpdate([...languages, { ...vals, code, enabled: true }])
        }

        setNewLanguage(false)
      })
      .catch(err => console.error(err))
  }

  const updateLanguage = async values => {
    const { language, ...rest } = values

    if (translationFile) {
      await onTranslationsUpload(translationFile, JSON.parse(language).code)

      setTranslationFile(null)

      const languageConfig = languages.map(l => {
        if (JSON.stringify(l) === language)
          return {
            ...l,
            ...rest,
          }

        return l
      })

      onLanguagesUpdate(languageConfig)
    } else {
      const languageConfig = languages.map(l => {
        if (JSON.stringify(l) === language) return { ...l, ...rest }
        return l
      })

      onLanguagesUpdate(languageConfig)
    }
  }

  const languageItems = languages.map(l => {
    return {
      key: l.code,
      label: (
        <StyledControlWrapper>
          <span>{l.name}</span>
          <span>({l.enabled ? t('enabled') : t('disabled')})</span>
        </StyledControlWrapper>
      ),
      children: (
        <Form name={l.name} onFinish={updateLanguage}>
          <Stack
            style={{
              '--space': '1em',
              paddingInlineStart: '3ch',
            }}
          >
            <StyledControlWrapper>
              <label htmlFor={`name-${l.name}`}>{t('label')}:</label>
              <Form.Item
                initialValue={l.name}
                name="name"
                rules={[
                  { required: true, message: t('language_label_required') },
                ]}
              >
                <Input
                  aria-describedby={`desc-name-${l.name}`}
                  id={`name-${l.name}`}
                  type="text"
                />
              </Form.Item>
              <DescriptionParagraph id={`desc-name-${l.name}`}>
                {t('language_label_description')}.
              </DescriptionParagraph>
            </StyledControlWrapper>
            <StyledControlWrapper>
              <label htmlFor={`flag-code-${l.flagCode}`}>
                {t('flag_code')}:
              </label>
              <Form.Item
                initialValue={l.flagCode}
                name="flagCode"
                rules={[{ required: true, message: t('flag_code_required') }]}
              >
                <Input
                  aria-describedby={`desc-flag-code-${l.flagCode}`}
                  id={`flag-code-${l.flagCode}`}
                  type="text"
                />
              </Form.Item>
              <DescriptionParagraph id={`desc-flag-code-${l.flagCode}`}>
                {t('flag_code_description')}. {t('see')}{' '}
                <a
                  href="https://www.iso.org/obp/ui/#search/code/"
                  rel="noreferrer"
                  target="_blank"
                >
                  {t('this_list')}
                </a>{' '}
                {t('for_reference')}.
              </DescriptionParagraph>
            </StyledControlWrapper>
            <StyledControlWrapper>
              <span style={{ textTransform: 'capitalize' }}>
                {t('enabled')}
              </span>
              <Form.Item
                initialValue={l.enabled}
                name="enabled"
                valuePropName="checked"
              >
                <Switch
                  disabled={
                    l.enabled &&
                    languages.filter(lng => lng.enabled).length === 1
                  }
                />
              </Form.Item>
              <DescriptionParagraph id={`desc-name-${l.name}`}>
                {t('language_enabled_description')}.
              </DescriptionParagraph>
            </StyledControlWrapper>
            <StyledControlWrapper>
              <Form.Item
                getValueFromEvent={normFile}
                label={t('upload_new_translation_file')}
                valuePropName="fileList"
              >
                <StyledUpload
                  accept=".json"
                  beforeUpload={() => false}
                  maxCount={1}
                  onChange={({ file }) => setTranslationFile(file)}
                >
                  <UploadBtn>+</UploadBtn>
                </StyledUpload>
              </Form.Item>
            </StyledControlWrapper>
            <a
              href={`${serverUrl}/languages/${l.code}.json`}
              rel="noreferrer"
              target="_blank"
            >
              {t('download_translation')}
            </a>
            <StyledControlWrapper>
              <span />
              <Form.Item>
                <Button htmlType="submit" type="primary">
                  {t('update')}
                </Button>
              </Form.Item>
            </StyledControlWrapper>
            <Form.Item hidden initialValue={JSON.stringify(l)} name="language">
              <Input type="text" />
            </Form.Item>
          </Stack>
        </Form>
      ),
    }
  })

  return (
    <Center
      style={{ '--max-width': '90ch', '--s1': '16px', marginBottom: '3rem' }}
    >
      <h1>{t('admin')}</h1>
      <Divider />
      {/* ai integration */}
      <h2>{t('ai_integration')}</h2>
      <StyledControlWrapper>
        <span>{t('ai_supplier_integration')}</span>
        <Switch
          checked={aiEnabled}
          data-test="admindb-ai-switch"
          loading={paramsLoading}
          onChange={aiToggleIntegration}
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
              rules={[{ required: true, message: t('ai_key_empty') }]}
            >
              <Input
                data-test="admindb-aikey-input"
                placeholder={t('ai_insert_key')}
              />
            </Form.Item>
            <div>
              <Button
                data-test="admindb-updateKey-btn"
                htmlType="submit"
                loading={keyUpdateResult?.loading}
              >
                {t('ai_update_key')}
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
      {/* downloads, flax and lulu integrations */}
      <h2>{t('pub_section_header')}</h2>
      <Stack style={{ '--space': '2rem' }}>
        <h3>{t('downloads')}</h3>
        <Stack style={{ '--space': '1rem' }}>
          <StyledControlWrapper>
            <span>PDF</span>
            <Switch
              checked={exportOptions?.pdfDownload?.enabled}
              data-test="admindb-dwPDF-switch"
              loading={paramsLoading}
              onChange={val => exportConfigUpdate(val, 'pdfDownload')}
            />
          </StyledControlWrapper>
          <StyledControlWrapper>
            <span>EPUB</span>
            <Switch
              checked={exportOptions?.epubDownload?.enabled}
              data-test="admindb-dwEPUB-switch"
              loading={paramsLoading}
              onChange={val => exportConfigUpdate(val, 'epubDownload')}
            />
          </StyledControlWrapper>
        </Stack>
        <h3>{t('pub_integrations')}</h3>
        <StyledControlWrapper>
          <span>{t('pub_flax')}</span>
          <Switch
            checked={exportOptions?.webPublish?.enabled}
            data-test="admindb-pubWeb-switch"
            loading={paramsLoading}
            onChange={val => exportConfigUpdate(val, 'webPublish')}
          />
          {exportOptions?.webPublish?.enabled && (
            <Stack
              style={{
                '--space': '1em',
                paddingInlineStart: '3ch',
              }}
            >
              <p style={{ gridColumn: 'span 2' }}>
                {t('pub_flax_include_downloads')}:
              </p>
              <StyledControlWrapper>
                <span>PDF</span>
                <Switch
                  checked={exportOptions?.webPdfDownload?.enabled}
                  data-test="admindb-pubPDF-switch"
                  loading={paramsLoading}
                  onChange={val => exportConfigUpdate(val, 'webPdfDownload')}
                />
              </StyledControlWrapper>
              <StyledControlWrapper>
                <span>EPUB</span>
                <Switch
                  checked={exportOptions?.webEpubDownload?.enabled}
                  data-test="admindb-pubEPUB-switch"
                  loading={paramsLoading}
                  onChange={val => exportConfigUpdate(val, 'webEpubDownload')}
                />
              </StyledControlWrapper>
            </Stack>
          )}
        </StyledControlWrapper>
        <StyledControlWrapper>
          <span>{t('pub_lulu')}</span>
          <Switch
            checked={luluConfigEnabled}
            data-test="admindb-lulu-switch"
            loading={paramsLoading}
            onChange={luluToggleConfig}
          />
        </StyledControlWrapper>
      </Stack>
      <Divider />
      {/* translations */}
      <h2>{t('languages_header')}</h2>
      <Stack style={{ '--space': '1rem' }}>
        <Collapse
          accordion
          destroyInactivePanel
          ghost
          items={languageItems}
          key={JSON.stringify(languages)}
        />

        {newLanguage ? (
          <LanguageWrapper id="new">
            <Form form={newLanguageForm}>
              <Stack
                style={{
                  '--space': '1em',
                  paddingInlineStart: '3ch',
                }}
              >
                <StyledControlWrapper>
                  <label htmlFor="name-new">{t('label')}:</label>
                  <Form.Item
                    name="name"
                    rules={[
                      { required: true, message: t('language_label_required') },
                    ]}
                  >
                    <Input
                      aria-describedby="desc-name-new"
                      id="name-new"
                      type="text"
                    />
                  </Form.Item>
                  <DescriptionParagraph id="desc-name-new">
                    {t('language_label_description')}.
                  </DescriptionParagraph>
                </StyledControlWrapper>
                <StyledControlWrapper>
                  <label htmlFor="flag-code-new">{t('flag_code')}:</label>
                  <Form.Item
                    name="flagCode"
                    rules={[
                      {
                        required: true,
                        message: t('flag_code_required'),
                      },
                    ]}
                  >
                    <Input
                      aria-describedby="desc-flag-code-new"
                      id="flag-code-new"
                      type="text"
                    />
                  </Form.Item>
                  <DescriptionParagraph id="desc-flag-code-new">
                    {t('flag_code_description')}. {t('see')}{' '}
                    <a
                      href="https://www.iso.org/obp/ui/#search/code/"
                      rel="noreferrer"
                      target="_blank"
                    >
                      {t('this_list')}
                    </a>{' '}
                    {t('for_reference')}.
                  </DescriptionParagraph>
                </StyledControlWrapper>
                <StyledControlWrapper>
                  <Form.Item
                    getValueFromEvent={normFile}
                    label={t('upload_new_translation_file')}
                    valuePropName="fileList"
                  >
                    <StyledUpload
                      accept=".json"
                      beforeUpload={() => false}
                      maxCount={1}
                      onChange={({ file }) => setTranslationFile(file)}
                    >
                      <UploadBtn>+</UploadBtn>
                    </StyledUpload>
                  </Form.Item>
                </StyledControlWrapper>
              </Stack>
            </Form>
          </LanguageWrapper>
        ) : null}
        <div>
          {!newLanguage ? (
            <Button onClick={() => setNewLanguage(true)}>
              {t('add_new_language')}
            </Button>
          ) : (
            <>
              <Button onClick={() => setNewLanguage(false)}>
                {t('cancel')}
              </Button>{' '}
              <Button onClick={addLanguage}> {t('save_new_language')}</Button>
            </>
          )}
        </div>
      </Stack>
      <Divider />
      {/* terms and conditions */}
      <TCHeader>{t('terms_and_conditions')}</TCHeader>
      <p>{t('tc_subheader')}</p>
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
            data-test="admindb-updateTC-btn"
            onClick={udpateTermsAndConditions}
          >
            {t('tc_update_action')}
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
  onLanguagesUpdate: PropTypes.func,
  onTranslationsUpload: PropTypes.func,
  languages: PropTypes.arrayOf(PropTypes.shape()),
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
  onLanguagesUpdate: null,
  onTranslationsUpload: null,
  languages: [],
}

export default AdminDashboard
