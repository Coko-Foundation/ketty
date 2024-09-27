/* eslint-disable react/prop-types */
import React from 'react'
import { Stack, Select } from '../common'
import ExportOptionsSection from './ExportOptionsSection'
import Footer from './Footer'

const allExportOptions = [
  { label: 'PDF', value: 'pdf' },
  { label: 'EPUB', value: 'epub' },
  { label: 'Web', value: 'web' },
]

const NewProfileTab = props => {
  const {
    newProfileOptions,
    handleFormatChange,
    canModify,
    hasChanges,
    hasCover,
    optionsDisabled,
    isbns,
    handleOptionsChange,
    templates,
    createProfile,
    isDownloadButtonDisabled,
    isNewProfileSelected,
    loadingPreview,
    onClickDownload,
    updateProfileOptions,
    exportsConfig,
    profiles,
  } = props

  const exportOptions = allExportOptions.filter(option => {
    const configEntry = Object.entries(exportsConfig).find(([k, v]) =>
      k.startsWith(option.value),
    )

    return configEntry[1].enabled
  })

  return (
    <>
      <Stack style={{ '--space': '10px' }}>
        <Select
          disabled={loadingPreview}
          onChange={handleFormatChange}
          options={exportOptions}
          value={newProfileOptions.format}
        />
      </Stack>

      <ExportOptionsSection
        disabled={optionsDisabled}
        exportsConfig={exportsConfig}
        hasCover={hasCover}
        includeEpub={newProfileOptions.includeEpub}
        includePdf={newProfileOptions.includePdf}
        isbns={isbns}
        newProfile
        onChange={handleOptionsChange}
        previewLoading={loadingPreview}
        profiles={profiles}
        selectedContent={newProfileOptions.content}
        selectedFormat={newProfileOptions.format}
        selectedIsbn={newProfileOptions.isbn}
        selectedSize={newProfileOptions.size}
        selectedTemplate={newProfileOptions.template}
        templates={templates}
      />

      <Footer
        canModify={canModify}
        createProfile={createProfile}
        isDownloadButtonDisabled={isDownloadButtonDisabled}
        isNewProfileSelected
        isSaveDisabled={
          !canModify || loadingPreview || (!isNewProfileSelected && !hasChanges)
        }
        loadingPreview={loadingPreview}
        onClickDownload={onClickDownload}
        selectedFormat={newProfileOptions.format}
        updateProfile={updateProfileOptions}
      />
    </>
  )
}

export default NewProfileTab
