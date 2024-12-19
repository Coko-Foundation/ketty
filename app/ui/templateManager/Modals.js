import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Input } from '../common'

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
        title="Add new template"
      >
        <Form form={newTemplateForm} layout="vertical">
          <Form.Item
            label="Template URL"
            name="tempalteUrl"
            rules={[{ required: true }, { type: 'url' }]}
          >
            <Input
              pattern="https://.*"
              placeholder="URL of your template's repository"
              type="url"
            />
          </Form.Item>
        </Form>
      </Modal>
      {/* Disable template modal */}
      <Modal
        confirmLoading={disableLoading}
        okText="Disable"
        okType="danger"
        onCancel={() => setDisableTemplateModal(false)}
        onOk={handleDisableTemplate}
        open={disableTemplateModal}
        title="Disable template"
      >
        Are you sure you want to disable the{' '}
        <strong>{templateToDisable?.name}</strong> template? The template will
        not be available for users in the Preview & Publish page.
      </Modal>
      {/* Delete template modal */}
      <Modal
        confirmLoading={disableLoading}
        okText="Delete"
        okType="danger"
        onCancel={() => setDeleteTemplateModal(false)}
        onOk={handleDeleteTemplate}
        open={deleteTemplateModal}
        title="Delete template"
      >
        Are you sure you want to delete the{' '}
        <strong>{templateToDelete?.name}</strong> template?.
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
  templateToDisable: PropTypes.string,
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
  templateToDisable: '',
  setTemplateToDisable: null,
  deleteTemplateModal: false,
  setDeleteTemplateModal: null,
  removeTemplate: null,
  templateToDelete: null,
  setTemplateToDelete: null,
}

export default Modals
