/* stylelint-disable string-quotes */
/* eslint-disable react/prop-types */
import React, { useContext } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { grid, th } from '@coko/client'
import { Spin } from 'antd'
import { WaxContext, ComponentPlugin, WaxView } from 'wax-prosemirror-core'
import BookPanel from '../../bookPanel/BookPanel'
import theme from '../../../theme'

import 'wax-prosemirror-core/dist/index.css'
import 'wax-prosemirror-services/dist/index.css'
import 'wax-table-service/dist/index.css'

const Wrapper = styled.div`
  background: ${th('colorBackground')};
  display: flex;
  flex-direction: column;
  font-family: ${th('fontInterface')};
  font-size: ${th('fontSizeBase')};
  height: 100%;
  overflow: hidden;
  width: 100%;
`

const Main = styled.div`
  display: flex;
  height: calc(100% - 48px);
  width: 100%;
`

const TopMenu = styled.div`
  align-items: center;
  background: ${th('colorBackgroundToolBar')};
  border-bottom: 1px solid lightgrey;
  display: flex;
  height: 48px;
  justify-content: center;
  user-select: none;

  [aria-controls='block-level-options'] {
    width: 100px;
  }

  #block-level-options {
    width: 110px;
  }

  &[data-loading='true'] [aria-controls='block-level-options'] {
    > span {
      opacity: 0;
    }
  }
`

const EditorArea = styled.div`
  background: #e8e8e8;
  border-bottom: 1px solid lightgrey;
  flex-grow: 1;
  height: 100%;
  padding: 4px 0 0;
  width: ${({ isFullscreen }) => (isFullscreen ? '100%' : '80%')};
`

const WaxSurfaceScroll = styled.div`
  box-sizing: border-box;
  display: flex;
  height: 100%;
  overflow-y: auto;
  position: relative;
  width: 100%;
`

const CommentsContainer = styled.div`
  display: flex;
  flex-basis: 200px;
  flex-direction: column;
  height: 100%;
  position: relative;
  width: 300px;

  > div {
    margin-inline-start: 1em;
  }

  textarea {
    border: 1px solid ${th('colorBorder')};
  }

  button {
    border-radius: 3px;
  }

  &:empty {
    display: none;
  }
`

const EditorContainer = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  margin: 0 auto;
  position: relative;
  width: 1016px;

  > div:first-child {
    width: 816px;
  }

  .ProseMirror {
    background: ${({ selectedChapterId }) =>
      selectedChapterId ? '#fff' : '#e8e8e8'};
    /* min-height: 100%; */
    min-height: calc(100vh - 104px);
    padding: ${grid(20)} ${grid(24)};
    width: 100%;

    table > caption {
      caption-side: top;
    }

    figcaption {
      width: 624px;
    }
  }
`

const StyledSpin = styled(Spin)`
  background-color: white;
  display: grid;
  height: 100vh;
  inset: 0;
  justify-content: center;
  padding-block-start: 20%;
  position: absolute;
  width: 816px;
`

const StyledBookPanel = styled(BookPanel)`
  border-right: ${th('borderWidth')} ${th('borderStyle')} ${th('colorBorder')};
  width: 32%;

  @media (min-width: 1200px) {
    flex: 0 0 49ch;
  }
`

const NoSelectedChapterWrapper = styled.div`
  display: grid;
  font-size: 16px;
  height: 80%;
  place-content: center;
`

const MainMenuToolBar = ComponentPlugin('mainMenuToolBar')
const RightArea = ComponentPlugin('rightArea')

const LuluLayout = ({ customProps, ...rest }) => {
  const { options } = useContext(WaxContext)

  let fullScreenStyles = {}

  if (options.fullScreen) {
    fullScreenStyles = {
      backgroundColor: '#fff',
      height: '100%',
      left: '0',
      margin: '0',
      padding: '0',
      position: 'fixed',
      top: '0',
      width: '100%',
      zIndex: '99999',
    }
  }

  const {
    chapters,
    onDeleteChapter,
    onChapterClick,
    onReorderChapter,
    onUploadChapter,
    onBookComponentTypeChange,
    onBookComponentParentIdChange,
    selectedChapterId,
    title,
    subtitle,
    onAddChapter,
    onSubmitBookMetadata,
    bookMetadataValues,
    chaptersActionInProgress,
    canEdit,
    metadataModalOpen,
    setMetadataModalOpen,
    editorLoading,
  } = customProps

  return (
    <ThemeProvider theme={theme}>
      <Wrapper id="wax-container" style={fullScreenStyles}>
        <TopMenu data-loading={editorLoading}>
          <MainMenuToolBar />
        </TopMenu>
        <Main>
          {!options.fullScreen && (
            <StyledBookPanel
              bookMetadataValues={bookMetadataValues}
              canEdit={canEdit}
              chapters={chapters}
              chaptersActionInProgress={chaptersActionInProgress}
              metadataModalOpen={metadataModalOpen}
              onAddChapter={onAddChapter}
              onBookComponentParentIdChange={onBookComponentParentIdChange}
              onBookComponentTypeChange={onBookComponentTypeChange}
              onChapterClick={onChapterClick}
              onDeleteChapter={onDeleteChapter}
              onReorderChapter={onReorderChapter}
              onSubmitBookMetadata={onSubmitBookMetadata}
              onUploadChapter={onUploadChapter}
              selectedChapterId={selectedChapterId}
              setMetadataModalOpen={setMetadataModalOpen}
              subtitle={subtitle}
              title={title}
            />
          )}

          <EditorArea isFullscreen={options.fullScreen}>
            <WaxSurfaceScroll
              id="wax-surface-scroll"
              style={{ position: 'relative' }}
            >
              <EditorContainer selectedChapterId={selectedChapterId}>
                {selectedChapterId ? (
                  <WaxView {...rest} />
                ) : (
                  <NoSelectedChapterWrapper>
                    Create or select a chapter in the chapters panel to start
                    writing
                  </NoSelectedChapterWrapper>
                )}
                <CommentsContainer>
                  <RightArea area="main" />
                </CommentsContainer>
                {editorLoading && <StyledSpin spinning={editorLoading} />}
              </EditorContainer>
            </WaxSurfaceScroll>
          </EditorArea>
        </Main>
      </Wrapper>
    </ThemeProvider>
  )
}

export default LuluLayout
