// #region import
import React, { useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import {
  useQuery,
  useMutation,
  useLazyQuery,
  useSubscription,
} from '@apollo/client'
import isEqual from 'lodash/isEqual'
import pick from 'lodash/pick'
import sortBy from 'lodash/sortBy'

import { useCurrentUser } from '@coko/client'

import {
  APPLICATION_PARAMETERS,
  BOOK_UPDATED_SUBSCRIPTION,
  CREATE_EXPORT_PROFILE,
  DELETE_EXPORT_PROFILE,
  GET_BOOK_COMPONENT_IDS,
  GET_SPECIFIC_TEMPLATES,
  GET_EXPORT_PROFILES,
  GET_PAGED_PREVIEWER_LINK,
  EXPORT_BOOK,
  RENAME_EXPORT_PROFILE,
  UPLOAD_TO_LULU,
  UPDATE_EXPORT_PROFILE_OPTIONS,
  PUBLISH_ONLINE,
  GET_BOOK_WEB_PUBLISH_INFO,
} from '../graphql'

import { isOwner, hasEditAccess, isAdmin } from '../helpers/permissions'
import { showErrorModal, showDeletedBookModal } from '../helpers/commonModals'
import { Preview, Spin } from '../ui'
// #endregion import

const StyledSpin = styled(Spin)`
  display: grid;
  height: 100vh;
  place-content: center;
`

// #region helpers
// exported for stories
export const defaultProfile = {
  label: 'New export',
  value: 'new-export',
  format: 'pdf',
  size: '5.5x8.5',
  content: ['includeTitlePage', 'includeCopyrights', 'includeTOC'],
  template: null,
  isbn: null,
}

const sanitizeProfileData = input => {
  const res = { ...input }
  if (res.format === 'epub') res.trimSize = null
  return res
}

const getFormatTarget = format => (format === 'pdf' ? 'pagedjs' : format)

const sanitizeOptionData = data => {
  const d = { ...data }
  d.content = d.content.sort()
  return d
}

const optionKeys = [
  'format',
  'size',
  'content',
  'template',
  'isbn',
  'includePdf',
  'includeEpub',
  'pdfProfileId',
  'epubProfileId',
]

const getProfileExportOptions = profile => {
  const p = pick(profile, optionKeys)
  return sanitizeOptionData(p)
}

const chooseZoom = screenWidth => {
  if (screenWidth <= 1600 && screenWidth >= 1470) return 0.8
  if (screenWidth <= 1469 && screenWidth >= 1281) return 0.6
  if (screenWidth <= 1280) return 0.5
  return 1.0
}
// #endregion helpers

const PreviewerPage = () => {
  // #region init
  const params = useParams()
  const history = useHistory()
  const { bookId } = params
  const { currentUser } = useCurrentUser()
  const [previewLink, setPreviewLink] = useState(null)
  const [creatingPreview, setCreatingPreview] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [activeTabKey, setActiveTabKey] = useState('new')

  React.useEffect(() => {
    if (!localStorage.getItem('zoomPercentage')) {
      localStorage.setItem('zoomPercentage', chooseZoom(window.innerWidth))
    }

    if (!localStorage.getItem('pageSpread')) {
      localStorage.setItem('pageSpread', 'single')
    }
  }, [])
  // #endregion init

  // #region queries
  const {
    data: profilesData,
    loading: profilesLoading,
    refetch: refetchProfiles,
  } = useQuery(GET_EXPORT_PROFILES, {
    fetchPolicy: 'network-only',
    variables: {
      bookId,
    },
  })

  const {
    data: book,
    loading: bookLoading,
    error,
  } = useQuery(GET_BOOK_COMPONENT_IDS, {
    variables: {
      bookId,
    },
  })

  const { data: { getBook: { webPublishInfo } = {} } = {} } = useQuery(
    GET_BOOK_WEB_PUBLISH_INFO,
    {
      variables: {
        id: bookId,
      },
    },
  )

  const { data: { getApplicationParameters } = {}, loading: paramsLoading } =
    useQuery(APPLICATION_PARAMETERS, {
      onCompleted: ({ getApplicationParameters: applicationParams }) => {
        const exportsConfig = applicationParams?.find(
          p => p.area === 'exportsConfig',
        ).config

        if (!exportsConfig.pdfDownload.enabled) {
          if (exportsConfig.epubDownload.enabled) {
            defaultProfile.format = 'epub'
            defaultProfile.size = null
          } else if (exportsConfig.webPublish.enabled) {
            defaultProfile.format = 'web'
            defaultProfile.size = null
          } else {
            defaultProfile.format = 'Preview disabled'
          }
        }

        setNewProfileOptions({
          ...newProfileOptions,
          includePdf: exportsConfig.webPdfDownload?.enabled,
          includeEpub: exportsConfig.webEpubDownload?.enabled,
        })
      },
    })

  const {
    data: templatesData,
    loading: templatesLoading,
    refetch: refetchTemplates,
  } = useQuery(GET_SPECIFIC_TEMPLATES, {
    skip: !getApplicationParameters,
    variables: {
      where: {
        target: getFormatTarget(defaultProfile.format),
        trimSize: defaultProfile.size,
      },
    },
  })

  const [getPagedLink, { loading: previewIsLoading }] = useLazyQuery(
    GET_PAGED_PREVIEWER_LINK,
    {
      onCompleted: ({ getPagedPreviewerLink: { link } }) => {
        setPreviewLink(link)
      },
    },
  )

  const [createPreview, { called: createPreviewCalled }] = useMutation(
    EXPORT_BOOK,
    {
      onCompleted: ({ exportBook }, { variables: { input } }) => {
        const { path } = exportBook
        const hash = path.split('/')

        const previewerOptions = {
          ...(localStorage.getItem('pageSpread') &&
            localStorage.getItem('pageSpread') === 'double' && {
              doublePageSpread: true,
            }),
          ...(localStorage.getItem('zoomPercentage') &&
            parseFloat(localStorage.getItem('zoomPercentage')) !== 1.0 && {
              zoomPercentage: parseFloat(
                localStorage.getItem('zoomPercentage'),
              ),
            }),
        }

        if (input.previewer === 'web') {
          // preview the url returned by the server
          setPreviewLink(path)
          return true
        }

        return getPagedLink({
          variables: {
            hash: hash[0],
            previewerOptions,
          },
        })
      },
    },
  )

  const [createProfile] = useMutation(CREATE_EXPORT_PROFILE, {
    refetchQueries: [
      {
        query: GET_EXPORT_PROFILES,
        variables: { bookId },
      },
    ],
    awaitRefetchQueries: true,
    onCompleted: res => {
      const created = res.createExportProfile
      setSelectedProfile(created.id)

      setCurrentOptions({
        content: Array.from(Object.keys(created.includedComponents))
          .map(e => {
            if (e === 'toc') return 'includeTOC'
            if (e === 'copyright') return 'includeCopyrights'
            if (e === 'titlePage') return 'includeTitlePage'
            return false
          })
          .filter(e => !!e),

        format: created.format,
        isbn: created.isbn,
        size: created.trimSize,
        template: created.templateId,
        includePdf: created.downloadableAssets.pdf,
        includeEpub: created.downloadableAssets.epub,
        pdfProfileId: created.downloadableAssets.pdfProfileId,
        epubProfileId: created.downloadableAssets.epubProfileId,
      })

      setActiveTabKey('saved')
    },
  })

  const [renameProfile] = useMutation(RENAME_EXPORT_PROFILE)

  const [updateProfileOptions] = useMutation(UPDATE_EXPORT_PROFILE_OPTIONS, {
    refetchQueries: [
      {
        query: GET_EXPORT_PROFILES,
        variables: { bookId },
      },
    ],
  })

  const [deleteProfile] = useMutation(DELETE_EXPORT_PROFILE, {
    refetchQueries: [
      {
        query: GET_EXPORT_PROFILES,
        variables: { bookId },
      },
    ],
  })

  const [download] = useMutation(EXPORT_BOOK, {
    onCompleted: ({ exportBook }, { variables: { input } }) => {
      const { fileExtension } = input
      const { path } = exportBook

      if (fileExtension === 'epub') return window.location.replace(path)
      return window.open(path, '_blank', 'noreferrer')
    },
  })

  const [publish, { loading: publishing }] = useMutation(PUBLISH_ONLINE, {
    onCompleted: ({ publishOnline }) => {
      const { path } = publishOnline

      return window.open(path, '_blank', 'noreferrer')
    },
    refetchQueries: [
      {
        query: GET_BOOK_WEB_PUBLISH_INFO,
        variables: { id: bookId },
      },
    ],
  })

  const [uploadToLulu] = useMutation(UPLOAD_TO_LULU)

  useSubscription(BOOK_UPDATED_SUBSCRIPTION, {
    variables: { id: bookId },
    fetchPolicy: 'network-only',
    onData: () => {
      refetchProfiles({ id: bookId })
    },
  })
  // #endregion queries

  // #region handlers
  const getLuluConfigValue = value => {
    const config = getApplicationParameters?.find(
      p => p.area === 'integrations',
    ).config.lulu

    return config[value]
  }

  const handleConnectToLulu = () => {
    const { location } = window
    const appURL = `${location.protocol}//${location.host}`
    const redirectURL = `${appURL}/provider-redirect/lulu`
    const encodedRedirectURL = encodeURIComponent(redirectURL)
    const baseLuluURL = getLuluConfigValue('loginUrl')
    const luluURLParams = `response_type=code&client_id=ketida-editor&redirect_uri=${encodedRedirectURL}`
    const luluURL = `${baseLuluURL}?${luluURLParams}`

    window.open(luluURL, null, 'width=600, height=600')
  }

  const handleSendToLulu = () => {
    return uploadToLulu({
      variables: { id: selectedProfile },
    })
  }

  const handleCreateProfile = displayName => {
    const {
      size: trimSize,
      format,
      content,
      template: templateId,
      isbn,
      includeEpub,
      includePdf,
      pdfProfileId,
      epubProfileId,
    } = newProfileOptions
    // } = activeTabKey === 'saved' ? currentOptions : newProfileOptions

    const data = {
      bookId,
      displayName,
      format,
      includedComponents: {
        toc: content.includes('includeTOC'),
        copyright: content.includes('includeCopyrights'),
        titlePage: content.includes('includeTitlePage'),
      },
      templateId,
      trimSize,
      isbn,
      downloadableAssets: {
        epub: includeEpub,
        pdf: includePdf,
        pdfProfileId,
        epubProfileId,
      },
    }

    return createProfile({
      variables: {
        input: sanitizeProfileData(data),
      },
    })
  }

  // TODO: fix this, differentiate between currentOptions and newProfileOptions
  const handleDeleteProfile = () => {
    setSelectedProfile(defaultProfile.value)

    const defaultTemplate = templatesData?.getSpecificTemplates.find(
      t => t.default,
    )

    setCurrentOptions({
      ...currentOptions,
      ...getProfileExportOptions({
        ...defaultProfile,
        template: defaultTemplate.id,
      }),
    })

    return deleteProfile({
      variables: {
        id: selectedProfile,
      },
    })
  }

  const handleRenameProfile = (id, newName) => {
    return renameProfile({
      variables: {
        id,
        displayName: newName,
      },
    })
  }

  const handleUpdateProfileOptions = () => {
    const {
      size: trimSize,
      format,
      content,
      template: templateId,
      isbn,
      includePdf,
      includeEpub,
      pdfProfileId,
      epubProfileId,
    } = activeTabKey === 'saved' ? currentOptions : newProfileOptions

    const data = {
      format,
      includedComponents: {
        toc: content.includes('includeTOC'),
        copyright: content.includes('includeCopyrights'),
        titlePage: content.includes('includeTitlePage'),
      },
      templateId,
      trimSize,
      isbn,
      downloadableAssets: {
        pdf: includePdf,
        epub: includeEpub,
        pdfProfileId: includePdf ? pdfProfileId : null,
        epubProfileId: includeEpub ? epubProfileId : null,
      },
    }

    return updateProfileOptions({
      variables: {
        id: selectedProfile,
        input: sanitizeProfileData(data),
      },
    })
  }

  const handleDownload = () => {
    const { format, template, content, isbn } =
      activeTabKey === 'saved' ? currentOptions : newProfileOptions

    return download({
      variables: {
        input: {
          bookId,
          templateId: template,
          fileExtension: format,
          additionalExportOptions: {
            includeTOC: content.includes('includeTOC'),
            includeCopyrights: content.includes('includeCopyrights'),
            includeTitlePage: content.includes('includeTitlePage'),
            isbn,
          },
        },
      },
    })
  }

  const handlePublish = () => {
    const { template, includePdf, includeEpub, pdfProfileId, epubProfileId } =
      currentOptions

    return publish({
      variables: {
        input: {
          bookId,
          templateId: template,
          additionalExportOptions: {
            includePdf,
            includeEpub,
            pdfProfileId,
            epubProfileId,
          },
        },
      },
    })
  }

  const handleUnpulbish = () => {
    // return unpublish({
    //   bookId,
    // })
  }

  const handleCreatePreview = (templates, options, target) => {
    const newTemplates = templates

    const optionsToApply = { ...options }

    const existingTemplateStillThere = newTemplates.find(
      t => t.id === options.template,
    )

    if (!existingTemplateStillThere) {
      const newTemplateWithSameName = newTemplates.find(
        t => t.name.toLowerCase() === selectedTemplate.name.toLowerCase(),
      )

      const newDefaultTemplate = newTemplates.find(t => t.default)

      const templateToApply =
        newTemplateWithSameName || newDefaultTemplate || null

      optionsToApply.template = templateToApply?.id || null
      setSelectedTemplate(templateToApply)
    } else if (selectedTemplate.id !== optionsToApply.template) {
      const newTemplate = newTemplates.find(
        t => t.id === optionsToApply.template,
      )

      setSelectedTemplate(newTemplate)
    }

    if (options.zoom) localStorage.setItem('zoomPercentage', options.zoom)
    if (options.spread) localStorage.setItem('pageSpread', options.spread)

    const previewData = {
      bookId,
      previewer: target,
      templateId: optionsToApply.template,
      additionalExportOptions: {
        includeTOC: options.content.includes('includeTOC'),
        includeCopyrights: options.content.includes('includeCopyrights'),
        includeTitlePage: options.content.includes('includeTitlePage'),
        ...(target === 'web' && {
          includePdf: options.includePdf,
          includeEpub: options.includeEpub,
        }),
      },
    }

    if (activeTabKey === 'saved') {
      setCurrentOptions({
        ...currentOptions,
        ...getProfileExportOptions(optionsToApply),
        zoom: options.zoom,
        spread: options.spread,
        includePdf: options.includePdf,
        includeEpub: options.includeEpub,
        pdfProfileId: options.pdfProfileId,
        epubProfileId: options.epubProfileId,
      })
    } else {
      setNewProfileOptions({
        ...newProfileOptions,
        ...getProfileExportOptions(optionsToApply),
        zoom: options.zoom,
        spread: options.spread,
        includePdf: options.includePdf,
        includeEpub: options.includeEpub,
        pdfProfileId: options.pdfProfileId,
        epubProfileId: options.epubProfileId,
      })
    }

    if ((target === 'pagedjs' || target === 'web') && !previewIsLoading) {
      createPreview({
        variables: {
          input: previewData,
        },
      }).finally(() => {
        setCreatingPreview(false)
      })
    } else {
      setCreatingPreview(false)
    }
  }

  const handleRefetchTemplates = options => {
    const templateTarget = getFormatTarget(options.format)
    const templateTrimSize = templateTarget === 'pagedjs' ? options.size : null

    setCreatingPreview(true)

    refetchTemplates({
      where: {
        target: templateTarget,
        trimSize: templateTrimSize,
      },
    }).then(res => {
      handleCreatePreview(
        res.data.getSpecificTemplates,
        options,
        templateTarget,
      )
    })
  }

  const handleOptionsChange = newOptions => {
    const current =
      activeTabKey === 'saved' ? currentOptions : newProfileOptions

    const options = { ...current, ...newOptions }

    if (options.format === 'pdf' && !options.size) {
      options.size = defaultProfile.size
    }

    if (options.format === 'epub' || options.format === 'web') {
      options.size = null
    }

    if (isEqual(current, options)) return

    if (options.format === 'web' && current.format === 'web') {
      setCreatingPreview(true)
      handleCreatePreview(templatesData.getSpecificTemplates, options, 'web')
    } else {
      handleRefetchTemplates(options)
    }
  }

  const handleProfileChange = profileId => {
    setSelectedProfile(profileId)

    if (profileId) {
      const newProfile = [defaultProfileWithTemplate, ...profiles].find(
        p => p.value === profileId,
      )

      handleOptionsChange(getProfileExportOptions(newProfile))
    }
  }

  const handleTabChange = activeKey => {
    if (activeKey) {
      setActiveTabKey(activeKey)
    }
  }
  // #endregion handlers

  // #region data wrangling

  const luluConfig = getApplicationParameters?.find(
    p => p.area === 'integrations',
  ).config.lulu

  const exportsConfig = getApplicationParameters?.find(
    p => p.area === 'exportsConfig',
  ).config

  const luluIdentity = currentUser?.identities?.find(
    id => id.provider === 'lulu',
  )

  const isUserConnectedToLulu =
    luluIdentity && luluIdentity.hasValidRefreshToken

  const storedZoom = localStorage.getItem('zoomPercentage')
  const initialZoom = storedZoom ? parseFloat(storedZoom) : 1

  const storedSpread = localStorage.getItem('pageSpread')
  const initialSpread = storedSpread || undefined

  const sortedTemplates = sortBy(
    templatesData?.getSpecificTemplates,
    i => !i.default,
  )

  const templates =
    sortedTemplates.length > 0
      ? sortedTemplates.map(t => {
          return {
            id: t.id,
            imageUrl: t.thumbnail?.url,
            name: t.name,
          }
        })
      : undefined

  const defaultTemplate = templatesData?.getSpecificTemplates.find(
    t => t.default,
  )

  const defaultProfileWithTemplate = {
    ...defaultProfile,
    template: defaultTemplate?.id,
  }

  const [selectedProfile, setSelectedProfile] = useState()

  const [newProfileOptions, setNewProfileOptions] = useState({
    ...getProfileExportOptions(defaultProfileWithTemplate),
    zoom: initialZoom,
    spread: initialSpread,
  })

  const [currentOptions, setCurrentOptions] = useState({
    ...getProfileExportOptions(defaultProfileWithTemplate),
    zoom: initialZoom,
    spread: initialSpread,
  })

  // initial preview
  React.useEffect(() => {
    if (!bookLoading && !error) {
      if (!selectedTemplate && !createPreviewCalled) {
        setSelectedTemplate(defaultTemplate)
      }

      if (templatesData && selectedTemplate && !createPreviewCalled) {
        // const options =
        //   activeTabKey === 'saved' ? currentOptions : newProfileOptions

        const options = {
          ...getProfileExportOptions(defaultProfileWithTemplate),
          zoom: initialZoom,
          spread: initialSpread,
        }

        handleCreatePreview(
          templatesData.getSpecificTemplates,
          options,
          getFormatTarget(options.format),
        )
      }
    }
  }, [templatesData, selectedTemplate, bookLoading, error])

  const isbns = (book?.getBook?.podMetadata?.isbns || []).map(item => {
    return { isbn: item?.isbn, label: item?.label }
  })

  const profiles =
    getApplicationParameters &&
    exportsConfig &&
    profilesData?.getBookExportProfiles.result
      .map(p => {
        const luluProfile = p.providerInfo.find(x => x.providerLabel === 'lulu')
        const projectId = luluProfile ? luluProfile.externalProjectId : null

        const luluProjectUrl = projectId
          ? `${getLuluConfigValue('projectBaseUrl')}/${projectId}`
          : null

        const content = []

        if (p.includedComponents.copyright) content.push('includeCopyrights')
        if (p.includedComponents.titlePage) content.push('includeTitlePage')
        if (p.includedComponents.toc) content.push('includeTOC')

        return {
          format: p.format,
          content,
          label: p.displayName,
          lastSynced: luluProfile ? luluProfile.lastSync : null,
          projectId,
          projectUrl: luluProjectUrl,
          size: p.trimSize,
          synced: luluProfile ? luluProfile.inSync : null,
          template: p.templateId,
          value: p.id,
          // Require that p.isbn is a valid option from podMetadata.isbns
          isbn: p.isbn && isbns.find(i => i.isbn === p.isbn) ? p.isbn : null,
          includePdf: p.downloadableAssets?.pdf,
          includeEpub: p.downloadableAssets?.epub,
          pdfProfileId: p.downloadableAssets?.pdfProfileId,
          epubProfileId: p.downloadableAssets?.epubProfileId,
        }
      })
      .filter(p => {
        switch (p.format) {
          case 'pdf':
            return exportsConfig.pdfDownload.enabled
          case 'epub':
            return exportsConfig.epubDownload.enabled
          case 'web':
            return exportsConfig.webPublish.enabled
          default:
            return false
        }
      })

  const allProfiles = profiles // && [defaultProfileWithTemplate, ...profiles]

  const hasContent =
    book?.getBook.divisions.find(d => d?.label === 'Body').bookComponents
      .length > 0

  const userIsOwner = isOwner(bookId, currentUser)
  const userIsAdmin = isAdmin(currentUser)

  const isDownloadButtonDisabled =
    !hasEditAccess(bookId, currentUser) ||
    (!hasContent &&
      (activeTabKey === 'saved'
        ? currentOptions.format === 'epub'
        : newProfileOptions === 'epub'))
  // #endregion data wrangling

  if (
    templatesLoading ||
    profilesLoading ||
    !currentUser ||
    paramsLoading ||
    bookLoading
  ) {
    return <StyledSpin spinning />
  }

  if (!bookLoading && error?.message?.includes('does not exist')) {
    showErrorModal(() => history.push('/dashboard'))
  }

  if (!bookLoading && error?.message?.includes('has been deleted')) {
    showDeletedBookModal(() => history.push('/dashboard'))
  }

  return (
    <Preview
      activeTabKey={activeTabKey}
      canModify={
        luluConfig && !luluConfig?.disabled && (userIsOwner || userIsAdmin)
      }
      canUploadToProvider={userIsOwner}
      connectToLulu={handleConnectToLulu}
      createProfile={handleCreateProfile}
      currentOptions={currentOptions}
      defaultProfile={defaultProfileWithTemplate}
      deleteProfile={handleDeleteProfile}
      download={handleDownload}
      exportsConfig={exportsConfig}
      isbns={isbns}
      isDownloadButtonDisabled={isDownloadButtonDisabled}
      isUserConnectedToLulu={isUserConnectedToLulu}
      loadingExport={false}
      loadingPreview={creatingPreview}
      luluConfig={luluConfig}
      newProfileOptions={newProfileOptions}
      onOptionsChange={handleOptionsChange}
      onProfileChange={handleProfileChange}
      onPublish={handlePublish}
      onUnpulbish={handleUnpulbish}
      previewLink={previewLink}
      profiles={allProfiles}
      publishing={publishing}
      renameProfile={handleRenameProfile}
      selectedProfile={selectedProfile}
      sendToLulu={handleSendToLulu}
      setActiveTabKey={handleTabChange}
      templates={templates}
      updateProfileOptions={handleUpdateProfileOptions}
      webPublishInfo={webPublishInfo}
    />
  )
}

export default PreviewerPage
