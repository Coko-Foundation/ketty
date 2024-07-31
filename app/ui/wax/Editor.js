/* eslint-disable react/prop-types, react/jsx-no-constructed-context-values */
import React, { useEffect, useState } from 'react'
import { Wax } from 'wax-prosemirror-core'
import debounce from 'lodash/debounce'
import { LuluLayout } from './layout'
import defaultConfig from './config/config'
import configWithAi from './config/configWithAI'

const EditorWrapper = ({
  title,
  subtitle,
  chapters,
  onPeriodicBookComponentContentChange,
  isReadOnly,
  onImageUpload,
  onBookComponentTitleChange,
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
  aiEnabled,
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
  })

  const selectedConfig = aiEnabled ? configWithAi : defaultConfig

  const periodicTitleChanges = debounce(changedTitle => {
    if (!isReadOnly) {
      onBookComponentTitleChange(changedTitle)
    }
  }, 50)

  useEffect(() => {
    return () => {
      onPeriodicBookComponentContentChange.cancel()
      periodicTitleChanges.cancel()
    }
  }, [])

  if (aiEnabled) {
    selectedConfig.AskAiContentService = {
      AskAiContentTransformation: queryAI,
      AiOn: aiOn,
      FreeTextPromptsOn: freeTextPromptsOn,
      CustomPromptsOn: customPromptsOn,
      CustomPrompts: customPromptsOn ? customPrompts : [],
      ...(kbOn ? { AskKb: true } : {}),
    }
  }

  if (canInteractWithComments === false) {
    const commentsServiceIndex = selectedConfig.services.findIndex(service =>
      Object.prototype.hasOwnProperty.call(service, 'allCommentsFromStates'),
    )

    if (commentsServiceIndex !== -1) {
      selectedConfig.services.splice(commentsServiceIndex, 1)
    }
  }

  selectedConfig.TitleService = {
    updateTitle: periodicTitleChanges,
  }

  selectedConfig.CommentsService = {
    getComments: addComments,
    setComments: () => {
      return savedComments || []
    },
    userList: bookMembers,
    getMentionedUsers: onMention,
  }

  useEffect(() => {
    if (aiEnabled) {
      selectedConfig.AskAiContentService = {
        ...selectedConfig.AskAiContentService,
        AiOn: aiOn,
      }
      selectedConfig.editorKey = editorKey
    }
  }, [aiOn, editorKey])

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
  ])

  const userObject = {
    userId: user.id,
    userColor: {
      addition: 'royalblue',
      deletion: 'indianred',
    },
    username: user.displayName,
  }

  if (!selectedConfig || canInteractWithComments === null) return null

  return (
    <Wax
      autoFocus
      config={selectedConfig}
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
