/* stylelint-disable string-quotes */
/* eslint-disable react/prop-types */
import React, { useContext } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { grid, th } from '@coko/client'
import { Spin } from 'antd'
import { WaxContext, ComponentPlugin, WaxView } from 'wax-prosemirror-core'

import Sidebar from '../../bookPanel/Sidebar'
import theme from '../../../theme'

import 'wax-prosemirror-core/dist/index.css'
import 'wax-prosemirror-services/dist/index.css'
import 'wax-table-service/dist/index.css'
import Settings from '../../settings/Settings'
import BookMetadataForm from '../../bookMetadata/BookMetadataForm'

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

  &:not([data-page='producer']) {
    flex-grow: 0;
    overflow: hidden;
    width: 1px;
  }
`

const WaxSurfaceScroll = styled.div`
  box-sizing: border-box;
  display: flex;
  height: 100%;
  overflow-y: auto;
  position: relative;
  width: 100%;
`

const EditorContainer = styled.div`
  height: 100%;
  margin: 0 auto;
  position: relative;
  width: 816px;

  & > div {
    width: 100%;
  }

  .ProseMirror {
    background: ${({ selectedChapterId }) =>
      selectedChapterId ? '#fff' : '#e8e8e8'};
    min-height: 100%;
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
  margin-inline: auto;
  padding-block-start: 20%;
  position: absolute;
  width: 816px;
`

const StyledMetadataForm = styled(BookMetadataForm)`
  margin-inline: auto;
`

const NoSelectedChapterWrapper = styled.div`
  display: grid;
  font-size: 16px;
  height: 80%;
  place-content: center;
`

const MainMenuToolBar = ComponentPlugin('mainMenuToolBar')

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
    id,
    page,
    bookSettings,
  } = customProps

  const renderSection = whichPage => {
    switch (whichPage) {
      // case 'producer':
      //   return (
      //     <EditorArea isFullscreen={options.fullScreen}>
      //       <WaxSurfaceScroll style={{ position: 'relative' }}>
      //         <EditorContainer selectedChapterId={selectedChapterId}>
      //           {selectedChapterId ? (
      //             editor
      //           ) : (
      //             <NoSelectedChapterWrapper>
      //               Create or select a chapter in the chapters panel to start
      //               writing
      //             </NoSelectedChapterWrapper>
      //           )}
      //         </EditorContainer>
      //         {editorLoading && <StyledSpin spinning={editorLoading} />}
      //       </WaxSurfaceScroll>
      //     </EditorArea>
      //   )
      // break;

      case 'settings':
        return <Settings bookId={id} bookSettings={bookSettings} />

      case 'metadata':
        return (
          <StyledMetadataForm
            canChangeMetadata={canEdit}
            initialValues={bookMetadataValues}
            onSubmitBookMetadata={onSubmitBookMetadata}
          />
        )

      default:
        return null
    }
  }

  // useEffect(() => {
  //   // if (page === 'producer') {
  //   //   // MainMenuToolBar = null
  //   //   console.log('load toolbar')
  //   //   MainMenuToolBar = ComponentPlugin('mainMenuToolBar')
  //   // } else {
  //   //   // MainMenuToolBar = null
  //   // }
  // }, [page])

  return (
    <ThemeProvider theme={theme}>
      <Wrapper id="wax-container" style={fullScreenStyles}>
        <TopMenu data-loading={editorLoading}>
          {page === 'producer' && <MainMenuToolBar />}
        </TopMenu>
        <Main>
          {/* {!options.fullScreen && (
            
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
              id={id}
            />
          )} */}
          {!options.fullScreen && (
            <Sidebar
              bookMetadataValues={bookMetadataValues}
              canEdit={canEdit}
              chapters={chapters}
              chaptersActionInProgress={chaptersActionInProgress}
              id={id}
              metadataModalOpen={metadataModalOpen}
              onAddChapter={onAddChapter}
              onBookComponentParentIdChange={onBookComponentParentIdChange}
              onBookComponentTypeChange={onBookComponentTypeChange}
              onChapterClick={onChapterClick}
              onDeleteChapter={onDeleteChapter}
              onReorderChapter={onReorderChapter}
              onSubmitBookMetadata={onSubmitBookMetadata}
              onUploadChapter={onUploadChapter}
              page={page}
              selectedChapterId={selectedChapterId}
              setMetadataModalOpen={setMetadataModalOpen}
              subtitle={subtitle}
              title={title}
            />
          )}
          {/* <section style={{ position: 'relative' }}> */}
          <EditorArea data-page={page} isFullscreen={options.fullScreen}>
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
              </EditorContainer>
              {editorLoading && <StyledSpin spinning={editorLoading} />}
            </WaxSurfaceScroll>
          </EditorArea>
          {renderSection(page)}
          {/* </section> */}
        </Main>
      </Wrapper>
    </ThemeProvider>
  )
}

export default LuluLayout
