import React, { useState, useEffect, useRef } from 'react'

import useWebSocket from 'react-use-websocket'
import { useHistory, useParams } from 'react-router-dom'
import {
  useQuery,
  useLazyQuery,
  useMutation,
  useSubscription,
} from '@apollo/client'
import find from 'lodash/find'
import debounce from 'lodash/debounce'
import { uuid, useCurrentUser } from '@coko/client'
import { webSocketServerUrl } from '@coko/client/dist/helpers/getUrl'
import styled from 'styled-components'
import {
  GET_ENTIRE_BOOK,
  GET_BOOK_SETTINGS,
  RENAME_BOOK_COMPONENT_TITLE,
  UPDATE_BOOK_COMPONENT_CONTENT,
  UPDATE_BOOK_COMPONENT_TYPE,
  DELETE_BOOK_COMPONENT,
  CREATE_BOOK_COMPONENT,
  INGEST_WORD_FILES,
  UPDATE_BOOK_POD_METADATA,
  UPDATE_BOOK_COMPONENTS_ORDER,
  UPLOAD_FILES,
  LOCK_BOOK_COMPONENT_POD,
  RENAME_BOOK,
  UPDATE_SUBTITLE,
  BOOK_UPDATED_SUBSCRIPTION,
  BOOK_SETTINGS_UPDATED_SUBSCRIPTION,
  GET_BOOK_COMPONENT,
  USE_CHATGPT,
  APPLICATION_PARAMETERS,
  SET_BOOK_COMPONENT_STATUS,
  UPDATE_BOOK_COMPONENT_PARENT_ID,
  RAG_SEARCH,
  // BOOK_SETTINGS_UPDATED_SUBSCRIPTION,
} from '../graphql'

import {
  isOwner,
  hasEditAccess,
  isAdmin,
  isCollaborator,
} from '../helpers/permissions'
import {
  showUnauthorizedActionModal,
  showUnauthorizedAccessModal,
  showGenericErrorModal,
  showChangeInPermissionsModal,
  onInfoModal,
  showOpenAiRateLimitModal,
  showErrorModal,
  showDeletedBookModal,
} from '../helpers/commonModals'

import { Editor, Modal, Paragraph, Spin } from '../ui'
import { waxAiToolRagSystem, waxAiToolSystem } from '../helpers/openAi'

const StyledSpin = styled(Spin)`
  display: grid;
  height: 100vh;
  place-content: center;
`

const calculateEditorMode = (lock, canModify, currentUser, tabId) => {
  if (
    (lock && lock.userId !== currentUser.id) ||
    (lock && lock.userId === currentUser.id && tabId !== lock.tabId) ||
    !canModify
  ) {
    return 'preview'
  }

  if (!lock && canModify) {
    return 'full'
  }

  return lock && lock.userId === currentUser.id && tabId === lock.tabId
    ? 'full'
    : 'preview'
}

const constructMetadataValues = (title, subtitle, podMetadata) => {
  return {
    title,
    subtitle,
    ...podMetadata,
  }
}

let issueInCommunicationModal

const ProducerPage = () => {
  // #region INITIALIZATION SECTION START
  const history = useHistory()
  const params = useParams()
  const { bookId } = params

  const page = history.location.pathname.substring(
    history.location.pathname.lastIndexOf('/') + 1,
  )

  const [tabId] = useState(uuid())

  const [selectedChapterId, setSelectedChapterId] = useState(
    () => localStorage.getItem(`${bookId}-selected-chapter`) || undefined,
  )

  const [reconnecting, setReconnecting] = useState(false)
  const [metadataModalOpen, setMetadataModalOpen] = useState(false)
  const [aiOn, setAiOn] = useState(false)
  const [customPrompts, setCustomPrompts] = useState([])
  const [freeTextPromptsOn, setFreeTextPromptsOn] = useState(false)
  const [customPromptsOn, setCustomPromptsOn] = useState(false)
  const [editorLoading, setEditorLoading] = useState(false)
  const [key, setKey] = useState()

  const [currentBookComponentContent, setCurrentBookComponentContent] =
    useState(null)

  const { currentUser } = useCurrentUser()
  const token = localStorage.getItem('token')

  const canModify =
    isAdmin(currentUser) ||
    isOwner(bookId, currentUser) ||
    hasEditAccess(bookId, currentUser)

  const hasMembership =
    isOwner(bookId, currentUser) || isCollaborator(bookId, currentUser)

  // #endregion INITIALIZATION SECTION
  // QUERIES SECTION START
  const {
    loading: applicationParametersLoading,
    data: applicationParametersData,
  } = useQuery(APPLICATION_PARAMETERS, {
    fetchPolicy: 'network-only',
  })

  const hasRendered = useRef(false)

  const {
    loading,
    error,
    data: bookQueryData,
    refetch: refetchBook,
  } = useQuery(GET_ENTIRE_BOOK, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'network-only',
    variables: {
      id: bookId,
    },
    onCompleted: data => {
      setAiOn(data?.getBook?.bookSettings?.aiOn)
      setCustomPrompts(data?.getBook?.bookSettings?.customPrompts)
      setFreeTextPromptsOn(data?.getBook?.bookSettings?.freeTextPromptsOn)
      setCustomPromptsOn(data?.getBook?.bookSettings?.customPromptsOn)

      // if loading page the first time and no chapter is preselected, select the first one
      if (selectedChapterId === undefined) {
        const firstChapter = data?.getBook?.divisions[1].bookComponents[0]

        if (!firstChapter.uploading) {
          setSelectedChapterId(data?.getBook?.divisions[1].bookComponents[0].id)
        }
      }
    },
  })

  const { loading: bookComponentLoading } = useQuery(GET_BOOK_COMPONENT, {
    fetchPolicy: 'network-only',
    skip: !selectedChapterId || !bookQueryData,
    variables: { id: selectedChapterId },
    onError: () => {
      if (!reconnecting) {
        if (hasMembership) {
          showGenericErrorModal()
        }
      }
    },
    onCompleted: data => {
      setCurrentBookComponentContent(data.getBookComponent.content)
    },
  })

  const [chatGPT] = useLazyQuery(USE_CHATGPT, {
    fetchPolicy: 'network-only',
    onError: err => {
      if (err.toString().includes('Missing access key')) {
        onInfoModal('Access key is missing or invalid')
      } else if (
        err.toString().includes('Request failed with status code 429')
      ) {
        showOpenAiRateLimitModal()
      } else {
        showGenericErrorModal()
      }
    },
  })

  const [ragSearch] = useLazyQuery(RAG_SEARCH)

  const [getBookSettings] = useLazyQuery(GET_BOOK_SETTINGS, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'network-only',
    variables: {
      id: bookId,
    },
  })

  const editorRef = useRef(null)

  // QUERIES SECTION END

  useEffect(() => {
    if (currentUser && !hasRendered.current) {
      hasRendered.current = true
    } else if (hasRendered.current) {
      const stillMember =
        isAdmin(currentUser) ||
        isOwner(bookId, currentUser) ||
        isCollaborator(bookId, currentUser)

      if (stillMember) {
        showChangeInPermissionsModal()
      }
    }
  }, [currentUser])

  useEffect(() => {
    refetchBook()
    setKey(uuid())
  }, [page])

  const bookComponent =
    !loading &&
    selectedChapterId &&
    find(bookQueryData?.getBook?.divisions[1].bookComponents, {
      id: selectedChapterId,
    })

  const editorMode =
    !loading &&
    selectedChapterId &&
    calculateEditorMode(bookComponent?.lock, canModify, currentUser, tabId)

  const isReadOnly =
    !selectedChapterId || (editorMode && editorMode === 'preview') || !canModify

  const bookMetadataValues = constructMetadataValues(
    bookQueryData?.getBook.title,
    bookQueryData?.getBook.subtitle,
    bookQueryData?.getBook?.podMetadata,
  )

  useEffect(() => {
    if (
      !loading &&
      !hasMembership &&
      !error?.message?.includes('does not exist')
    ) {
      const redirectToDashboard = () => history.push('/dashboard')
      showUnauthorizedAccessModal(redirectToDashboard)
    }
  }, [hasMembership])

  useEffect(() => {
    if (!selectedChapterId) {
      setCurrentBookComponentContent(null)
      localStorage.removeItem(`${bookId}-selected-chapter`)
    } else {
      localStorage.setItem(`${bookId}-selected-chapter`, selectedChapterId)
    }
  }, [selectedChapterId])

  useEffect(() => {
    if (!bookComponentLoading) {
      setKey(uuid())
    }
  }, [editorLoading, bookComponentLoading, isReadOnly])

  // SUBSCRIPTIONS SECTION START

  useSubscription(BOOK_UPDATED_SUBSCRIPTION, {
    variables: { id: bookId },
    fetchPolicy: 'network-only',
    onData: () => {
      if (hasMembership) {
        refetchBook({ id: bookId })
      }
    },
  })

  useSubscription(BOOK_SETTINGS_UPDATED_SUBSCRIPTION, {
    variables: { id: bookId },
    fetchPolicy: 'network-only',
    onData: async () => {
      await refetchBook()
      setKey(uuid())
    },
  })
  // SUBSCRIPTIONS SECTION END

  useEffect(() => {
    if (isOwner(bookId, currentUser)) {
      if (selectedChapterId) {
        setCurrentBookComponentContent(editorRef?.current?.getContent())
      }

      refetchBook({ id: bookId })
    }
  }, [bookQueryData?.getBook.bookSettings?.aiOn])

  // MUTATIONS SECTION START
  const [updateContent] = useMutation(UPDATE_BOOK_COMPONENT_CONTENT, {
    onError: err => {
      if (err.toString().includes('Not Authorised')) {
        showUnauthorizedActionModal(false)
      } else if (!reconnecting) showGenericErrorModal()
    },
  })

  const [updateBookComponentType, { loading: componentTypeInProgress }] =
    useMutation(UPDATE_BOOK_COMPONENT_TYPE, {
      onError: err => {
        if (err.toString().includes('Not Authorised')) {
          showUnauthorizedActionModal(false)
        } else if (!reconnecting) showGenericErrorModal()
      },
    })

  const [updateBookComponentParentId, { loading: parentIdInProgress }] =
    useMutation(UPDATE_BOOK_COMPONENT_PARENT_ID, {
      refetchQueries: [GET_ENTIRE_BOOK],
      onError: err => {
        if (err.toString().includes('Not Authorised')) {
          showUnauthorizedActionModal(false)
        } else if (!reconnecting) showGenericErrorModal()
      },
    })

  const [
    setBookComponentStatus,
    { loading: setBookComponentStatusInProgress },
  ] = useMutation(SET_BOOK_COMPONENT_STATUS, {
    onError: err => {
      if (err.toString().includes('Not Authorised')) {
        showUnauthorizedActionModal(false)
      } else if (!reconnecting) showGenericErrorModal()
    },
  })

  const [renameBook] = useMutation(RENAME_BOOK, {
    onError: err => {
      if (err.toString().includes('Not Authorised')) {
        showUnauthorizedActionModal(false)
      } else if (!reconnecting) showGenericErrorModal()
    },
  })

  const [updateSubtitle] = useMutation(UPDATE_SUBTITLE, {
    onError: err => {
      if (err.toString().includes('Not Authorised')) {
        showUnauthorizedActionModal(false)
      } else if (!reconnecting) showGenericErrorModal()
    },
  })

  const [createBookComponent, { loading: addBookComponentInProgress }] =
    useMutation(CREATE_BOOK_COMPONENT, {
      refetchQueries: [GET_ENTIRE_BOOK],
      onError: err => {
        if (err.toString().includes('Not Authorised')) {
          showUnauthorizedActionModal(false)
        } else if (!reconnecting) showGenericErrorModal()
      },
    })

  const [renameBookComponent] = useMutation(RENAME_BOOK_COMPONENT_TITLE, {
    onError: err => {
      if (err.toString().includes('Not Authorised')) {
        showUnauthorizedActionModal(false)
      } else if (!reconnecting) showGenericErrorModal()
    },
  })

  const [deleteBookComponent, { loading: deleteBookComponentInProgress }] =
    useMutation(DELETE_BOOK_COMPONENT, {
      refetchQueries: [GET_ENTIRE_BOOK],
      onCompleted: (_, { variables }) => {
        const { input } = variables
        const { id: deletedId } = input

        if (selectedChapterId && selectedChapterId === deletedId) {
          setSelectedChapterId(null)
        }
      },
      onError: err => {
        if (err.toString().includes('Not Authorised')) {
          showUnauthorizedActionModal(false)
        } else if (!reconnecting) showGenericErrorModal()
      },
    })

  const [updateBookComponentsOrder, { loading: changeOrderInProgress }] =
    useMutation(UPDATE_BOOK_COMPONENTS_ORDER, {
      refetchQueries: [GET_ENTIRE_BOOK],
      onError: err => {
        if (err.toString().includes('Not Authorised')) {
          showUnauthorizedActionModal(false)
        } else if (!reconnecting) showGenericErrorModal()
      },
    })

  const [ingestWordFile, { loading: ingestWordFileInProgress }] = useMutation(
    INGEST_WORD_FILES,
    {
      refetchQueries: [GET_ENTIRE_BOOK],
      onError: err => {
        if (err.toString().includes('Not Authorised')) {
          showUnauthorizedActionModal(false)
        } else if (!reconnecting) showGenericErrorModal()
      },
    },
  )

  const [updatePODMetadata] = useMutation(UPDATE_BOOK_POD_METADATA, {
    onError: err => {
      if (err.toString().includes('Not Authorised')) {
        showUnauthorizedActionModal(false)
      } else if (!reconnecting) showGenericErrorModal()
    },
  })

  const [lockBookComponent] = useMutation(LOCK_BOOK_COMPONENT_POD, {
    refetchQueries: [GET_ENTIRE_BOOK],
    onError: () => {},
  })

  const [upload] = useMutation(UPLOAD_FILES)
  // MUTATIONS SECTION END

  // HANDLERS SECTION START
  const getBodyDivisionId = () => {
    if (bookQueryData) {
      const { getBook } = bookQueryData
      const { divisions } = getBook
      const bodyDivision = find(divisions, { label: 'Body' })
      return bodyDivision.id
    }

    return undefined
  }

  const onBookComponentContentChange = content => {
    if (selectedChapterId && canModify) {
      updateContent({
        variables: {
          input: {
            id: selectedChapterId,
            content,
          },
        },
      })
    }
  }

  const onBookComponentTypeChange = (componentId, componentType) => {
    if (componentId && componentType && canModify) {
      updateBookComponentType({
        variables: {
          input: {
            id: componentId,
            componentType,
          },
        },
      })
    }
  }

  const onBookComponentParentIdChange = (componentId, parentComponentId) => {
    if (componentId && canModify) {
      updateBookComponentParentId({
        variables: {
          input: {
            id: componentId,
            parentComponentId,
          },
        },
      })
    }
  }

  const onAddChapter = () => {
    if (!canModify) {
      showUnauthorizedActionModal(false)
      return
    }

    const divisionId = getBodyDivisionId()

    if (!divisionId) {
      console.error('no body division found')
      return
    }

    createBookComponent({
      variables: {
        input: {
          bookId,
          divisionId,
          componentType: 'chapter',
        },
      },
    }).then(({ data }) => {
      setSelectedChapterId(data?.podAddBookComponent?.id)
    })
  }

  const onBookComponentTitleChange = title => {
    const currentChapter = find(
      bookQueryData?.getBook?.divisions[1].bookComponents,
      {
        id: selectedChapterId,
      },
    )

    // only fire if new title !== current title to avoid unnecessary call
    if (
      selectedChapterId &&
      canModify &&
      title !== currentChapter?.title &&
      !(applicationParametersLoading || loading || bookComponentLoading)
    ) {
      renameBookComponent({
        variables: {
          input: {
            id: selectedChapterId,
            title,
          },
        },
      })
    }
  }

  const onDeleteChapter = bookComponentId => {
    if (!canModify) {
      showUnauthorizedActionModal(false)
      return
    }

    const found = find(bookQueryData?.getBook.divisions[1].bookComponents, {
      id: bookComponentId,
    })

    if (found) {
      const { lock } = found

      if (
        lock &&
        !isOwner(bookId, currentUser) &&
        lock.userId !== currentUser.id
      ) {
        showUnauthorizedActionModal(false, null, 'lockedChapterDelete')
        return
      }
    }

    deleteBookComponent({
      variables: {
        input: {
          id: bookComponentId,
        },
      },
    })
  }

  const onSubmitBookMetadata = data => {
    const { title, subtitle, ...rest } = data

    if (!canModify) {
      showUnauthorizedActionModal(false)
      return
    }

    if (title) {
      renameBook({ variables: { id: bookId, title } })
    }

    if (subtitle) {
      updateSubtitle({ variables: { id: bookId, subtitle } })
    }

    updatePODMetadata({ variables: { bookId, metadata: rest } })
  }

  const showOfflineModal = () => {
    const warningModal = Modal.error()
    return warningModal.update({
      title: 'Server is unreachable',
      content: (
        <Paragraph>
          {`Unfortunately, we couldn't re-establish communication with our server! Currently we don't
          support offline mode. Please return to this page when your network
          issue is resolved.`}
        </Paragraph>
      ),
      maskClosable: false,
      onOk() {
        history.push('/dashboard')
        warningModal.destroy()
      },
      okButtonProps: { style: { backgroundColor: 'black' } },
      width: 570,
      bodyStyle: {
        marginRight: 38,
        textAlign: 'justify',
      },
    })
  }

  const communicationDownModal = () => {
    const warningModal = Modal.warn()
    warningModal.update({
      title: 'Something went wrong!',
      content: (
        <Paragraph>
          Please wait while we are trying resolve the issue. Make sure your
          internet connection is working.
        </Paragraph>
      ),
      maskClosable: false,
      footer: null,
      width: 570,
      bodyStyle: {
        marginRight: 38,
        textAlign: 'justify',
      },
    })
    return warningModal
  }

  const showUploadingModal = () => {
    const warningModal = Modal.warn()
    return warningModal.update({
      title: 'Warning',
      content: (
        <Paragraph>
          You can not start editing this component as it is in uploading state.
          This means that we are converting your provided .docx file in order to
          create the content of this chapter. Please try again in a moment.
        </Paragraph>
      ),
      maskClosable: false,
      onOk() {
        warningModal.destroy()
      },
      okButtonProps: { style: { backgroundColor: 'black' } },
      width: 570,
      bodyStyle: {
        marginRight: 38,
        textAlign: 'justify',
      },
    })
  }

  const showConversionErrorModal = chapterId => {
    const errorModal = Modal.error()
    return errorModal.update({
      title: 'Error',
      content: (
        <Paragraph>
          Unfortunately, something went wrong while trying to convert your docx
          file. Please inform your admin about this issue. In the meantime, you
          could manually insert your content via using our editor, or delete
          this chapter and re-upload it if your admin informs you that this
          issue is resolved.
        </Paragraph>
      ),
      maskClosable: false,
      onOk() {
        setBookComponentStatus({
          variables: { id: chapterId, status: 200 },
        })
        errorModal.destroy()
      },
      okButtonProps: { style: { backgroundColor: 'black' } },
      width: 570,
      bodyStyle: {
        marginRight: 38,
        textAlign: 'justify',
      },
    })
  }

  const showAiUnavailableModal = () => {
    const errorModal = Modal.error()
    return errorModal.update({
      title: 'Error',
      content: (
        <Paragraph>AI use has been disabled by the book owner</Paragraph>
      ),
      onOk() {
        refetchBook()
      },
      okButtonProps: { style: { backgroundColor: 'black' } },
      maskClosable: false,
      width: 570,
      bodyStyle: {
        marginRight: 38,
        textAlign: 'justify',
      },
    })
  }

  const onBookComponentLock = () => {
    if (selectedChapterId && canModify) {
      const userAgent = window.navigator.userAgent || null
      lockBookComponent({
        variables: {
          id: selectedChapterId,
          tabId,
          userAgent,
        },
      })
    }
  }

  const queryAI = async (input, { askKb }) => {
    const settings = await getBookSettings()
    const [userInput, highlightedText] = input.text

    const formattedInput = {
      text: [`${userInput}.\nHighlighted text: ${highlightedText}`],
    }

    let response = 'hello'

    if (!askKb) {
      const {
        data: { openAi },
      } = await chatGPT({
        variables: {
          system: waxAiToolSystem,
          input: formattedInput,
        },
      })

      const {
        message: { content },
      } = JSON.parse(openAi)

      response = content
    } else {
      const { data } = await ragSearch({
        variables: {
          bookId,
          input: formattedInput,
          system: waxAiToolRagSystem,
        },
      })

      const {
        message: { content },
      } = JSON.parse(data.ragSearch)

      response = content
    }

    if (settings?.data.getBook.bookSettings.aiOn) {
      return new Promise((resolve, reject) => {
        resolve(response)
      })
    }

    showAiUnavailableModal()
    return new Promise((resolve, reject) => {
      reject()
    })
  }

  const heartbeatInterval = find(
    applicationParametersData?.getApplicationParameters,
    { area: 'heartbeatInterval' },
  )

  const onReorderChapter = newChapterList => {
    if (!canModify) {
      showUnauthorizedActionModal(false)
      return
    }

    if (
      JSON.stringify(newChapterList) !==
      JSON.stringify(bookQueryData?.getBook.divisions[1].bookComponents)
    ) {
      updateBookComponentsOrder({
        variables: {
          targetDivisionId: bookQueryData?.getBook.divisions[1].id,
          bookComponents: newChapterList.map(chapter => chapter.id),
        },
      })
    }
  }

  const onChapterClick = chapterId => {
    const found = find(bookQueryData?.getBook?.divisions[1].bookComponents, {
      id: chapterId,
    })

    const isAlreadySelected =
      selectedChapterId && chapterId === selectedChapterId

    if (found.status === 300) {
      showConversionErrorModal(chapterId)
      return
    }

    if (found.uploading) {
      showUploadingModal()
      return
    }

    if (isAlreadySelected) {
      setSelectedChapterId(null)
      return
    }

    setSelectedChapterId(chapterId)
  }

  const onUploadChapter = () => {
    if (!canModify) {
      showUnauthorizedActionModal(false)
      return
    }

    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.docx'

    input.onchange = event => {
      const selectedFile = event.target.files[0]

      ingestWordFile({
        variables: {
          bookComponentFiles: [
            {
              file: selectedFile,
              bookId,
              componentType: 'chapter',
              divisionLabel: 'Body',
            },
          ],
        },
      })
    }

    input.click()
  }

  const onPeriodicBookComponentContentChange = debounce(changedContent => {
    if (editorMode && editorMode === 'full') {
      onBookComponentContentChange(changedContent)
    }
  }, 50)

  const handleImageUpload = async file => {
    if (!canModify) {
      return showUnauthorizedActionModal(false)
    }

    const mutationVariables = {
      variables: {
        files: [file],
        entityId: bookId,
        entityType: 'book',
      },
    }

    let uploadedFile

    await upload(mutationVariables)
      .then(res => {
        /* eslint-disable-next-line prefer-destructuring */
        uploadedFile = res.data.uploadFiles[0]
      })
      .catch(e => console.error(e))

    // wax expects a promise here
    return new Promise((resolve, reject) => {
      if (uploadedFile) {
        const { id: fileId, url } = uploadedFile

        resolve({
          url,
          extraData: {
            fileId,
          },
        })
      } else {
        reject()
      }
    })
  }

  // HANDLERS SECTION END

  // WEBSOCKET SECTION START
  useWebSocket(
    `${webSocketServerUrl}/locks`,
    {
      onOpen: () => {
        if (editorMode && editorMode !== 'preview') {
          if (!reconnecting) {
            onBookComponentLock()
          }

          if (reconnecting) {
            if (selectedChapterId) {
              const tempChapterId = selectedChapterId
              setSelectedChapterId(null)
              setSelectedChapterId(tempChapterId)
            }

            if (issueInCommunicationModal) {
              issueInCommunicationModal.destroy()
              issueInCommunicationModal = undefined
            }

            setReconnecting(false)
          }
        }
      },
      onError: () => {
        if (!reconnecting) {
          issueInCommunicationModal = communicationDownModal()
          setReconnecting(true)
        }
      },
      shouldReconnect: () => {
        return selectedChapterId && editorMode && editorMode !== 'preview'
      },
      onReconnectStop: () => {
        showOfflineModal()
      },
      queryParams: {
        token,
        bookComponentId: selectedChapterId,
        tabId,
      },
      share: true,
      reconnectAttempts: 5000,
      reconnectInterval: (heartbeatInterval?.config || 5000) + 500,
    },
    selectedChapterId !== undefined && editorMode && editorMode !== 'preview',
  )

  // WEBSOCKET SECTION END

  if (!loading && error?.message?.includes('does not exist')) {
    showErrorModal(() => history.push('/dashboard'))
  }

  if (!loading && error?.message?.includes('has been deleted')) {
    showDeletedBookModal(() => history.push('/dashboard'))
  }

  if (reconnecting) {
    return <StyledSpin spinning />
  }

  useEffect(() => {
    if (applicationParametersLoading || loading || bookComponentLoading) {
      setEditorLoading(true)
    } else if (!bookComponentLoading) {
      setTimeout(() => {
        setEditorLoading(false)
      }, 500)
    }
  }, [applicationParametersLoading, loading, bookComponentLoading])

  const chaptersActionInProgress =
    changeOrderInProgress ||
    addBookComponentInProgress ||
    deleteBookComponentInProgress ||
    ingestWordFileInProgress ||
    setBookComponentStatusInProgress ||
    componentTypeInProgress ||
    parentIdInProgress

  const isAIEnabled = find(
    applicationParametersData?.getApplicationParameters,
    { area: 'aiEnabled' },
  )

  return (
    <Editor
      aiEnabled={isAIEnabled?.config}
      aiOn={aiOn}
      bookComponentContent={currentBookComponentContent}
      bookMetadataValues={bookMetadataValues}
      bookSettings={bookQueryData?.getBook.bookSettings}
      canEdit={canModify}
      chapters={bookQueryData?.getBook?.divisions[1].bookComponents}
      chaptersActionInProgress={chaptersActionInProgress}
      customPrompts={customPrompts}
      customPromptsOn={customPromptsOn}
      editorKey={key}
      editorLoading={editorLoading}
      editorRef={editorRef}
      freeTextPromptsOn={freeTextPromptsOn}
      id={bookId}
      isReadOnly={isReadOnly}
      kbOn={bookQueryData?.getBook.bookSettings.knowledgeBaseOn}
      metadataModalOpen={metadataModalOpen}
      onAddChapter={onAddChapter}
      onBookComponentParentIdChange={onBookComponentParentIdChange}
      onBookComponentTitleChange={onBookComponentTitleChange}
      onBookComponentTypeChange={onBookComponentTypeChange}
      onChapterClick={onChapterClick}
      onDeleteChapter={onDeleteChapter}
      onImageUpload={handleImageUpload}
      onPeriodicBookComponentContentChange={
        onPeriodicBookComponentContentChange
      }
      onReorderChapter={onReorderChapter}
      onSubmitBookMetadata={onSubmitBookMetadata}
      onUploadChapter={onUploadChapter}
      page={page}
      queryAI={queryAI}
      selectedChapterId={selectedChapterId}
      setMetadataModalOpen={setMetadataModalOpen}
      subtitle={bookQueryData?.getBook.subtitle}
      title={bookQueryData?.getBook.title}
      // bookComponentContent={bookComponentData?.getBookComponent?.content}
    />
  )
}

export default ProducerPage
