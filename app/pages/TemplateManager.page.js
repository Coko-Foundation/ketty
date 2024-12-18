import React, { useState } from 'react'
import styled from 'styled-components'
import { useQuery, useMutation } from '@apollo/client'
import { ReloadOutlined } from '@ant-design/icons'
/* eslint-disable-next-line import/no-extraneous-dependencies */
import moment from 'moment'
import {
  GET_TEMPLATES,
  ADD_TEMPLATE,
  REFRESH_TEMPLATE,
  DISABLE_TEMPLATE,
  ENABLE_TEMPLATE,
  REMOVE_TEMPLATE,
} from '../graphql'
import { Table, Button, Modal, Form, Input } from '../ui'

const ButtonWrapper = styled.div`
  display: flex;
  gap: 2ch;
`

const Wrapper = styled.section`
  margin-inline: auto;
  max-inline-size: 1100px;
  padding-inline: 12px;
`

const Header = styled.header`
  align-items: center;
  display: flex;
  justify-content: space-between;
`

const TemplateDetailsWrapper = styled.div`
  padding-inline: clamp(0rem, -1.0435rem + 5.2174vw, 3rem);
`

const TemplateDetails = styled.div`
  display: grid;
  gap: clamp(0.25rem, -0.0109rem + 1.3043vw, 1rem);
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
`

const TemplateActions = styled.div`
  align-items: center;
  display: flex;
  gap: clamp(0.25rem, -0.0109rem + 1.3043vw, 1rem);
`

const StyledP = styled.p`
  max-width: 60ch;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const targetOptions = {
  pagedjs: 'PDF (pagedjs)',
  epub: 'EPUB',
  web: 'Web',
}

const details = {
  expandedRowRender: record => (
    <TemplateDetailsWrapper>
      <TemplateDetails>
        <div>
          <p>
            <strong>Name: </strong>
            {record.name}
          </p>
          <p>
            <strong>Author: </strong>
            {record.author}
          </p>
          <StyledP>
            <strong>URL: </strong>
            <a href={record.url} rel="noreferrer" target="_blank">
              {record.url}
            </a>
          </StyledP>
        </div>
        <div>
          <p>
            <strong id={`${record.name}-template-list`}>
              Available templates:
            </strong>
          </p>
          <ul aria-labelledby={`${record.name}-template-list`}>
            {record.templates.map(t => (
              <li key={t.id}>
                {targetOptions[t.target]}
                {t.target === 'pagedjs' && `, dimensions ${t.trimSize}`}
              </li>
            ))}
          </ul>
        </div>
      </TemplateDetails>
      <TemplateActions>
        {record.enabled ? (
          <Button onClick={record.disable} status="danger">
            Disable
          </Button>
        ) : (
          <Button onClick={record.enable} status="success">
            Enable
          </Button>
        )}
        {record.canBeDeleted ? (
          <Button onClick={record.delete} status="danger">
            Delete template
          </Button>
        ) : (
          <span>This template cannot be deleted</span>
        )}
      </TemplateActions>
    </TemplateDetailsWrapper>
  ),
}

const TemplateMananger = () => {
  const [addNewModal, setAddNewModal] = useState(false)
  const [disableTemplateModal, setDisableTemplateModal] = useState(false)
  const [templateToDisable, setTemplateToDisable] = useState(null)
  const [deleteTemplateModal, setDeleteTemplateModal] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState(null)
  const [currentRefreshTemplate, setCurrentRefreshTemplate] = useState('')
  const [newTemplateForm] = Form.useForm()
  const { data: { getTemplates } = {}, loading } = useQuery(GET_TEMPLATES)

  const [addTemplate, { loading: addingTemplate }] = useMutation(ADD_TEMPLATE, {
    refetchQueries: [GET_TEMPLATES],
  })

  const [refreshTemplate, { loading: refreshingTemplate }] = useMutation(
    REFRESH_TEMPLATE,
    {
      refetchQueries: [GET_TEMPLATES],
    },
  )

  const [disableTemplate, { loading: disableLoading }] = useMutation(
    DISABLE_TEMPLATE,
    {
      refetchQueries: [GET_TEMPLATES],
    },
  )

  const [enableTemplate] = useMutation(ENABLE_TEMPLATE, {
    refetchQueries: [GET_TEMPLATES],
  })

  const [removeTemplate] = useMutation(REMOVE_TEMPLATE, {
    refetchQueries: [GET_TEMPLATES],
  })

  const parseTempaltes = data => {
    if (data) {
      const map = new Map()

      data.forEach(item => {
        const key = item.name
        const collection = map.get(key)

        if (!collection) {
          map.set(key, [item])
        } else {
          collection.push(item)
        }
      })

      return Array.from(map, ([name, templates], i) => ({
        key: i,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        enabled: templates[0].enabled,
        author: templates[0].author,
        lastUpdated: templates.reduce(
          (lastUpdated, template) =>
            template.lastUpdated > lastUpdated
              ? template.lastUpdated
              : lastUpdated,
          templates[0].lastUpdated,
        ),
        url: templates[0].url,
        canBeDeleted: templates[0].canBeDeleted,
        templates,
        disable: () => {
          setTemplateToDisable({ name, url: templates[0].url })
          setDisableTemplateModal(true)
        },
        enable: () => {
          handleEnableTemplate(templates[0].url)
        },
        delete: () => {
          setTemplateToDelete({ name, url: templates[0].url })
          setDeleteTemplateModal(true)
        },
      })).sort((a, b) => b.enabled - a.enabled)
    }

    return null
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (value, row) => {
        return `${value} ${row.enabled ? '' : ' (disabled)'}`
      },
    },
    {
      title: 'Last updated',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
      render: lastUpdated => moment(new Date(lastUpdated)).fromNow(),
    },
    {
      title: 'Actions',
      dataIndex: 'url',
      key: 'actions',
      render: url => {
        const refreshing = refreshingTemplate && currentRefreshTemplate === url
        return (
          <ButtonWrapper>
            <Button
              disabled={refreshingTemplate}
              loading={refreshing}
              onClick={() => handleRefreshTempalte(url)}
            >
              {!refreshing && <ReloadOutlined />}
              Refresh
            </Button>
          </ButtonWrapper>
        )
      },
    },
  ]

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

  const handleRefreshTempalte = url => {
    setCurrentRefreshTemplate(url)
    refreshTemplate({
      variables: {
        url,
      },
    }).then(() => {
      setCurrentRefreshTemplate('')
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

  const handleEnableTemplate = url => {
    enableTemplate({
      variables: {
        url,
      },
    }).then(() => {})
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
    <Wrapper>
      <Header>
        <h1>Template manager</h1>
        <Button onClick={() => setAddNewModal(true)}>+ Add template</Button>
      </Header>
      <Table
        columns={columns}
        dataSource={parseTempaltes(getTemplates)}
        expandable={details}
        loading={loading}
        pagination={false}
      />
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
    </Wrapper>
  )
}

export default TemplateMananger
