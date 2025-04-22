/* eslint-disable react/prop-types, react/jsx-no-constructed-context-values */
import React, { useEffect, useState } from 'react'
import { Wax } from 'wax-prosemirror-core'
import { LuluLayout } from './layout'
import configWithAi from './config/configWithAI'

const EditorWrapper = ({
  bookId,
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
  aiEnabled,
  chaptersActionInProgress,
  onReorderChapter,
  onUploadChapter,
  onSubmitBookMetadata,
  bookMetadataValues,
  selectedChapterId,
  canEdit,
  customTags,
  configurableEditorOn,
  configurableEditorConfig,
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
  settings,
  getBookSettings,
  updateBookSettings,
  updateLoading,
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
    settings,
    getBookSettings,
    bookId,
    aiEnabled,
    updateBookSettings,
    updateLoading,
  })

  const [selectedWaxConfig, setSelectedWaxConfig] = useState(configWithAi)

  const [waxCustomTags, setWaxCustomTags] = useState([])

  const waxMenuConfig =
    configurableEditorOn && configurableEditorConfig?.length
      ? JSON.parse(configurableEditorConfig)
      : configWithAi

  useEffect(() => {
    return () => {
      onPeriodicBookComponentContentChange.cancel()
      onPeriodicTitleChange.cancel()
    }
  }, [])

  // Used For Editor's reconfiguration
  useEffect(() => {
    setWaxCustomTags(customTags?.length > 0 ? JSON.parse(customTags) : [])

    setSelectedWaxConfig({
      ...selectedWaxConfig,
      editorKey,
      MenuService: selectedWaxConfig.MenuService.map(service => {
        // Find the matching service in waxMenuConfig based on templateArea
        const matchingConfig = waxMenuConfig.MenuService.find(
          config => config?.templateArea === service.templateArea,
        )

        return {
          ...service,
          toolGroups: matchingConfig
            ? matchingConfig.toolGroups
            : service.toolGroups,
        }
      }),
      AskAiContentService: {
        AskAiContentTransformation: queryAI,
        FreeTextPromptsOn: freeTextPromptsOn,
        CustomPromptsOn: customPromptsOn,
        CustomPrompts: customPromptsOn ? customPrompts : [],
        AiOn: aiEnabled && aiOn,
        ...(kbOn ? { AskKb: true } : {}),
      },
      TitleService: {
        updateTitle: onPeriodicTitleChange,
      },
      CommentsService: {
        // readOnly: !canInteractWithComments,
        readOnlyPost: false,
        readOnlyResolve: !canInteractWithComments,
        getComments: addComments,
        setComments: () => {
          return savedComments || []
        },
        userList: bookMembers,
        getMentionedUsers: onMention,
      },
      CustomTagService: {
        tags: waxCustomTags,
        updateTags: () => true,
      },
    })
  }, [
    aiOn,
    editorKey,
    JSON.stringify(configurableEditorConfig),
    JSON.stringify(waxCustomTags),
  ])

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
      getBookSettings,
      settings,
      bookId,
      aiEnabled,
      updateBookSettings,
      updateLoading,
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
    settings,
    bookId,
    aiEnabled,
    updateLoading,
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
