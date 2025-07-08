import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Form, Modal } from 'antd'
import { Button, Input } from '../common'

const StyledModal = styled(Modal)``

const Wrapper = styled.div`
  overflow-x: hidden;
`

const WorkflowList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 1ch;
  list-style-type: none;
  padding-left: 0;

  button {
    width: 100%;
  }
`

const WorkflowDetails = styled.div`
  animation: slideIn 0.2s linear;
  background: white;
  box-shadow: -2px 0 8px rgba(0 0 0 / 15%);
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding: 20px;
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 1010;

  > * {
    margin-bottom: 1rem;
    margin-top: 1rem;
  }

  > .principal {
    margin-bottom: auto;
    margin-top: auto;

    .ant-form-item .workflow-tip {
      margin-top: 0;
    }
  }

  > :first-child:not(.principal) {
    margin-top: 0;
  }

  > :last-child:not(.principal) {
    margin-bottom: 0;
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
    }

    to {
      transform: translateX(0);
    }
  }
`

const WorkflowDetailsHeader = styled.div`
  align-items: center;
  display: flex;
  gap: 3ch;

  h2 {
    margin: 0;
  }
`

const PSModal = ({ open, closeModal, pureScienceConfig, onRunWorkflow }) => {
  const [workflow, selectWorkflow] = useState(null)

  const [worflowParamsForm] = Form.useForm()

  const showWorkflow = id => {
    const selectedWorkflow = pureScienceConfig.workflows.find(w => w.id === id)
    selectWorkflow(selectedWorkflow)
  }

  const runWorkflow = () => {
    worflowParamsForm
      .validateFields()
      .then(params => {
        onRunWorkflow(workflow.id, params)
      })
      .catch(e => console.error(e))
  }

  const handleClose = () => {
    closeModal()
    selectWorkflow(null)
  }

  return (
    <StyledModal
      cancelText="Close"
      centered
      destroyOnClose
      maskClosable={false}
      okButtonProps={{ style: { display: 'none' } }}
      onCancel={handleClose}
      open={open}
      title="PureScience Workflows"
      width={480}
    >
      <Wrapper data-hidden={!!workflow}>
        <p id="workflows-list-label">Available PureScience workflows</p>
        <WorkflowList aria-labelledby="workflows-list-label">
          {pureScienceConfig?.workflows?.map(({ id, name }) => {
            return (
              <li key={id}>
                <Button onClick={() => showWorkflow(id)}>{name}</Button>
              </li>
            )
          })}
        </WorkflowList>
      </Wrapper>
      {workflow && (
        <WorkflowDetails>
          <WorkflowDetailsHeader style={{}}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => selectWorkflow(null)}
            >
              Back
            </Button>
            <h2>{workflow.name}</h2>
          </WorkflowDetailsHeader>
          <div className="principal">
            <p>{workflow.description}</p>
            {workflow.workflowParams?.length > 0 && (
              <Form form={worflowParamsForm} layout="vertical">
                {workflow.workflowParams.map((param, index) => (
                  <Form.Item
                    key={param.label.replace(/[^a-zA-Z]/g, '')}
                    label={param.label}
                  >
                    <Form.Item
                      name={param.label}
                      noStyle
                      {...(param.requiredField
                        ? { rules: [{ required: true }] }
                        : {})}
                    >
                      <Input />
                    </Form.Item>
                    <p className="workflow-tip">{param.tip}</p>
                  </Form.Item>
                ))}
              </Form>
            )}
          </div>
          <div>
            <Button onClick={runWorkflow}>Run workflow</Button>
          </div>
        </WorkflowDetails>
      )}
    </StyledModal>
  )
}

PSModal.propTypes = {
  open: PropTypes.bool,
  closeModal: PropTypes.func,
  onRunWorkflow: PropTypes.func,
  pureScienceConfig: PropTypes.shape(),
}

PSModal.defaultProps = {
  open: false,
  closeModal: null,
  pureScienceConfig: null,
  onRunWorkflow: null,
}

export default PSModal
