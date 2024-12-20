import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Trans, useTranslation } from 'react-i18next'
import { Modal, Form, Input } from '../common'

const Strong = styled.strong`
  text-transform: capitalize;
`

const Modals = props => {
  const {
    addNewModal,
    setAddNewModal,
    addTemplate,
    addingTemplate,
    disableTemplateModal,
    setDisableTemplateModal,
    disableTemplate,
    disableLoading,
    templateToDisable,
    setTemplateToDisable,
    deleteTemplateModal,
    setDeleteTemplateModal,
    removeTemplate,
    templateToDelete,
    setTemplateToDelete,
  } = props

  const { t } = useTranslation(null, {
    keyPrefix: 'pages.templateManager.modals',
  })

  const [newTemplateForm] = Form.useForm()

  const handleAddTemplate = () => {
    newTemplateForm.validateFields().then(v => {
      addTemplate({
        variables: {
          url: v.tempalteUrl,
        },
      }).then(() => {
        // show message "Created x new templates" or smth
        setAddNewModal(false)
      })
    })
  }

  const handleDisableTemplate = () => {
    disableTemplate({
      variables: {
        url: templateToDisable?.url,
      },
    }).then(() => {
      setTemplateToDisable(null)
      setDisableTemplateModal(false)
    })
  }

  const handleDeleteTemplate = () => {
    removeTemplate({
      variables: {
        url: templateToDelete?.url,
      },
    }).then(() => {
      setTemplateToDelete(null)
      setDeleteTemplateModal(false)
    })
  }

  return (
    <>
      {/* Add new template modal */}
      <Modal
        closable={!addingTemplate}
        confirmLoading={addingTemplate}
        maskClosable={false}
        onCancel={() => setAddNewModal(false)}
        onOk={handleAddTemplate}
        open={addNewModal}
        title={t('new.title')}
      >
        <Form form={newTemplateForm} layout="vertical">
          <Form.Item
            label={t('new.input.label')}
            name="tempalteUrl"
            rules={[
              { required: true, message: t('new.input.errors.empty') },
              { type: 'url', message: t('new.input.errors.invalid') },
            ]}
          >
            <Input
              pattern="https://.*"
              placeholder={t('new.input.placeholder')}
              type="url"
            />
          </Form.Item>
        </Form>
      </Modal>
      {/* Disable template modal */}
      <Modal
        confirmLoading={disableLoading}
        okText={t('actions.disable', { keyPrefix: 'pages.templateManager' })}
        okType="danger"
        onCancel={() => setDisableTemplateModal(false)}
        onOk={handleDisableTemplate}
        open={disableTemplateModal}
        title={t('disable.title')}
      >
        <Trans
          components={[<Strong />]}
          i18nKey="pages.templateManager.modals.disable.body"
          values={{ templateName: templateToDisable?.name }}
        />
      </Modal>
      {/* Delete template modal */}
      <Modal
        confirmLoading={disableLoading}
        okText={t('actions.delete', { keyPrefix: 'pages.templateManager' })}
        okType="danger"
        onCancel={() => setDeleteTemplateModal(false)}
        onOk={handleDeleteTemplate}
        open={deleteTemplateModal}
        title={t('delete.title')}
      >
        <Trans
          components={[<Strong />]}
          i18nKey="pages.templateManager.modals.delete.body"
          values={{ templateName: templateToDelete?.name }}
        />
      </Modal>
    </>
  )
}

Modals.propTypes = {
  addNewModal: PropTypes.bool,
  setAddNewModal: PropTypes.func,
  addTemplate: PropTypes.func,
  addingTemplate: PropTypes.bool,
  disableTemplateModal: PropTypes.bool,
  setDisableTemplateModal: PropTypes.func,
  disableTemplate: PropTypes.func,
  disableLoading: PropTypes.bool,
  templateToDisable: PropTypes.shape({
    name: PropTypes.string,
    url: PropTypes.string,
  }),
  setTemplateToDisable: PropTypes.func,
  deleteTemplateModal: PropTypes.bool,
  setDeleteTemplateModal: PropTypes.func,
  removeTemplate: PropTypes.func,
  templateToDelete: PropTypes.shape({
    name: PropTypes.string,
    url: PropTypes.string,
  }),
  setTemplateToDelete: PropTypes.func,
}

Modals.defaultProps = {
  addNewModal: false,
  setAddNewModal: null,
  addTemplate: null,
  addingTemplate: false,
  disableTemplateModal: false,
  setDisableTemplateModal: null,
  disableTemplate: null,
  disableLoading: false,
  templateToDisable: null,
  setTemplateToDisable: null,
  deleteTemplateModal: false,
  setDeleteTemplateModal: null,
  removeTemplate: null,
  templateToDelete: null,
  setTemplateToDelete: null,
}

export default Modals
