/* stylelint-disable indentation */
/* stylelint-disable selector-combinator-space-before */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/anchor-has-content */
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useTranslation, Trans } from 'react-i18next'
import { Form, Upload, Collapse } from 'antd'
import { th, serverUrl, uuid } from '@coko/client'
import { Stack, Button, Input, Switch, ButtonGroup } from '../common'
import StyledControlWrapper from './StyledControlWrapper'

const StyledCollapse = styled(Collapse)`
  width: 100%;

  .ant-collapse-content-box > ${Stack} {
    --space: 1em;
    padding-inline-start: 3ch;
  }
`

const LanguageWrapper = styled(Stack)`
  :has([role='switch'][aria-checked='false']) > :nth-child(2) {
    display: none;
  }
`

const StyledLanguageStack = styled(Stack)`
  --space: 1em;
  padding-inline-start: 3ch;

  > #std-wrapper:has([role='switch'][aria-checked='true'])
    ~ div:not(#lang-form-submit) {
    display: none;
  }
`

const DescriptionParagraph = styled.p`
  font-size: ${th('fontSizeBaseSmall')};
  margin-block: 0;
  width: 100%;
`

const StyledUpload = styled(Upload)`
  &:has(.ant-upload-list-item) {
    .ant-upload-select {
      display: none;
    }
  }

  .ant-upload-list-item {
    margin-block-start: 0 /* !important*/;
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

const StyledButtonGroup = styled(ButtonGroup)`
  align-items: flex-start;
`

const normFile = e => {
  if (Array.isArray(e)) {
    return e
  }

  return e?.fileList
}

const Languages = props => {
  const { languages, onLanguagesUpdate, onTranslationsUpload } = props
  const { t } = useTranslation(null, { keyPrefix: 'pages.admin' })
  const [newLanguageForm] = Form.useForm()
  const [newLanguage, setNewLanguage] = useState()
  const [translationFile, setTranslationFile] = useState()

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

    if (!rest.standardised && translationFile) {
      await onTranslationsUpload(translationFile, JSON.parse(language).code)

      setTranslationFile(null)

      const languageConfig = languages.map(l => {
        if (JSON.stringify(l) === language) {
          return { ...l, ...rest }
        }

        return l
      })

      onLanguagesUpdate(languageConfig)
    } else {
      const languageConfig = languages.map(l => {
        if (JSON.stringify(l) === language) {
          if (rest.standardised) {
            return {
              ...l,
              ...rest,
              name: l.standard.name,
              flagCode: l.standard.flagCode,
            }
          }

          return { ...l, ...rest }
        }

        return l
      })

      onLanguagesUpdate(languageConfig)
    }
  }

  const removeLanguage = async code => {
    const languageConfig = languages.filter(l => l.code !== code)
    onLanguagesUpdate(languageConfig)
  }

  const languageItems = languages.map(l => {
    return {
      key: l.code,
      label: (
        <StyledControlWrapper>
          <span>{l.name}</span>
          <span>
            (
            {l.enabled
              ? t('availableLanguages.state.enabled')
              : t('availableLanguages.state.disabled')}
            )
          </span>
        </StyledControlWrapper>
      ),
      children: (
        <Form name={l.name} onFinish={updateLanguage}>
          <StyledLanguageStack>
            <StyledControlWrapper>
              <span style={{ textTransform: 'capitalize' }}>
                {t('availableLanguages.enabled')}
              </span>
              <Form.Item
                initialValue={l.enabled}
                name="enabled"
                valuePropName="checked"
              >
                <Switch
                  data-test="admindb-en-switch"
                  disabled={
                    l.enabled &&
                    languages.filter(lng => lng.enabled).length === 1
                  }
                />
              </Form.Item>
              <DescriptionParagraph id={`desc-name-${l.name}`}>
                {t('availableLanguages.enabled.explanation')}
              </DescriptionParagraph>
            </StyledControlWrapper>
            {!!l.standard && (
              <StyledControlWrapper id="std-wrapper">
                <span style={{ textTransform: 'capitalize' }}>
                  {t('availableLanguages.standardised')}
                </span>
                <Form.Item
                  initialValue={l.standardised}
                  name="standardised"
                  valuePropName="checked"
                >
                  <Switch
                    aria-describedby={`desc-standard-${l.standard.name}`}
                    data-modified={!l.standardised}
                    data-test="admindb-standartized-switch"
                  />
                </Form.Item>
                <DescriptionParagraph id={`desc-standard-${l.standard.name}`}>
                  {t('availableLanguages.standardised.explanation')}
                </DescriptionParagraph>
              </StyledControlWrapper>
            )}

            <StyledControlWrapper>
              <label htmlFor={`name-${l.name}`}>
                {t('availableLanguages.customised.languageLabel')}
              </label>
              <Form.Item
                initialValue={l.name}
                name="name"
                rules={[
                  {
                    required: true,
                    message: t(
                      'availableLanguages.customised.languageLabel.error.noValue',
                    ),
                  },
                ]}
              >
                <Input
                  aria-describedby={`desc-name-${l.name}`}
                  data-test="admindb-engName-input"
                  id={`name-${l.name}`}
                  type="text"
                />
              </Form.Item>
              <DescriptionParagraph id={`desc-name-${l.name}`}>
                {t('availableLanguages.customised.languageLabel.explanation')}
              </DescriptionParagraph>
            </StyledControlWrapper>
            <StyledControlWrapper>
              <label htmlFor={`flag-code-${l.flagCode}`}>
                {t('availableLanguages.customised.flagCode')}
              </label>
              <Form.Item
                initialValue={l.flagCode}
                name="flagCode"
                rules={[
                  {
                    required: true,
                    message: t(
                      'availableLanguages.customised.flagCode.error.noValue',
                    ),
                  },
                ]}
              >
                <Input
                  aria-describedby={`desc-flag-code-${l.flagCode}`}
                  data-test="admindb-engFlag-input"
                  id={`flag-code-${l.flagCode}`}
                  type="text"
                />
              </Form.Item>
              <DescriptionParagraph id={`desc-flag-code-${l.flagCode}`}>
                <Trans
                  components={{
                    ref: (
                      <a
                        href="https://www.iso.org/obp/ui/#search/code/"
                        rel="noreferrer"
                        target="_blank"
                      />
                    ),
                  }}
                  i18nKey="pages.admin.availableLanguages.customised.flagCode.explanation"
                />
              </DescriptionParagraph>
            </StyledControlWrapper>
            <StyledControlWrapper>
              <Form.Item
                getValueFromEvent={normFile}
                label={t('availableLanguages.customised.uploadInstructions')}
                valuePropName="fileList"
              >
                <StyledUpload
                  accept=".json"
                  beforeUpload={() => false}
                  data-test="admindb-engStringsUpload-btn"
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
              {t('availableLanguages.actions.downloadStrings')}
            </a>
            <StyledControlWrapper id="lang-form-submit">
              <StyledButtonGroup>
                {!l.standard ? (
                  <Button
                    data-test="admindb-removeLang-btn"
                    onClick={() => removeLanguage(l.code)}
                    status="danger"
                  >
                    {t('availableLanguages.actions.remove')}
                  </Button>
                ) : null}
                <Form.Item>
                  <Button data-test="admindb-update-btn" htmlType="submit">
                    {t('availableLanguages.actions.update')}
                  </Button>
                </Form.Item>
              </StyledButtonGroup>
            </StyledControlWrapper>
            <Form.Item hidden initialValue={JSON.stringify(l)} name="language">
              <Input type="text" />
            </Form.Item>
          </StyledLanguageStack>
        </Form>
      ),
    }
  })

  return (
    <>
      <h2>{t('availableLanguages.heading')}</h2>
      <Stack style={{ '--space': '1rem' }}>
        <StyledCollapse
          accordion
          destroyInactivePanel
          ghost
          items={languageItems}
          key={JSON.stringify(languages)}
        />

        {newLanguage ? (
          <LanguageWrapper id="new">
            <Form form={newLanguageForm}>
              <StyledLanguageStack>
                <StyledControlWrapper>
                  <label htmlFor="name-new">
                    {t('availableLanguages.customised.languageLabel')}:
                  </label>
                  <Form.Item
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: t(
                          'availableLanguages.customised.languageLabel.error.noValue',
                        ),
                      },
                    ]}
                  >
                    <Input
                      aria-describedby="desc-name-new"
                      data-test="admindb-newLangName-input"
                      id="name-new"
                      type="text"
                    />
                  </Form.Item>
                  <DescriptionParagraph id="desc-name-new">
                    {t(
                      'availableLanguages.customised.languageLabel.explanation',
                    )}
                  </DescriptionParagraph>
                </StyledControlWrapper>
                <StyledControlWrapper>
                  <label htmlFor="flag-code-new">
                    {t('availableLanguages.customised.flagCode')}:
                  </label>
                  <Form.Item
                    name="flagCode"
                    rules={[
                      {
                        required: true,
                        message: t(
                          'availableLanguages.customised.flagCode.error.noValue',
                        ),
                      },
                    ]}
                  >
                    <Input
                      aria-describedby="desc-flag-code-new"
                      data-test="admindb-newLangFlag-input"
                      id="flag-code-new"
                      type="text"
                    />
                  </Form.Item>
                  <DescriptionParagraph id="desc-flag-code-new">
                    <Trans
                      components={{
                        ref: (
                          <a
                            href="https://www.iso.org/obp/ui/#search/code/"
                            rel="noreferrer"
                            target="_blank"
                          />
                        ),
                      }}
                      i18nKey="pages.admin.availableLanguages.customised.flagCode.explanation"
                    />
                  </DescriptionParagraph>
                </StyledControlWrapper>
                <StyledControlWrapper>
                  <Form.Item
                    getValueFromEvent={normFile}
                    label={t(
                      'availableLanguages.customised.uploadInstructions',
                    )}
                    valuePropName="fileList"
                  >
                    <StyledUpload
                      accept=".json"
                      beforeUpload={() => false}
                      data-test="admindb-uploadStrings-btn"
                      maxCount={1}
                      onChange={({ file }) => setTranslationFile(file)}
                    >
                      <UploadBtn>+</UploadBtn>
                    </StyledUpload>
                  </Form.Item>
                </StyledControlWrapper>
              </StyledLanguageStack>
            </Form>
          </LanguageWrapper>
        ) : null}
        <div>
          {!newLanguage ? (
            <Button
              data-test="admindb-addNewLang-btn"
              onClick={() => setNewLanguage(true)}
            >
              {t('availableLanguages.actions.addNew')}
            </Button>
          ) : (
            <>
              <Button
                data-test="admindb-cancelNewLang-btn"
                onClick={() => setNewLanguage(false)}
              >
                {t('cancel', {
                  keyPrefix: 'pages.common.actions',
                })}
              </Button>{' '}
              <Button data-test="admindb-saveNewLang-btn" onClick={addLanguage}>
                {' '}
                {t('availableLanguages.actions.save')}
              </Button>
            </>
          )}
        </div>
      </Stack>
    </>
  )
}

Languages.propTypes = {
  onLanguagesUpdate: PropTypes.func,
  onTranslationsUpload: PropTypes.func,
  languages: PropTypes.arrayOf(PropTypes.shape()),
}

Languages.defaultProps = {
  onLanguagesUpdate: null,
  onTranslationsUpload: null,
  languages: [],
}

export default Languages
