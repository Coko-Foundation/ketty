/* stylelint-disable string-quotes */
/* eslint-disable react/prop-types */
import React from 'react'
import styled from 'styled-components'
import { grid, th } from '@coko/client'
import { ComponentPlugin, WaxView } from 'wax-prosemirror-core'

const LayoutWrapper = styled.div`
  align-self: stretch;
`

const EditorWrapper = styled.div`
  background-color: ${th('colorBackgroundHue')};
  border: 2px solid rgb(5 5 5 / 6%);
  padding: ${grid(2)};

  .ProseMirror {
    background-color: ${th('colorBackground')};
    color: ${th('colorText')};
    padding: ${grid(1)} ${grid(3)};
  }
`

const ToolbarContainer = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  margin-block-end: ${grid(2)};

  > div:first-child {
    > :is(button) {
      block-size: 24px;
      inline-size: 24px;

      &::before {
        font-weight: 700;
      }

      &:nth-child(1)::before {
        content: 'H1';
      }

      &:nth-child(2)::before {
        content: 'H2';
      }

      &:nth-child(3)::before {
        content: 'H3';
      }

      span {
        display: none;
      }
    }
  }
`

const SimpleToolBar = ComponentPlugin('topBar')

const SimpleLayout = props => {
  const { className, ...rest } = props

  return (
    <LayoutWrapper
      className={className}
      data-testid="simple-layout-wrapper"
      id="simple-layout"
    >
      <ToolbarContainer>
        <SimpleToolBar />
      </ToolbarContainer>
      <EditorWrapper>
        <WaxView {...rest} />
      </EditorWrapper>
    </LayoutWrapper>
  )
}

export default SimpleLayout
