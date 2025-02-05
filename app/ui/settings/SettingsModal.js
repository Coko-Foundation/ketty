import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Switch, Form } from 'antd'
import { useMutation, useSubscription } from '@apollo/client'
import { useCurrentUser, grid } from '@coko/client'
import { DeleteOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

import {
  BOOK_SETTINGS_UPDATED_SUBSCRIPTION,
  UPDATE_SETTINGS,
} from '../../graphql'
import { isAdmin, isOwner } from '../../helpers/permissions'
import { Button, Input } from '../common'
import ConfigurableEditorSettings from './ConfigurableEditorSettings'
import configWithAI from '../wax/config/configWithAI'

const Stack = styled.div`
  --space: 24px;
  /* ↓ The flex context */
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: flex-start;

  > * {
    /* ↓ Any extant vertical margins are removed */
    margin-block: 0;
  }

  > * + * {
    /* ↓ Top margin is only applied to successive elements */
    margin-block-start: var(--space, 2rem);
  }
`

const Indented = styled.div`
  padding-inline-start: ${grid(3)};
`

const SettingsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`

const SettingTitle = styled.strong``

const SettingInfo = styled.div`
  display: flex;
  justify-content: space-between;
`

const ButtonsContainer = styled.div`
  display: flex;
  gap: ${grid(4)};
  justify-content: right;
  margin-top: 36px;
`

const StyledButton = styled(Button)`
  box-shadow: none;
  padding: 0 2%;
`

const StyledForm = styled(Form)`
  display: flex;
  gap: ${grid(4)};
  margin-top: 24px;
`

const StyledFormItem = styled(Form.Item)`
  margin-block-end: 0;
  width: 100%;
`

const StyledFormButton = styled(Button)`
  height: fit-content;
`

const StyledList = styled.ul`
  list-style-type: none;
  padding-inline-start: 0;
`

const StyledListItem = styled.li`
  display: flex;
  justify-content: space-between;
  margin: 0 0 0 ${grid(1)};
`

const StyledListButton = styled(Button)`
  background-color: unset;
  border: none;
  color: red;
`

const SettingsModal = ({
  bookId,
  bookSettings,
  closeModal,
  refetchBookSettings,
}) => {
  const { t } = useTranslation(null, {
    keyPrefix: 'pages.common.header.bookSettingsModal',
  })

  const [form] = Form.useForm()
  form.validateTrigger = ['onSubmit']

  const { currentUser } = useCurrentUser()

  const [isAiOn, setIsAiOn] = useState(bookSettings.aiOn)
  const [isAiPdfOn, setIsAiPdfOn] = useState(!!bookSettings.aiPdfDesignerOn)

  const [isCustomPromptsOn, setIsCustomPromptsOn] = useState(
    bookSettings.customPromptsOn,
  )

  const [isFreeTextPromptsOn, setIsFreeTextPromptsOn] = useState(
    !!bookSettings.freeTextPromptsOn,
  )

  const [prompts, setPrompts] = useState(bookSettings.customPrompts || [])

  const [isKnowledgeBaseOn, setIsKnowledgeBaseOn] = useState(
    !!bookSettings.knowledgeBaseOn,
  )

  const [isConfigurableEditorOn, setIsConfigurableEditorOn] = useState(
    !!bookSettings.configurableEditorOn,
  )

  const [waxMenuConfig, setWaxMenuConfig] = useState(
    bookSettings.configurableEditorTools?.length > 0
      ? JSON.parse(bookSettings.configurableEditorTools)
      : configWithAI.MenuService[0].toolGroups,
  )

  // MUTATIONS SECTION START
  const [updateBookSettings, { loading: updateLoading }] = useMutation(
    UPDATE_SETTINGS,
    {
      onCompleted: closeModal,
    },
  )

  useSubscription(BOOK_SETTINGS_UPDATED_SUBSCRIPTION, {
    variables: { id: bookId },
    fetchPolicy: 'network-only',
    onData: () => refetchBookSettings({ id: bookId }),
  })

  const handleUpdateBookSettings = () => {
    // Both Free text and Custom prompts cannot be off
    // This check will throw a validation error to nudge user to add a prompt
    const inputPrompt = form.getFieldValue('prompt')

    const isPromptAdded = prompts.includes(inputPrompt?.trim())

    if (inputPrompt?.trim() && !isPromptAdded) {
      form.setFields([
        {
          name: 'prompt',
          errors: [t('add_prompt_missing')],
        },
      ])
      return
    }

    if (isAiOn && !isFreeTextPromptsOn && !prompts.length) {
      form.validateFields(['prompt'])
      return
    }

    updateBookSettings({
      variables: {
        bookId,
        aiOn: isAiOn,
        aiPdfDesignerOn: isAiPdfOn,
        freeTextPromptsOn: isFreeTextPromptsOn,
        customPrompts: prompts,
        customPromptsOn: isCustomPromptsOn,
        knowledgeBaseOn: isKnowledgeBaseOn,
        configurableEditorOn: isConfigurableEditorOn,
        configurableEditorTools: JSON.stringify(waxMenuConfig),
      },
    })
  }

  const saveWaxTools = tools => {
    setWaxMenuConfig(tools)
  }

  const toggleAiOn = toggle => {
    setIsAiOn(toggle)

    if (isKnowledgeBaseOn && !toggle) {
      setIsKnowledgeBaseOn(false)
    }
  }

  const handleDeletePrompt = prompt => {
    // Remove the prompt from the list
    const customPrompts = prompts.filter(item => item !== prompt)
    setPrompts(customPrompts)
  }

  const handleAddPrompt = values => {
    const { prompt } = values

    if (prompts.includes(prompt.trim())) {
      form.setFields([
        {
          name: 'prompt',
          errors: [t('add_prompt_duplicate')],
        },
      ])
      return
    }

    // Avoid adding duplicate prompts
    const customPrompts = [...new Set([...prompts, prompt.trim()])]

    setPrompts(customPrompts)
    form.setFieldsValue({ prompt: '' })
  }

  const toggleFreePromptSwitch = toggle => {
    setIsFreeTextPromptsOn(toggle)

    // We can have both free-text and custom prompts off
    if (!isCustomPromptsOn && toggle === false) {
      setIsCustomPromptsOn(true)
    }

    if (isKnowledgeBaseOn && !toggle) {
      setIsKnowledgeBaseOn(false)
    }
  }

  const toggleCustomPromptsSwitch = toggle => {
    setIsCustomPromptsOn(toggle)

    // We can have both free-text and custom prompts off
    if (!isFreeTextPromptsOn && !toggle) {
      setIsFreeTextPromptsOn(true)
    }
  }

  const toggleKnowledgeBase = value => {
    setIsKnowledgeBaseOn(value)

    if (value === true && !isAiOn) {
      setIsAiOn(true)
    }

    if (value === true && !isFreeTextPromptsOn) {
      setIsFreeTextPromptsOn(true)
    }
  }

  const toggleConfigurableEditor = value => {
    setIsConfigurableEditorOn(!isConfigurableEditorOn)
  }

  const canChangeSettings = isAdmin(currentUser) || isOwner(bookId, currentUser)

  return (
    <Stack>
      <SettingsWrapper style={{ marginTop: '24px' }}>
        <div>
          <SettingTitle>{t('aiWriting.promptUse')}</SettingTitle>
          <SettingInfo>{t('aiWriting.promptUse.detail')}</SettingInfo>
        </div>
        <Switch
          checked={isAiOn}
          data-test="settings-toggleAI-switch"
          disabled={updateLoading || !canChangeSettings}
          onChange={toggleAiOn}
        />
      </SettingsWrapper>

      {isAiOn && (
        <Indented>
          <Stack>
            <SettingsWrapper>
              <SettingInfo>
                <SettingTitle>{t('aiWriting.freeText')}</SettingTitle>
              </SettingInfo>
              <Switch
                checked={isFreeTextPromptsOn}
                data-test="settings-freeTextPrompt-switch"
                disabled={updateLoading || !canChangeSettings}
                onChange={e => toggleFreePromptSwitch(e)}
              />
            </SettingsWrapper>

            <SettingsWrapper>
              <SettingInfo>
                <SettingTitle>{t('aiWriting.customPrompts')}</SettingTitle>
              </SettingInfo>
              <Switch
                checked={isCustomPromptsOn}
                data-test="settings-customPrompt-switch"
                disabled={updateLoading || !canChangeSettings}
                onChange={e => toggleCustomPromptsSwitch(e)}
              />

              {isCustomPromptsOn && (
                <Stack style={{ width: '100%' }}>
                  {canChangeSettings && (
                    <StyledForm form={form} onFinish={handleAddPrompt}>
                      <StyledFormItem
                        name="prompt"
                        rules={[
                          {
                            required: true,
                            message: t(
                              'aiWriting.customPrompts.input.errors.noValue',
                            ),
                            validator: (_, value) => {
                              if (!value.trim().length) {
                                return Promise.reject()
                              }

                              return Promise.resolve()
                            },
                          },
                        ]}
                      >
                        <Input
                          placeholder={t('aiWriting.customPrompts.input')}
                        />
                      </StyledFormItem>
                      <StyledFormButton
                        disabled={updateLoading || !canChangeSettings}
                        htmlType="submit"
                      >
                        {t('aiWriting.customPrompts.actions.add')}
                      </StyledFormButton>
                    </StyledForm>
                  )}

                  <StyledList>
                    {prompts.map(prompt => (
                      <StyledListItem key={prompt}>
                        {prompt}
                        <StyledListButton
                          disabled={updateLoading || !canChangeSettings}
                          htmlType="submit"
                          onClick={() => handleDeletePrompt(prompt)}
                        >
                          <DeleteOutlined />
                        </StyledListButton>
                      </StyledListItem>
                    ))}
                  </StyledList>
                </Stack>
              )}
            </SettingsWrapper>
          </Stack>
        </Indented>
      )}

      <SettingsWrapper>
        <div>
          <SettingTitle>{t('aiDesigner')}</SettingTitle>
          <SettingInfo>{t('aiDesigner.detail')}.</SettingInfo>
        </div>
        <Switch
          checked={isAiPdfOn}
          data-test="settings-AIDesigner-switch"
          disabled={updateLoading || !canChangeSettings}
          onChange={e => setIsAiPdfOn(e)}
        />
      </SettingsWrapper>

      <SettingsWrapper style={{ flexWrap: 'nowrap' }}>
        <div>
          <SettingTitle>{t('knowledgeBase')}</SettingTitle>
          <SettingInfo>{t('knowledgeBase.detail')}</SettingInfo>
        </div>
        <Switch
          checked={isKnowledgeBaseOn}
          data-test="settings-kb-switch"
          disabled={updateLoading || !canChangeSettings}
          onChange={e => toggleKnowledgeBase(e)}
        />
      </SettingsWrapper>
      <SettingsWrapper>
        <div>
          <SettingTitle>{t('configurableEditor')}</SettingTitle>
          <SettingInfo>{t('configurableEditor.detail')}</SettingInfo>
        </div>
        <Switch
          checked={isConfigurableEditorOn}
          data-test="configurable-editor-switch"
          disabled={updateLoading || !canChangeSettings}
          onChange={e => toggleConfigurableEditor(e)}
        />
      </SettingsWrapper>
      {isConfigurableEditorOn && (
        <ConfigurableEditorSettings
          savedWaxMenuConfig={waxMenuConfig}
          saveWaxTools={saveWaxTools}
        />
      )}
      <ButtonsContainer>
        <StyledButton
          data-test="settings-cancel-btn"
          disabled={updateLoading}
          htmlType="reset"
          onClick={closeModal}
        >
          {t('cancel', { keyPrefix: 'pages.common.actions' })}
        </StyledButton>

        <StyledButton
          data-test="settings-save-btn"
          disabled={!canChangeSettings}
          htmlType="submit"
          loading={updateLoading}
          onClick={handleUpdateBookSettings}
          type="primary"
        >
          {t('save', { keyPrefix: 'pages.common.actions' })}
        </StyledButton>
      </ButtonsContainer>
    </Stack>
  )
}

SettingsModal.propTypes = {
  bookId: PropTypes.string.isRequired,
  bookSettings: PropTypes.shape({
    aiOn: PropTypes.bool,
    aiPdfDesignerOn: PropTypes.bool,
    freeTextPromptsOn: PropTypes.bool,
    customPrompts: PropTypes.arrayOf(PropTypes.string),
    customPromptsOn: PropTypes.bool,
    knowledgeBaseOn: PropTypes.bool,
    configurableEditorOn: PropTypes.bool,
    configurableEditorTools: PropTypes.arrayOf(PropTypes.string),
  }),
  closeModal: PropTypes.func.isRequired,
  refetchBookSettings: PropTypes.func.isRequired,
}

SettingsModal.defaultProps = {
  bookSettings: {
    aiOn: false,
    aiPdfDesignerOn: false,
    freeTextPromptsOn: false,
    customPromptsOn: false,
    knowledgeBaseOn: false,
  },
}
export default SettingsModal
