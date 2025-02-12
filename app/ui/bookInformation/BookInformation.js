/* eslint-disable react/prop-types */
import React from 'react'
import styled from 'styled-components'
import { th, grid } from '@coko/client'
import { Link } from 'react-router-dom'
import {
  DatabaseOutlined,
  PrinterOutlined,
  SettingOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons'
import { Tooltip as AntTooltip } from 'antd'
import { Button } from '../common'
import RobotSvg from './RobotSvg'

const Wrapper = styled.div`
  border-bottom: 1px solid ${th('colorBorder')};
  display: flex;
  flex-shrink: 0;
  gap: 1ch;
  padding: ${grid(2)} 0;
  width: 100%;

  > button[aria-pressed='true'] {
    background-color: rgb(63 133 198);
    color: white;

    &:hover {
      border-color: rgb(63 133 198);
      color: white;
    }
  }

  #book-menu {
    margin-block-start: 0; // ${grid(3)};
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.4s, margin-block-start 0.4s;

    button,
    a {
      padding-inline: 24px;
      text-align: start;
      width: 100%;
    }

    button {
      border-radius: 0;
      text-align: left;

      &[aria-pressed='true'] {
        background-color: rgb(63 133 198 / 33%);
        border-inline-start: 2px solid rgb(63 133 198);
      }
    }
  }

  &:has(#book-menu-toggle[aria-expanded='true']) > #book-menu {
    margin-block-start: ${grid(3)};
    max-height: 1000px;
  }
`

const Tooltip = props => <AntTooltip trigger={['hover', 'focus']} {...props} />

const StyledLink = styled(Link)`
  border: 1px solid ${th('colorBorder')};
  color: inherit;
  display: grid;
  place-content: center;
  width: 32px;

  &:hover {
    color: inherit;
  }
`

const BookInformation = props => {
  const {
    viewInformation,
    toggleInformation,
    showAiAssistantLink,
    showKnowledgeBaseLink,
    bookId,
  } = props

  return (
    <Wrapper>
      <Tooltip placement="bottomLeft" title="Metadata">
        <Button
          aria-label="Toggle book metadata"
          aria-pressed={viewInformation === 'metadata'}
          data-test="producer-metadata-btn"
          icon={<DatabaseOutlined />}
          onClick={() => toggleInformation('metadata')}
        />
      </Tooltip>
      <Tooltip placement="bottom" title="Settings">
        <Button
          aria-label="Toggle book settings"
          aria-pressed={viewInformation === 'settings'}
          icon={<SettingOutlined />}
          onClick={() => toggleInformation('settings')}
        />
      </Tooltip>
      <Tooltip placement="bottom" title="Share">
        <Button
          aria-label="Toggle book collaborators"
          aria-pressed={viewInformation === 'members'}
          icon={<UsergroupAddOutlined />}
          onClick={() => toggleInformation('members')}
        />
      </Tooltip>
      <Tooltip placement="bottom" title="Preview and Publish">
        <StyledLink
          aria-label="Preview and Publish"
          to={`/books/${bookId}/exporter`}
        >
          <PrinterOutlined />
        </StyledLink>
      </Tooltip>
      {showKnowledgeBaseLink && (
        <Tooltip placement="bottom" title="Knowledge Base">
          <StyledLink
            aria-label="Knowledge Base"
            to={`/books/${bookId}/knowledge-base`}
          >
            KB
          </StyledLink>
        </Tooltip>
      )}
      {showAiAssistantLink && (
        <Tooltip placement="bottomRight" title="AI Book Designer (Beta)">
          <StyledLink
            aria-label="AI Book Designer (Beta)"
            to={`/books/${bookId}/ai-pdf`}
          >
            <RobotSvg />
          </StyledLink>
        </Tooltip>
      )}
    </Wrapper>
  )
}

export default BookInformation
