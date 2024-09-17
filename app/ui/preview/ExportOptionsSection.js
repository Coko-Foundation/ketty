/* eslint-disable react/prop-types */
import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import ExportOption from './ExportOption'
import TemplateList from './TemplateList'
import { Select } from '../common'
import ProfileName from './ProfileName'
import WebDownloadsSelection from './WebDownloadsSelection'

// #region menu options
const exportFormatOptions = [
  {
    value: 'pdf',
    label: 'PDF',
  },
  {
    value: 'epub',
    label: 'EPUB',
  },
  {
    value: 'web',
    label: 'Web',
  },
]

const exportSizeOptions = [
  {
    value: '5.5x8.5',
    label: 'Digest: 5.5 × 8.5 in | 140 × 216 mm',
  },
  {
    value: '6x9',
    label: 'US Trade: 6 × 9 in | 152 × 229 mm',
  },
  {
    value: '8.5x11',
    label: 'US Letter: 8.5 × 11 in | 216 × 279 mm',
  },
]

const makeContentOptions = isEpub => [
  {
    value: 'includeTitlePage',
    label: 'Title page',
  },
  {
    value: 'includeCopyrights',
    label: 'Copyright page',
  },
  {
    value: 'includeTOC',
    label: 'Table of contents',
    disabled: isEpub,
  },
]
// #endregion menu options

// #region styled

const MultiSelect = styled(Select)`
  min-width: 150px;
`
// #endregion styled

const webDownloadOptionsDefault = [
  { label: 'Include PDF', value: 'pdf' },
  { label: 'Include EPUB', value: 'epub' },
]

const ExportOptionsSection = props => {
  const {
    disabled,
    exportsConfig,
    newProfile,
    onChange,
    selectedProfile,
    selectedContent,
    selectedFormat,
    selectedSize,
    selectedTemplate,
    selectedIsbn,
    templates,
    isbns,
    includePdf,
    includeEpub,
    pdfProfileId,
    epubProfileId,
    canModifyProfiles,
    onProfileRename,
    profiles,
  } = props

  const isbnOptions = [
    ...isbns.map((isbnItem, index) => {
      return {
        value: isbnItem.isbn,
        label: isbnItem.label
          ? `${isbnItem.label}: ${isbnItem.isbn}`
          : isbnItem.isbn,
      }
    }),
  ]

  const isPdf = selectedFormat === 'pdf'
  const isEpub = selectedFormat === 'epub'
  const isWeb = selectedFormat === 'web'
  const contentOptions = makeContentOptions(isEpub)
  const contentValue = selectedContent
  if (isEpub && !contentValue.includes('includeTOC'))
    contentValue.push('includeTOC')

  const webDownloadOptions = webDownloadOptionsDefault.filter(
    option =>
      (option.value === 'pdf' && exportsConfig.webPdfDownload?.enabled) ||
      (option.value === 'epub' && exportsConfig.webEpubDownload?.enabled),
  )

  const handleChange = newData => {
    if (disabled) return // handle here to prevent flashing
    onChange(newData)
  }

  const handleSizeChange = value => {
    handleChange({ size: value })
  }

  const handleIsbnChange = value => {
    handleChange({ isbn: value })
  }

  const handleContentChange = value => {
    handleChange({ content: value })
  }

  const handleTemplateClick = value => {
    handleChange({ template: value })
  }

  const handleDownloadOptionsChange = values => {
    handleChange({
      includePdf: values.indexOf('pdf') !== -1,
      includeEpub: values.indexOf('epub') !== -1,
    })
  }

  const handleDownloadableAssetProfileChange = values => {
    handleChange(values)
  }

  return (
    <>
      <div>
        {!newProfile && (
          <>
            <ExportOption inline label="Name">
              <ProfileName
                canModifyProfiles={canModifyProfiles}
                onProfileRename={onProfileRename}
                selectedProfile={selectedProfile}
              />
            </ExportOption>

            <ExportOption inline label="format">
              <span>
                {
                  exportFormatOptions.find(f => f.value === selectedFormat)
                    ?.label
                }
              </span>
            </ExportOption>
          </>
        )}

        {isPdf && (
          <ExportOption inline label="size">
            <Select
              bordered={false}
              onChange={handleSizeChange}
              options={exportSizeOptions}
              value={selectedSize}
            />
          </ExportOption>
        )}

        {isEpub && (
          <ExportOption inline label="ISBN">
            <Select
              allowClear
              bordered={false}
              onChange={handleIsbnChange}
              options={isbnOptions}
              placeholder="No selection"
              style={{ minWidth: '230px' }}
              value={selectedIsbn || null}
            />
          </ExportOption>
        )}

        {(isEpub || isPdf) && (
          <ExportOption inline label="content">
            <MultiSelect
              allowClear
              bordered={false}
              data-test="preview-content"
              mode="multiple"
              onChange={handleContentChange}
              options={contentOptions}
              placeholder="Please select"
              showSearch={false}
              value={selectedContent}
            />
          </ExportOption>
        )}

        {isWeb && webDownloadOptions.length > 0 && (
          <div>
            <WebDownloadsSelection
              includeEpub={includeEpub}
              includePdf={includePdf}
              onDownloadableAssetProfileChange={
                handleDownloadableAssetProfileChange
              }
              onDownloadOptionsChange={handleDownloadOptionsChange}
              profiles={profiles}
              selectedEpubProfileId={epubProfileId}
              selectedPdfProfileId={pdfProfileId}
              webDownloadOptions={webDownloadOptions}
            />
          </div>
        )}
      </div>

      <ExportOption label="templates">
        <TemplateList
          // disabled={disabled}
          onTemplateClick={handleTemplateClick}
          selectedTemplate={selectedTemplate}
          templates={templates}
        />
      </ExportOption>
    </>
  )
}

ExportOptionsSection.propTypes = {
  disabled: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  selectedContent: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedFormat: PropTypes.string.isRequired,
  selectedSize: PropTypes.string,
  selectedIsbn: PropTypes.string,
  selectedTemplate: PropTypes.string,
  templates: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      imageUrl: PropTypes.string,
      name: PropTypes.string.isRequired,
    }),
  ),
  isbns: PropTypes.arrayOf(
    PropTypes.shape({
      isbn: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  newProfile: PropTypes.bool,
  exportsConfig: PropTypes.shape({
    webEpubDownload: PropTypes.shape({
      enabled: PropTypes.bool,
    }),
    webPdfDownload: PropTypes.shape({
      enabled: PropTypes.bool,
    }),
  }),
}

ExportOptionsSection.defaultProps = {
  selectedSize: null,
  selectedIsbn: null,
  selectedTemplate: null,
  templates: [],
  newProfile: false,
  exportsConfig: {
    webEpubDownload: { enabled: true },
    webPdfDownload: { enabled: true },
  },
}

export default ExportOptionsSection
