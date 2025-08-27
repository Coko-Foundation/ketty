/* stylelint-disable no-descending-specificity */
import React, { useContext, useEffect, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import styled, { ThemeProvider, css } from 'styled-components'
import { grid, th } from '@coko/client'
// import { Spin } from 'antd'
import PanelGroup from 'react-panelgroup'
import {
  ToTopOutlined,
  CaretUpFilled,
  CaretDownFilled,
  VerticalAlignBottomOutlined,
} from '@ant-design/icons'
import {
  ApplicationContext,
  WaxContext,
  ComponentPlugin,
  WaxView,
  DocumentHelpers,
} from 'wax-prosemirror-core'
import { useTranslation } from 'react-i18next'
import { usePrevious } from '../../../utils'
import { Button, Checkbox, Result, Select, Spin } from '../../common'
import BookPanel from '../../bookPanel/BookPanel'
import {
  BookInformation,
  BookMetadataForm,
  SettingsForm,
  UserInviteModal,
  PSModal,
} from '../../bookInformation'
import theme from '../../../theme'

import YjsContext from '../../provider-yjs/YjsProvider'
import FileUpload from '../../fileUpload/FileUpload'

import 'wax-prosemirror-core/dist/index.css'
import 'wax-prosemirror-services/dist/index.css'
import 'wax-table-service/dist/index.css'

// #region styled
const Wrapper = styled.div`
  --top-menu-base: clamp(3rem, 4.3478rem + -1.7391vw, 4rem);
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
  flex: 1 1 calc(100% - var(--top-menu-base));
  overflow: hidden;
  position: relative;
  width: 100%;

  > :nth-child(2) {
    overflow: auto;
    width: 100%;
  }
`

const InfoWrapper = styled.div`
  background: white;
  inset-inline: 0;
  min-block-size: 100%;
  position: absolute;
  z-index: 2;
`

const SpinnerWrapper = styled.div`
  display: ${({ showSpinner }) => (showSpinner ? 'block' : 'none')};
  left: 42%;
  margin-top: -25px;
  position: absolute;
  top: 50%;
  z-index: 999;
`

const StyledMetadataForm = styled(BookMetadataForm)`
  padding-inline-start: calc(50px + var(--s1));

  @media (min-width: 600px) {
    padding-inline-start: var(--s1);
  }
`

const TopMenu = styled.div`
  align-items: center;
  background-color: ${th('colorBackground')};
  border-bottom: 1px solid lightgrey;
  display: flex;
  flex: 1 0 var(--top-menu-base);
  flex-flow: nowrap;
  gap: ${grid(1)};
  justify-content: center;

  ${({ isHidden }) =>
    isHidden &&
    css`
      > * {
        opacity: 0;
        visibility: hidden;
      }
    `};

  padding: ${grid(2)} ${grid(4)};
  user-select: none;

  &.scrollable {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    row-gap: ${grid(2)};

    > div:has(#questions-list) {
      grid-column: span 2;

      [aria-controls='questions-list'] {
        width: 150px;
      }

      #questions-list {
        margin-left: 40px;
        width: 211px;
      }
    }
  }

  &.scrollable[data-expanded='false'] {
    flex: unset;
    height: 48px;
    overflow: hidden;
  }

  > div {
    display: contents;
    justify-content: center;

    &:has(button[title='Undo']) {
      display: inline-flex;
    }

    > div {
      text-align: center;
    }

    &:has(#block-level-options),
    &:has(#questions-list) {
      display: flex;
    }
  }

  [aria-controls='block-level-options'] {
    background-color: transparent;
    width: 90px;
  }

  [aria-controls='questions-list'] {
    padding-inline: 1ch;

    span,
    svg {
      top: 0;
    }
  }

  #block-level-options {
    width: 100px;
    z-index: 1001;
  }

  #questions-list {
    margin: 32px auto auto;
    z-index: 1001;
  }

  > div > div:has(#custom-block-level-options) button[aria-haspopup='true'] {
    width: 120px;
  }

  .Dropdown-root {
    display: contents;
  }

  .Dropdown-control {
    align-items: center;
    display: flex;
    justify-content: space-between;
    padding: 8px;
    white-space: nowrap;
    width: 120px;

    .Dropdown-arrow {
      position: unset;
    }
  }

  .Dropdown-menu {
    top: unset;
    width: 120px;
    z-index: 1001;
  }

  [aria-controls='table-options'] {
    width: 120px;
  }

  #table-options {
    span {
      text-align: start;
    }
  }

  &[data-loading='true'] [aria-controls='block-level-options'] {
    > span {
      opacity: 0;
    }
  }

  #collapse {
    align-items: center;
    border: none;
    box-shadow: none;
    display: none;
    flex-direction: row-reverse;
    justify-content: center;

    > .ant-btn-icon {
      margin-inline: ${grid(2)} 0;
    }
  }

  &.scrollable #collapse {
    display: flex;
  }
`

const CollapseContainer = styled.div`
  background-color: transparent;
  display: flex;
  inset-inline-end: ${grid(3)};
  justify-content: center;
  padding-block-start: 9px;
  position: absolute;
  z-index: 9;

  &[data-collapsed='true'] {
    align-items: start;
    background-color: white;
    height: unset;
    inset: 0;

    button {
      transform: rotate(90deg);
    }
  }

  button {
    block-size: 34px;
    inline-size: 34px;
    transform: rotate(-90deg);
    transition: transform 0.3s ease-out;
  }

  @media (min-width: 800px) {
    display: none;
  }
`

const PSButton = styled(Button)`
  background-color: #13110c;
  block-size: 32px;
  font-size: 22px;
  gap: 0;
  padding: 0;
  width: 34px;

  &:hover,
  &:active,
  &:focus-visible {
    /* stylelint-disable-next-line declaration-no-important */
    background-color: #13110c !important;
    border: 0;
    color: unset;
    outline: none;
  }

  > span {
    padding-bottom: 4px;

    &:nth-child(1) {
      color: white;
    }

    &:nth-child(2) {
      color: #1487fe;
    }
  }
`

const EditorArea = styled.div`
  background: #e8e8e8;
  border-bottom: 1px solid lightgrey;
  flex-grow: 1;
  height: 100%;
  padding: 4px 0 0;
  position: relative;
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
  flex: 1 0 calc(205px + 1em);
  flex-direction: column;
  height: 100%;
  position: relative;
  width: calc(205px + 1em);

  @media (max-width: 1400px) {
    position: absolute;
    right: ${grid(1)};
  }

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

const NotesAreaContainer = styled.div`
  background: #fff;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: scroll;
  position: absolute;
  width: 100%;
  /* PM styles  for note content */
  .ProseMirror {
    display: inline;
  }

  @media (max-width: 600px) {
    padding-inline-start: ${grid(12)};
  }

  &:has(button[data-collapsed='true']) {
    overflow-y: hidden;
  }
`

const NotesTopBar = styled.div`
  display: flex;
  padding-block: ${grid(2)};

  button {
    border: none;
    margin-inline: auto ${grid(2)};
    transition: transform 0.1s ease;

    &[data-collapsed='true'] {
      transform: rotate(180deg);
    }
  }
`

const NotesContainer = styled.div`
  counter-reset: footnote-view;
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: auto;
  max-width: 816px;
  padding-bottom: ${grid(4)};
  padding-left: ${grid(10)};
  padding-top: 10px;
  width: 100%;
`

const CommentsContainerNotes = styled.div``

const TrackToolsContainer = styled.div`
  border: 1px solid ${th('colorBorder')};
  display: grid;
  grid-auto-rows: 30px;
  grid-template-columns: 1fr;
  margin-inline-start: 0;
  position: fixed;
  right: clamp(0rem, -0.2174rem + 1.087vw, 0.625rem);
  z-index: 1;
`

const ToggleComments = styled.div`
  align-items: center;
  background-color: ${th('colorBackground')};
  border-bottom: 1px solid ${th('colorBorder')};
  display: inline-flex;
  padding-inline: ${grid(2)};

  > label {
    flex-direction: row-reverse;

    .ant-checkbox {
      margin-inline: 6px;
    }
  }

  @media (min-width: 1400px) {
    display: none;
  }
`

const TrackTools = styled.div`
  align-items: center;
  background-color: ${th('colorBackground')};
  display: flex;
  justify-content: end;
  padding-inline: ${grid(2)};
  position: relative;
  z-index: 1;
`

const TrackOptions = styled.div`
  display: flex;
  margin-left: 10px;
  position: relative;

  > div > button ~ div {
    right: ${grid(-2)};
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
    max-width: 816px;
    width: 100%;
  }

  .ProseMirror {
    --padding-inline: clamp(1.25rem, -0.4022rem + 8.2609vw, 6rem);
    background: ${({ selectedChapterId }) =>
      selectedChapterId ? '#fff' : '#e8e8e8'};
    min-height: calc(100vh - 104px);
    padding: ${grid(20)} var(--padding-inline) ${grid(20)}
      calc(50px + var(--padding-inline));
    width: calc(100% - 20px);

    @media (min-width: 600px) {
      padding: ${grid(20)} var(--padding-inline);
    }

    table > caption {
      caption-side: top;
    }

    .ProseMirror {
      min-height: unset;
      padding: unset;
    }

    .multiple-choice,
    .true-false,
    .true-false-single-correct,
    .multiple-choice-single-correct,
    .essay {
      border: 2px solid rgb(245 245 247);
    }

    .essay {
      > div:first-child {
        min-block-size: 10em;

        .ProseMirror {
          padding: 1ch;
        }
      }

      > div:nth-child(2) {
        min-block-size: 10em;
        padding: 1ch;
      }
    }

    [aria-controls='numerical-answer-list'] {
      min-inline-size: 235px;
      width: unset;
    }
  }
`

const LeftPanelWrapper = styled.div`
  background-color: ${th('colorBackground')};
  border-right: ${th('borderWidth')} ${th('borderStyle')} ${th('colorBorder')};
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  padding-inline: ${grid(3)};
  position: absolute;
  transition: flex-basis 0.4s, width 0.4s;
  width: 320px;
  z-index: 1000; // hate it but it's the wax cursor's fault!

  &:has([data-collapsed='true']) {
    flex: 0 0 50px;
    width: 50px;
  }

  @media (min-width: 600px) {
    flex: 0 0 320px;
    position: relative;
    width: unset;
  }

  @media (min-width: 800px) {
    &:has([data-collapsed]) {
      flex: 0 0 34%;
    }
  }

  @media (min-width: 1100px) {
    &:has([data-collapsed]) {
      flex: 0 0 380px;
    }
  }
`

const StyledSettingsForm = styled(SettingsForm)`
  padding-inline-start: calc(50px + var(--s1));

  @media (min-width: 600px) {
    padding-inline-start: var(--s1);
  }
`

const NoSelectedChapterWrapper = styled.div`
  display: grid;
  font-size: 16px;
  height: 80%;
  place-content: center;
`

const LanguageSelect = styled(Select)`
  width: 10ch;
`
// #endregion styled

const MainMenuToolBar = ComponentPlugin('mainMenuToolBar')
const RightArea = ComponentPlugin('rightArea')
const CommentTrackToolBar = ComponentPlugin('commentTrackToolBar')
const NotesArea = ComponentPlugin('notesArea')

let surfaceHeight = (window.innerHeight / 5) * 3
let notesHeight = (window.innerHeight / 5) * 2

const onResizeEnd = arr => {
  surfaceHeight = arr[0].size
  notesHeight = arr[1].size
}

const getNotes = main => {
  const notes = DocumentHelpers.findChildrenByType(
    main.state.doc,
    main.state.schema.nodes.footnote,
    true,
  )

  return notes
}

const LuluLayout = ({ customProps, ...rest }) => {
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
    onUploadBookCover,
    viewMetadata,
    setViewMetadata,
    settings,
    getBookSettings,
    bookId,
    aiEnabled,
    updateBookSettings,
    updateLoading,
    savedComments,
    pureScienceConfig,
    onRunWorkflow,
    languages,
    currentLanguage,
    onLanguageChange,
    deleteFromFileManager,
    getUserFileManager,
    loaded,
    setUserFileManagerFiles,
    handleCloseFileUpload,
    updateFileInManager,
    uploadToFileManager,
    userFileManagerFiles,
    updateFile,
  } = customProps

  // const [lastSelectedChapter, setLastSelectedChapter] = useState(null)
  const [bookPanelCollapsed, setBookPanelCollapsed] = useState(true)
  const [mobileToolbarCollapsed, setMobileToolbarCollapsed] = useState(true)
  const [showComments, setShowComments] = useState(true)
  const [showPsModal, setShowPsModal] = useState(false)
  const previousComments = usePrevious(savedComments)
  const { showSpinner } = useContext(YjsContext)
  const { t } = useTranslation(null, { keyPrefix: 'pages.producer' })

  const context = useContext(WaxContext)

  const {
    options,
    pmViews: { main },
  } = context

  const { app } = useContext(ApplicationContext)
  const waxMenuConfig = app.config.get('config.MenuService')
  let fullScreenStyles = {}

  const menuContainsTrackTools = !!waxMenuConfig[0].toolGroups.find(
    menu => menu === 'TrackingAndEditing',
  )

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

  const commentsTracksCount =
    main && DocumentHelpers.getCommentsTracksCount(main)

  const trackBlockNodesCount =
    main && DocumentHelpers.getTrackBlockNodesCount(main)

  const showTrackControls =
    menuContainsTrackTools || commentsTracksCount + trackBlockNodesCount > 0

  const notes = main && getNotes(main)
  const areNotes = notes && !!notes.length && notes.length > 0

  const [hasNotes, setHasNotes] = useState(areNotes)

  const showNotes = () => {
    setHasNotes(areNotes)
  }

  useCallback(
    setTimeout(() => showNotes(), 100),
    [],
  )

  useEffect(() => {
    // Re-check on window resize
    window.addEventListener('resize', checkOverflow)
    return () => window.removeEventListener('resize', checkOverflow)
  }, [])

  useEffect(() => {
    const backToEditor = e => {
      if (e.key === 'Escape') {
        toggleMetadata(viewMetadata)
      }
    }

    window.addEventListener('keydown', backToEditor)
    return () => window.removeEventListener('keydown', backToEditor)
  }, [viewMetadata])

  // useEffect(() => {
  //   if (editorLoading) {
  //     document.getElementById('toolbar').classList.remove('scrollable')
  //   } else {
  //     setTimeout(() => {
  //       checkOverflow()
  //     }, 1)
  //   }
  // }, [editorLoading])

  useEffect(() => {
    // make comments visible when adding a new comment and they are hidden
    if (previousComments?.length < savedComments?.length) {
      setShowComments(true)
    }
  }, [savedComments])

  const toggleMetadata = which => {
    if (viewMetadata !== which) {
      setViewMetadata(which)

      // if (selectedChapterId) {
      //   onChapterClick(selectedChapterId)
      //   setLastSelectedChapter(selectedChapterId)
      // }
    } else {
      // if (lastSelectedChapter) {
      //   setLastSelectedChapter(selectedChapterId)
      //   onChapterClick(lastSelectedChapter)
      // }

      setViewMetadata('')
    }

    if (window.innerWidth < 600) {
      setBookPanelCollapsed(true)
    }
  }

  const handleChapterClick = chapterId => {
    if (viewMetadata !== '') setViewMetadata('')
    onChapterClick(chapterId)

    if (window.innerWidth < 600 && !bookPanelCollapsed) {
      setBookPanelCollapsed(true)
    }
  }

  const checkOverflow = () => {
    const toolbar = document.getElementById('toolbar')
    toolbar?.classList.remove('scrollable')

    // Check if the content overflows the container
    if (toolbar?.scrollWidth > toolbar?.clientWidth) {
      toolbar?.classList.add('scrollable') // Add class to align items to the start
    } else {
      toolbar?.classList.remove('scrollable') // Remove class to center items
    }

    if (window.innerWidth > 1400) {
      if (
        document.getElementById('commentToggle')?.classList.contains('hidden')
      ) {
        setShowComments(true)
        document.getElementById('commentToggle')?.classList.remove('hidden')
      }
    } else {
      document.getElementById('commentToggle')?.classList.add('hidden')
    }
  }

  const [panelWidths, setPanelWidth] = useState([
    { size: surfaceHeight, resize: 'stretch' },
    { size: notesHeight, resize: 'resize' },
  ])

  const [notesCollapsed, setNotesCollapsed] = useState(false)

  useEffect(() => {
    if (notesCollapsed) {
      setPanelWidth([
        { size: surfaceHeight, resize: 'stretch' },
        { size: '40px', resize: 'fixed' },
      ])
    } else {
      notesHeight = (window.innerHeight / 5) * 2

      setPanelWidth([
        { size: surfaceHeight, resize: 'stretch' },
        { size: notesHeight, resize: 'resize' },
      ])
    }
  }, [notesCollapsed])

  const collapseNotes = () => {
    setNotesCollapsed(!notesCollapsed)
  }

  const renderInformationBox = () => {
    switch (viewMetadata) {
      case 'metadata':
        return (
          <StyledMetadataForm
            canChangeMetadata={canEdit}
            initialValues={bookMetadataValues}
            onSubmitBookMetadata={onSubmitBookMetadata}
            onUploadBookCover={onUploadBookCover}
          />
        )
      case 'settings':
        return (
          <StyledSettingsForm
            aiEnabled={aiEnabled}
            bookId={bookId}
            bookSettings={settings}
            refetchBookSettings={getBookSettings}
            updateBookSettings={updateBookSettings}
            updateLoading={updateLoading}
          />
        )

      case 'members':
        return <UserInviteModal bookId={bookId} />

      default:
        return null
    }
  }

  const handleTogglePSWorkflows = () => {
    setShowPsModal(true)
  }

  return (
    <ThemeProvider theme={theme}>
      <Wrapper id="wax-container" style={fullScreenStyles}>
        <TopMenu
          data-expanded={!mobileToolbarCollapsed}
          id="toolbar"
          isHidden={viewMetadata}
        >
          <Button
            icon={
              mobileToolbarCollapsed ? <CaretDownFilled /> : <CaretUpFilled />
            }
            id="collapse"
            onClick={() => setMobileToolbarCollapsed(!mobileToolbarCollapsed)}
          >
            {mobileToolbarCollapsed ? 'Expand' : 'Collapse'}
          </Button>
          <MainMenuToolBar />
          {pureScienceConfig &&
            pureScienceConfig.url &&
            pureScienceConfig.workflows?.length && (
              <PSButton onClick={handleTogglePSWorkflows}>
                <span>p.</span>
                <span>s</span>
              </PSButton>
            )}
        </TopMenu>
        <Main>
          {!options.fullScreen && (
            <LeftPanelWrapper>
              <CollapseContainer data-collapsed={bookPanelCollapsed}>
                <Button
                  aria-label="Collapse"
                  icon={<ToTopOutlined />}
                  onClick={() => setBookPanelCollapsed(!bookPanelCollapsed)}
                  type="text"
                />
              </CollapseContainer>
              <BookInformation
                bookId={bookId}
                onTogglePSWorkflows={handleTogglePSWorkflows}
                pureScienceConfig={pureScienceConfig}
                showAiAssistantLink={aiEnabled && settings?.aiPdfDesignerOn}
                showKnowledgeBaseLink={aiEnabled && settings?.knowledgeBaseOn}
                toggleInformation={toggleMetadata}
                viewInformation={viewMetadata}
              />

              <BookPanel
                bookMetadataValues={bookMetadataValues}
                canEdit={canEdit}
                chapters={chapters}
                chaptersActionInProgress={chaptersActionInProgress}
                metadataModalOpen={metadataModalOpen}
                onAddChapter={onAddChapter}
                onBookComponentParentIdChange={onBookComponentParentIdChange}
                onBookComponentTypeChange={onBookComponentTypeChange}
                onChapterClick={handleChapterClick}
                onDeleteChapter={onDeleteChapter}
                onReorderChapter={onReorderChapter}
                onSubmitBookMetadata={onSubmitBookMetadata}
                onUploadChapter={onUploadChapter}
                selectedChapterId={selectedChapterId}
                setMetadataModalOpen={setMetadataModalOpen}
                setViewMetadata={setViewMetadata}
                subtitle={subtitle}
                title={title}
                viewMetadata={viewMetadata}
              />
            </LeftPanelWrapper>
          )}
          <EditorArea isFullscreen={options.fullScreen}>
            {viewMetadata && (
              <InfoWrapper>{renderInformationBox()}</InfoWrapper>
            )}
            <PanelGroup
              direction="column"
              onResizeEnd={onResizeEnd}
              panelWidths={panelWidths}
            >
              <WaxSurfaceScroll id="wax-surface-scroll">
                <EditorContainer selectedChapterId={selectedChapterId}>
                  {selectedChapterId ? (
                    <WaxView {...rest} />
                  ) : (
                    <NoSelectedChapterWrapper>
                      {t('editor.noChapterSelected')}
                    </NoSelectedChapterWrapper>
                  )}
                  <TrackToolsContainer>
                    {savedComments.length > 0 && (
                      <ToggleComments id="commentToggle">
                        <Checkbox
                          checked={showComments}
                          onChange={e => setShowComments(e.target.checked)}
                        >
                          SHOW COMMENTS
                        </Checkbox>
                      </ToggleComments>
                    )}
                    {languages.length > 1 && (
                      <LanguageSelect
                        onChange={onLanguageChange}
                        options={languages.map(l => ({
                          value: l,
                          label: l,
                        }))}
                        value={currentLanguage}
                      />
                    )}
                    {showTrackControls && (
                      <TrackTools>
                        {commentsTracksCount + trackBlockNodesCount} SUGGESTIONS
                        <TrackOptions>
                          <CommentTrackToolBar />
                        </TrackOptions>
                      </TrackTools>
                    )}
                  </TrackToolsContainer>
                  {showComments && (
                    <CommentsContainer>
                      <RightArea area="main" />
                    </CommentsContainer>
                  )}
                </EditorContainer>
              </WaxSurfaceScroll>
              {hasNotes && (
                <NotesAreaContainer>
                  <NotesTopBar>
                    <Button
                      data-collapsed={notesCollapsed}
                      icon={<VerticalAlignBottomOutlined />}
                      onClick={collapseNotes}
                    />
                  </NotesTopBar>
                  <div style={{ display: 'flex', 'flex-direction': 'row' }}>
                    <NotesContainer id="notes-container">
                      <NotesArea view={main} />
                    </NotesContainer>
                    <CommentsContainerNotes>
                      <RightArea area="notes" />
                    </CommentsContainerNotes>
                  </div>
                </NotesAreaContainer>
              )}
            </PanelGroup>
          </EditorArea>
        </Main>
        <SpinnerWrapper showSpinner={showSpinner}>
          <Result
            icon={<Spin size={18} spinning />}
            title="Loading your document"
          />
        </SpinnerWrapper>
        <FileUpload
          deleteFromFileManager={deleteFromFileManager}
          getUserFileManager={getUserFileManager}
          onClose={handleCloseFileUpload}
          open={loaded}
          setUserFileManagerFiles={setUserFileManagerFiles}
          updateFile={updateFile}
          updateFileInManager={updateFileInManager}
          uploadToFileManager={uploadToFileManager}
          userFileManagerFiles={userFileManagerFiles}
          waxApplication={app}
          waxContext={context}
        />
      </Wrapper>
      <PSModal
        closeModal={() => setShowPsModal(false)}
        onRunWorkflow={onRunWorkflow}
        open={showPsModal}
        pureScienceConfig={pureScienceConfig}
      />
    </ThemeProvider>
  )
}

LuluLayout.propTypes = {
  customProps: PropTypes.shape().isRequired,
}

export default LuluLayout
