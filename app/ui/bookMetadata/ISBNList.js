import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { get, isEmpty } from 'lodash'
import { MinusCircleTwoTone, PlusOutlined } from '@ant-design/icons'
import { Button, Form } from 'antd'
import ISBNInput from './ISBNInput'

const IconWrapper = styled(Button)`
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
  }
`

const ISBNList = ({ canChangeMetadata, name }) => {
  const checkForDuplicates = (items, itemPath, itemDescription) => {
    if (!isEmpty(items)) {
      // Identify duplicate
      const valueCount = {}
      const duplicates = []
      items.forEach(item => {
        const trimmedValue = get(item, itemPath, '').trim()

        if (!isEmpty(trimmedValue)) {
          valueCount[trimmedValue] = (valueCount[trimmedValue] || 0) + 1

          if (valueCount[trimmedValue] === 2) {
            duplicates.push(trimmedValue)
          }
        }
      })

      if (!isEmpty(duplicates)) {
        return Promise.reject(
          new Error(
            `Duplicate ${itemDescription} values: "${duplicates.join('", "')}"`,
          ),
        )
      }
    }

    return Promise.resolve()
  }

  return (
    <Form.List
      name={name}
      rules={[
        {
          validator: async (_, items) => {
            return checkForDuplicates(items, 'label', 'Label')
          },
        },
        {
          validator: async (_, items) => {
            return checkForDuplicates(items, 'isbn', 'ISBN')
          },
        },
      ]}
    >
      {(fields, { add, remove }, { errors }) => {
        return (
          <div>
            {fields.map(field => (
              <div key={field.key}>
                <ISBNInput
                  canChangeMetadata={canChangeMetadata}
                  field={field}
                  initialValue=""
                  label="ISBN label"
                  name="label"
                  placeholder="Label"
                  rules={[
                    {
                      validator: (_, value) => {
                        const trimmedValue = value?.trim() || ''

                        if (fields.length > 1 && trimmedValue === '') {
                          return Promise.reject(
                            new Error('Label is required (for multiple ISBNs)'),
                          )
                        }

                        if (value && !trimmedValue) {
                          return Promise.reject(
                            new Error('Label contains only spaces'),
                          )
                        }

                        return Promise.resolve()
                      },
                    },
                  ]}
                  style={{ width: 'calc(30% - 18px)' }}
                />
                <span style={{ display: 'inline-block', width: '10px' }} />
                <ISBNInput
                  canChangeMetadata={canChangeMetadata}
                  field={field}
                  label="ISBN value"
                  name="isbn"
                  placeholder="ISBN: update this value before exporting versions requiring unique identifier"
                  rules={[
                    {
                      validator: (_, value) => {
                        const trimmedValue = value?.trim() || ''

                        if (!trimmedValue) {
                          return Promise.reject(new Error('ISBN is required'))
                        }

                        if (trimmedValue.search(/[^\s\-0-9]/) !== -1) {
                          return Promise.reject(new Error('ISBN is invalid'))
                        }

                        return Promise.resolve()
                      },
                    },
                  ]}
                  style={{ width: 'calc(70% - 18px)' }}
                />
                <Form.Item style={{ display: 'inline-block', width: '26px' }}>
                  <IconWrapper
                    disabled={!canChangeMetadata}
                    icon={
                      canChangeMetadata ? (
                        <MinusCircleTwoTone twoToneColor="red" />
                      ) : (
                        <MinusCircleTwoTone twoToneColor="lightgrey" />
                      )
                    }
                    onClick={() => {
                      remove(field.name)
                    }}
                    type="danger"
                  />
                </Form.Item>
              </div>
            ))}
            <Form.Item
              style={{ marginBottom: '0px', textAlign: 'right' }}
              wrapperCol={{ span: 24 }}
            >
              <Button
                data-test="metadata-addIsbn-btn"
                disabled={!canChangeMetadata}
                onClick={() => add()}
                type="dashed"
              >
                <PlusOutlined /> Add{fields.length < 1 ? '' : ' Another'} ISBN
              </Button>
            </Form.Item>
            <Form.Item style={{ paddingLeft: '1em' }} wrapperCol={{ span: 24 }}>
              <Form.ErrorList errors={errors} />
            </Form.Item>
          </div>
        )
      }}
    </Form.List>
  )
}

ISBNList.propTypes = {
  canChangeMetadata: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
}

export default ISBNList
