import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Switch, Form } from 'antd'
import { useMutation, useSubscription } from '@apollo/client'
import { useCurrentUser, grid } from '@coko/client'
import { DeleteOutlined } from '@ant-design/icons'
import {
  BOOK_SETTINGS_UPDATED_SUBSCRIPTION,
  UPDATE_SETTINGS,
} from '../../graphql'
import { isAdmin, isOwner } from '../../helpers/permissions'
import { Button, Input } from '../common'

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
          errors: ['Click "Add prompt" then save'],
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
      },
    })
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
          errors: ['This is a duplicate prompt'],
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

  const canChangeSettings = isAdmin(currentUser) || isOwner(bookId, currentUser)

  return (
    <Stack>
      <SettingsWrapper style={{ marginTop: '24px' }}>
        <div>
          <SettingTitle>AI writing prompt use</SettingTitle>
          <SettingInfo>
            Users with edit access to this book can use AI writing prompts
          </SettingInfo>
        </div>
        <Switch
          checked={isAiOn}
          disabled={updateLoading || !canChangeSettings}
          onChange={toggleAiOn}
        />
      </SettingsWrapper>

      {isAiOn && (
        <Indented>
          <Stack>
            <SettingsWrapper>
              <SettingInfo>
                <SettingTitle>Free-text writing prompts</SettingTitle>
              </SettingInfo>
              <Switch
                checked={isFreeTextPromptsOn}
                disabled={updateLoading || !canChangeSettings}
                onChange={e => toggleFreePromptSwitch(e)}
              />
            </SettingsWrapper>

            <SettingsWrapper>
              <SettingInfo>
                <SettingTitle>Customize AI writing prompts</SettingTitle>
              </SettingInfo>
              <Switch
                checked={isCustomPromptsOn}
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
                            message: 'Please input a prompt',
                            validator: (_, value) => {
                              if (!value.trim().length) {
                                return Promise.reject()
                              }

                              return Promise.resolve()
                            },
                          },
                        ]}
                      >
                        <Input placeholder="Add Prompt" />
                      </StyledFormItem>
                      <StyledFormButton
                        disabled={updateLoading || !canChangeSettings}
                        htmlType="submit"
                      >
                        Add Prompt
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
          <SettingTitle>AI Book Designer (Beta)</SettingTitle>
          <SettingInfo>
            Users with edit access to this book can use the AI Book Designer
          </SettingInfo>
        </div>
        <Switch
          checked={isAiPdfOn}
          disabled={updateLoading || !canChangeSettings}
          onChange={e => setIsAiPdfOn(e)}
        />
      </SettingsWrapper>

      <SettingsWrapper style={{ flexWrap: 'nowrap' }}>
        <div>
          <SettingTitle>Knowledge Base</SettingTitle>
          <SettingInfo>
            Users with edit access to this book can create and query a knowledge
            base. <br /> Requires AI writing prompts and free text prompts to be
            on.
          </SettingInfo>
        </div>
        <Switch
          checked={isKnowledgeBaseOn}
          disabled={updateLoading || !canChangeSettings}
          onChange={e => toggleKnowledgeBase(e)}
        />
      </SettingsWrapper>
      <ButtonsContainer>
        <StyledButton
          disabled={!canChangeSettings}
          htmlType="submit"
          loading={updateLoading}
          onClick={handleUpdateBookSettings}
          type="primary"
        >
          Save
        </StyledButton>

        <StyledButton
          disabled={updateLoading}
          htmlType="reset"
          onClick={closeModal}
        >
          Cancel
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
