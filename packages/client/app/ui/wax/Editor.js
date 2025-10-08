/* eslint-disable react/prop-types, react/jsx-no-constructed-context-values */
import React, { useEffect, useState, useMemo, useRef, useContext } from 'react'
import { Wax } from 'wax-prosemirror-core'
import { isEqual } from 'lodash'
import YjsContext from '../provider-yjs/YjsProvider'
import { LuluLayout } from './layout'
import configWithAi from './config/configWithAI'
import YjsService from './config/YjsService'

const EditorWrapper = ({
  bookId,
  title,
  subtitle,
  chapters,
  bookComponentContent,
  onPeriodicBookComponentContentChange,
  onPeriodicTitleChange,
  isReadOnly,
  onImageUpload,
  onBookComponentTypeChange,
  onBookComponentParentIdChange,
  onAddChapter,
  onChapterClick,
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
  kbOn,
  canInteractWithComments,
  comments: savedComments,
  // addComments,
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
  pureScienceConfig,
  onRunWorkflow,
  languages,
  currentLanguage,
  onLanguageChange,
  // wsProvider,
  // ydoc,
  getObjectFileManager,
  uploadToFileManager,
  deleteFromFileManager,
  updateComponentIdInManager,
  updateFile,
  isUploading,
  setUploading,
  setIsCurrentDocumentMine,
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
    pureScienceConfig,
    onRunWorkflow,
    languages,
    currentLanguage,
    onLanguageChange,
    setIsCurrentDocumentMine,
  })

  const { wsProvider, ydoc } = useContext(YjsContext)

  const [loaded, setLoaded] = useState(false)
  const [userFileManagerFiles, setUserFileManagerFiles] = useState([])
  const [selectedWaxConfig, setSelectedWaxConfig] = useState(configWithAi)

  const waxMenuConfig =
    configurableEditorOn && configurableEditorConfig?.length
      ? JSON.parse(configurableEditorConfig)
      : configWithAi

  const tags = customTags?.length > 0 ? JSON.parse(customTags) : []

  const onAssetManager = async () => {
    setLoaded(true)
    const userFiles = await getObjectFileManager()
    setUserFileManagerFiles(JSON.parse(userFiles.data.getObjectFileManager))
    return userFiles
  }

  const handleCloseFileUpload = () => {
    setLoaded(false)
  }

  const handleAddedRemovedImages = async images => {
    const addedImages = (images?.added || []).map(node => node.attrs.fileid)
    const removedImages = (images?.removed || []).map(node => node.attrs.fileid)

    await updateComponentIdInManager({
      variables: {
        bookComponentId: selectedChapterId,
        input: {
          added: addedImages,
          removed: removedImages,
        },
      },
    })
  }

  useEffect(() => {
    return () => {
      onPeriodicBookComponentContentChange.cancel()
      onPeriodicTitleChange.cancel()
    }
  }, [])

  const previousRefEditorConfig = useRef(configurableEditorConfig)
  const previousRefEditorTags = useRef(tags)
  const memoizedProvider = useMemo(() => wsProvider)

  // Used For Editor's reconfiguration
  useEffect(() => {
    if (!isEqual(previousRefEditorTags.current, tags)) {
      previousRefEditorTags.current = tags
      setSelectedWaxConfig({
        ...selectedWaxConfig,
        CustomTagService: {
          tags,
          updateTags: () => true,
        },
      })
    }
  }, [JSON.stringify(tags)])

  useEffect(() => {
    if (!isEqual(previousRefEditorConfig.current, configurableEditorConfig)) {
      previousRefEditorConfig.current = configurableEditorConfig
      setSelectedWaxConfig({
        ...selectedWaxConfig,
        MenuService: selectedWaxConfig.MenuService.map(service => {
          // Find the matching service in waxMenuConfig based on templateArea
          const matchingConfig = waxMenuConfig.MenuService.find(
            config => config.templateArea === service.templateArea,
          )

          return {
            ...service,
            toolGroups: matchingConfig
              ? matchingConfig.toolGroups
              : service.toolGroups,
          }
        }),
      })
    }
  }, [configurableEditorConfig])

  useEffect(() => {
    setSelectedWaxConfig({
      ...selectedWaxConfig,
      AskAiContentService: {
        AskAiContentTransformation: queryAI,
        FreeTextPromptsOn: freeTextPromptsOn,
        CustomPromptsOn: customPromptsOn,
        CustomPrompts: customPromptsOn ? customPrompts : [],
        AiOn: aiEnabled && aiOn,
        ...(kbOn ? { AskKb: true } : {}),
      },
    })
  }, [aiOn])

  useEffect(() => {
    setSelectedWaxConfig({
      ...selectedWaxConfig,
      YjsService: {
        content: bookComponentContent,
        provider: () => wsProvider,
        ydoc: () => ydoc,
        yjsType: 'prosemirror',
        cursorBuilder: u => {
          if (u) {
            const cursor = document.createElement('span')
            cursor.classList.add('ProseMirror-yjs-cursor')
            cursor.setAttribute('style', `border-color: ${u.color}`)
            const userDiv = document.createElement('div')
            userDiv.setAttribute('style', `background-color: ${u.color}`)
            userDiv.insertBefore(document.createTextNode(u.name), null)
            cursor.insertBefore(userDiv, null)
            return cursor
          }

          return ''
        },
      },
      CustomTagService: {
        tags,
        updateTags: () => true,
      },
      TitleService: {
        updateTitle: onPeriodicTitleChange,
      },
      CommentsService: {
        readOnly: !canInteractWithComments,
        // getComments: addComments,
        setComments: () => {
          return []
        },
        userList: bookMembers,
        getMentionedUsers: onMention,
      },
      ImageService: {
        handleAssetManager: onAssetManager,
        handleAddedRemovedImages,
        showAlt: true,
      },

      services: [new YjsService(), ...selectedWaxConfig.services],
    })
    // reset config when bookComponentContent is updated (in case of updates comming from subscriptions)
  }, [memoizedProvider, bookComponentContent])

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
      pureScienceConfig,
      onRunWorkflow,
      languages,
      currentLanguage,
      onLanguageChange,
      setIsCurrentDocumentMine,
      isUploading,
      setUploading,
      deleteFromFileManager,
      getObjectFileManager,
      handleCloseFileUpload,
      loaded,
      setUserFileManagerFiles,
      uploadToFileManager,
      userFileManagerFiles,
      updateFile,
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
    savedComments,
    viewMetadata,
    settings,
    bookId,
    aiEnabled,
    updateLoading,
    pureScienceConfig,
    languages,
    currentLanguage,
    loaded,
    userFileManagerFiles,
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
      readonly={isReadOnly}
      ref={editorRef}
      user={userObject}
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
