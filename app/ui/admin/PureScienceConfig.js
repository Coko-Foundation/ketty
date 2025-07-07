import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Form, Card } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { grid, th } from '@coko/client'
import { Button, Checkbox, Input, Stack } from '../common'

const UpdateResult = styled.span`
  color: ${props => (props.$success ? th('colorSuccess') : th('colorError'))};
  display: inline-flex;
  gap: ${grid(1)};
`

const StyledCard = styled(Card)`
  button:has(svg) {
    border: none;
    box-shadow: none;
    height: 16px;
    width: 16px;

    svg {
      height: 0.8em;
      width: 0.8em;
    }
  }
`

const WorkflowParamWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-flow: wrap;
  gap: 16px;

  .ant-form-item {
    align-self: stretch;
    flex-basis: 25%;
    flex-grow: 1;
    margin-block-end: 0;
  }
`

const SaveConfigWrapper = styled.div`
  align-items: center;
  display: flex;
  gap: 32px;
`

const PureScienceConfig = props => {
  const { onUpdatePsConfig, psConfig, paramsLoading } = props

  const [psConfigForm] = Form.useForm()
  const [psConfigUpdateResult, setPsConfigUpdateResult] = useState()

  useEffect(() => {
    if (psConfig) psConfigForm.setFieldsValue(psConfig)
  }, [psConfig])

  const handleUpdatePsConfig = () => {
    psConfigForm.validateFields().then(vals => {
      onUpdatePsConfig(vals)
        .then(() => {
          setPsConfigUpdateResult({
            success: true,
            message: 'PureScience config updated',
            // message: t('integrations.pureScience.updateConfig.success'),
          })
          setTimeout(() => {
            setPsConfigUpdateResult(null)
          }, 5000)
        })
        .catch(() => {
          setPsConfigUpdateResult({
            success: false,
            message: 'Error updating PureScience config',
            // message: t('integrations.pureScience.updateConfig.error'),
          })
          setTimeout(() => {
            setPsConfigUpdateResult(null)
          }, 5000)
        })
    })
  }

  return (
    <>
      <h2>PureScience</h2>
      <Form
        form={psConfigForm}
        layout="vertical"
        onFinish={handleUpdatePsConfig}
      >
        <Form.Item
          label="PureScience graphql endpoint"
          name="url"
          rules={[
            {
              required: true,
            },
          ]}
          tooltip="Graphql endpoint of you PureScience instance where requests will be posted"
        >
          <Input />
        </Form.Item>
        <Form.Item label="Workflows">
          <Form.List name="workflows">
            {(fields, { add, remove }) => (
              <Stack style={{ '--space': '1rem' }}>
                {fields.map(({ key, name, ...restFields }, index) => (
                  <StyledCard
                    extra={
                      <Button
                        icon={<CloseOutlined />}
                        onClick={() => {
                          remove(name)
                        }}
                      />
                    }
                    key={key}
                    size="small"
                    title={`Workflow ${name + 1}`}
                  >
                    <Form.Item
                      {...restFields}
                      label="Workflow name"
                      name={[index, 'name']}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                      tooltip="Name of the workflow that will appear in the editor UI"
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      {...restFields}
                      label="Workflow description"
                      name={[index, 'description']}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                      tooltip="User-friendly description of what the workflow does."
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      {...restFields}
                      label="Webhook token"
                      name={[index, 'id']}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                      tooltip="Token from the webhook trigger node in your workflow"
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item label="If the workflow needs additional parameters from the user, you can specify them below">
                      <Form.List name={[name, 'workflowParams']}>
                        {(subFields, subOpt) => (
                          <WorkflowParamWrapper>
                            {subFields.map(subField => (
                              <WorkflowParamWrapper key={subField.key}>
                                <Form.Item
                                  name={[subField.name, 'label']}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Parameter label is required',
                                    },
                                  ]}
                                >
                                  <Input placeholder="Parameter label" />
                                </Form.Item>
                                <Form.Item name={[subField.name, 'tip']}>
                                  <Input placeholder="Tip that explains what the parameter is about" />
                                </Form.Item>
                                <Form.Item
                                  layout="horizontal"
                                  name={[subField.name, 'requiredField']}
                                  valuePropName="checked"
                                >
                                  <Checkbox>Required</Checkbox>
                                </Form.Item>

                                <Button
                                  icon={<CloseOutlined />}
                                  onClick={() => {
                                    subOpt.remove(subField.name)
                                  }}
                                />
                              </WorkflowParamWrapper>
                            ))}
                            <Button
                              type="dashed"
                              onClick={() => subOpt.add()}
                              block
                              style={{ flexGrow: 1 }}
                            >
                              + Add workflow param
                            </Button>
                          </WorkflowParamWrapper>
                        )}
                      </Form.List>
                    </Form.Item>
                  </StyledCard>
                ))}
                <Button block onClick={() => add()} type="dashed">
                  + Add workflow
                </Button>
              </Stack>
            )}
          </Form.List>
        </Form.Item>
        <SaveConfigWrapper>
          <Button loading={paramsLoading} htmlType="submit">
            Save PureScience config
          </Button>
          <UpdateResult $success={psConfigUpdateResult?.success} role="status">
            {psConfigUpdateResult?.message && (
              <>
                {psConfigUpdateResult?.success ? (
                  <CheckOutlined />
                ) : (
                  <CloseOutlined />
                )}

                {psConfigUpdateResult?.message}
              </>
            )}
          </UpdateResult>
        </SaveConfigWrapper>
      </Form>
    </>
  )
}

PureScienceConfig.propTypes = {
  onUpdatePsConfig: PropTypes.func,
  psConfig: PropTypes.shape({
    url: PropTypes.string,
    workflows: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
      }),
    ),
  }),
  paramsLoading: PropTypes.bool,
}

PureScienceConfig.defaultProps = {
  onUpdatePsConfig: null,
  psConfig: null,
  paramsLoading: false,
}

export default PureScienceConfig
