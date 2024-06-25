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
  id,
  page,
  bookSettings,
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
    id,
    page,
    bookSettings,
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

  selectedConfig.TitleService = {
    updateTitle: periodicTitleChanges,
  }

  selectedConfig.ImageService = { showAlt: true }

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
      id,
      page,
      bookSettings,
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
    page,
    bookSettings,
  ])

  if (!selectedConfig) return null

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
      value={bookComponentContent || ''}
    />
  )
}

export default EditorWrapper
