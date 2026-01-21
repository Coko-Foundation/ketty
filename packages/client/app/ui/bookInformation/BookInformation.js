/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import styled from 'styled-components'
import { th, grid } from '@coko/client'
import { Link } from 'react-router-dom'
import {
  DatabaseOutlined,
  PrinterOutlined,
  SettingOutlined,
  UsergroupAddOutlined,
  CopyOutlined,
  CheckOutlined,
} from '@ant-design/icons'
import { Button, Tooltip } from '../common'
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

const InfoTooltip = props => <Tooltip trigger={['hover', 'focus']} {...props} />

const StyledButton = styled(Button)`
  block-size: 34px;
  inline-size: 34px;

  svg {
    font-size: 18px;
  }
`

const StyledLink = styled(Link)`
  block-size: 34px;
  border: 1px solid ${th('colorBorder')};
  color: inherit;
  display: grid;
  font-size: 18px;
  inline-size: 34px;
  place-content: center;

  &:hover {
    color: inherit;
  }
`

const StyledCheckIcon = styled(CheckOutlined)`
  color: ${th('colorSuccess')};
`

const BookInformation = props => {
  const {
    viewInformation,
    toggleInformation,
    showAiAssistantLink,
    showKnowledgeBaseLink,
    bookId,
    onPreview,
  } = props

  const [copiedId, setCopiedId] = useState()

  const copyBookId = () => {
    navigator.clipboard.writeText(bookId)
    setCopiedId(true)
    setTimeout(() => {
      setCopiedId(false)
    }, 2000)
  }

  return (
    <Wrapper>
      <InfoTooltip placement="bottomLeft" title="Copy book id">
        <StyledButton
          aria-label="Copy book id"
          data-test="producer-copy-id-btn"
          icon={copiedId ? <StyledCheckIcon /> : <CopyOutlined />}
          onClick={copyBookId}
        />
      </InfoTooltip>
      <InfoTooltip placement="bottom" title="Metadata">
        <StyledButton
          aria-label="Toggle book metadata"
          aria-pressed={viewInformation === 'metadata'}
          data-test="producer-metadata-btn"
          icon={<DatabaseOutlined />}
          onClick={() => toggleInformation('metadata')}
        />
      </InfoTooltip>
      <InfoTooltip placement="bottom" title="Settings">
        <StyledButton
          aria-label="Toggle book settings"
          aria-pressed={viewInformation === 'settings'}
          icon={<SettingOutlined />}
          onClick={() => toggleInformation('settings')}
        />
      </InfoTooltip>
      <InfoTooltip placement="bottom" title="Share">
        <StyledButton
          aria-label="Toggle book collaborators"
          aria-pressed={viewInformation === 'members'}
          icon={<UsergroupAddOutlined />}
          onClick={() => toggleInformation('members')}
        />
      </InfoTooltip>
      <InfoTooltip placement="bottom" title="Preview and Publish">
        <StyledButton
          aria-label="Preview and Publish"
          icon={<PrinterOutlined />}
          onClick={onPreview}
        />
      </InfoTooltip>
      {showKnowledgeBaseLink && (
        <InfoTooltip placement="bottom" title="Knowledge Base">
          <StyledLink
            aria-label="Knowledge Base"
            to={`/books/${bookId}/knowledge-base`}
          >
            KB
          </StyledLink>
        </InfoTooltip>
      )}
      {showAiAssistantLink && (
        <InfoTooltip placement="bottomRight" title="AI Book Designer (Beta)">
          <StyledLink
            aria-label="AI Book Designer (Beta)"
            to={`/books/${bookId}/ai-pdf`}
          >
            <RobotSvg />
          </StyledLink>
        </InfoTooltip>
      )}
    </Wrapper>
  )
}

export default BookInformation
