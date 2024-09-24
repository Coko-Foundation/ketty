/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
import { WarningTwoTone } from '@ant-design/icons'
import styled from 'styled-components'
import { CheckboxGroup, Select, Stack } from '../common'

const StyledSelect = styled(Select)`
  width: 50%;
`

const WebDownloadsSelection = props => {
  const {
    includePdf,
    includeEpub,
    onDownloadOptionsChange,
    onDownloadableAssetProfileChange,
    profiles,
    webDownloadOptions,
    selectedPdfProfileId,
    selectedEpubProfileId,
    previewLoading,
  } = props

  const handleDownloadableAssetProfileChange = (field, value) => {
    onDownloadableAssetProfileChange({
      [field]: value,
    })
  }

  return (
    <Stack style={{ '--space': '1em' }}>
      <div>
        <p>Include the following downloads in your website</p>
        <CheckboxGroup
          defaultValue={[
            ...(includePdf ? ['pdf'] : []),
            ...(includeEpub ? ['epub'] : []),
          ]}
          disabled={previewLoading}
          onChange={onDownloadOptionsChange}
          options={webDownloadOptions}
          vertical
        />
      </div>

      {includePdf && (
        <div>
          {profiles.filter(p => p.format === 'pdf').length > 0 ? (
            <>
              <label htmlFor="pdf-profile">
                Choose a saved PDF profile for the PDF you want to include:
              </label>
              <StyledSelect
                disabled={previewLoading}
                id="pdf-profile"
                onChange={val =>
                  handleDownloadableAssetProfileChange('pdfProfileId', val)
                }
                optionLabelProp="label"
                options={profiles.filter(p => p.format === 'pdf')}
                size="small"
                value={selectedPdfProfileId}
              />
            </>
          ) : (
            <p>
              <WarningTwoTone twoToneColor="red" />
              {'  '}
              You don&apos;t have a saved PDF profile. Please create one in
              order to be able to inlcude a PDF in your website.
            </p>
          )}
        </div>
      )}
      {includeEpub && (
        <div>
          {profiles.filter(p => p.format === 'epub').length > 0 ? (
            <>
              <label htmlFor="epub-profile">
                Choose a saved EPUB profile for the EPUB you want to include
              </label>
              <StyledSelect
                disabled={previewLoading}
                id="epub-profile"
                onChange={val =>
                  handleDownloadableAssetProfileChange('epubProfileId', val)
                }
                optionLabelProp="label"
                options={profiles.filter(p => p.format === 'epub')}
                size="small"
                value={selectedEpubProfileId}
              />
            </>
          ) : (
            <p>
              <WarningTwoTone twoToneColor="red" />
              {'  '}
              You don&apos;t have a saved EPUB profile. Please create one in
              order to be able to inlcude an EPUB in your website.
            </p>
          )}
        </div>
      )}
    </Stack>
  )
}

export default WebDownloadsSelection
