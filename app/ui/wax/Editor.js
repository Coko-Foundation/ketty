/* eslint-disable react/prop-types, react/jsx-no-constructed-context-values */
import React, { useEffect, useState } from 'react'
import { Wax } from 'wax-prosemirror-core'
import { LuluLayout } from './layout'
import configWithAi from './config/configWithAI'

const EditorWrapper = ({
  title,
  subtitle,
  chapters,
  onPeriodicBookComponentContentChange,
  onPeriodicTitleChange,
  isReadOnly,
  onImageUpload,
  onBookComponentTypeChange,
  onBookComponentParentIdChange,
  onAddChapter,
  onChapterClick,
  bookComponentContent,
  metadataModalOpen,
  setMetadataModalOpen,
  onDeleteChapter,
  queryAI,
  chaptersActionInProgress,
  onReorderChapter,
  onUploadChapter,
  onSubmitBookMetadata,
  bookMetadataValues,
  selectedChapterId,
  canEdit,
  configurableEditorTools,
  aiOn,
  editorRef,
  freeTextPromptsOn,
  customPrompts,
  customPromptsOn,
  editorLoading,
  kbOn,
  editorKey,
  canInteractWithComments,
  comments: savedComments,
  addComments,
  user,
  bookMembers,
  onMention,
  onUploadBookCover,
  viewMetadata,
  setViewMetadata,
}) => {
  const [luluWax, setLuluWax] = useState({
    onAddChapter,
    onChapterClick,
    onDeleteChapter,
    onReorderChapter,
    onBookComponentTypeChange,
    onBookComponentParentIdChange,
    chapters,
    selectedChapterId,
    onUploadChapter,
    canEdit,
    chaptersActionInProgress,
    title,
    subtitle,
    onSubmitBookMetadata,
    bookMetadataValues,
    metadataModalOpen,
    setMetadataModalOpen,
    editorLoading,
    savedComments,
    onUploadBookCover,
    viewMetadata,
    setViewMetadata,
  })

  const [selectedWaxConfig, setSelectedWaxConfig] = useState(configWithAi)

  const waxMenuConfig = configurableEditorTools?.length
    ? JSON.parse(configurableEditorTools)
    : configWithAi.MenuService[0].toolGroups

  useEffect(() => {
    return () => {
      onPeriodicBookComponentContentChange.cancel()
      onPeriodicTitleChange.cancel()
    }
  }, [])

  // Used For Editor's reconfiguration
  useEffect(() => {
    setSelectedWaxConfig({
      ...selectedWaxConfig,
      editorKey,
      MenuService: configWithAi.MenuService.map(service => ({
        ...service,
        toolGroups: waxMenuConfig,
      })),
      AskAiContentService: {
        AskAiContentTransformation: queryAI,
        FreeTextPromptsOn: freeTextPromptsOn,
        CustomPromptsOn: customPromptsOn,
        CustomPrompts: customPromptsOn ? customPrompts : [],
        AiOn: aiOn,
        ...(kbOn ? { AskKb: true } : {}),
      },
      TitleService: {
        updateTitle: onPeriodicTitleChange,
      },
      CommentsService: {
        readOnly: !canInteractWithComments,
        getComments: addComments,
        setComments: () => {
          return savedComments || []
        },
        userList: bookMembers,
        getMentionedUsers: onMention,
      },
    })
  }, [aiOn, editorKey, configurableEditorTools])

  useEffect(() => {
    setLuluWax({
      title,
      subtitle,
      chapters,
      selectedChapterId,
      chaptersActionInProgress,
      onAddChapter,
      onChapterClick,
      onDeleteChapter,
      onReorderChapter,
      onUploadChapter,
      onSubmitBookMetadata,
      bookMetadataValues,
      canEdit,
      metadataModalOpen,
      setMetadataModalOpen,
      onBookComponentTypeChange,
      onBookComponentParentIdChange,
      editorLoading,
      editorKey,
      savedComments,
      onUploadBookCover,
      viewMetadata,
      setViewMetadata,
    })
  }, [
    title,
    subtitle,
    chapters,
    selectedChapterId,
    bookMetadataValues,
    chaptersActionInProgress,
    canEdit,
    metadataModalOpen,
    editorLoading,
    editorKey,
    savedComments,
    viewMetadata,
  ])

  const userObject = {
    userId: user.id,
    userColor: {
      addition: 'royalblue',
      deletion: 'indianred',
    },
    username: user.displayName,
  }

  if (!selectedWaxConfig || canInteractWithComments === null) return null

  return (
    <Wax
      autoFocus
      config={selectedWaxConfig}
      customProps={luluWax}
      fileUpload={onImageUpload}
      layout={LuluLayout}
      onChange={onPeriodicBookComponentContentChange}
      readonly={isReadOnly}
      ref={editorRef}
      user={userObject}
      value={bookComponentContent || ''}
    />
  )
}

EditorWrapper.defaultProps = {
  comments: [],
  bookMembers: [],
  canInteractWithComments: null,
  onMention: null,
}

export default EditorWrapper
