/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
import { WarningTwoTone } from '@ant-design/icons'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
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

  const { t } = useTranslation()

  return (
    <Stack style={{ '--space': '1em' }}>
      <div>
        <p>{t('include_downloads')}</p>
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
              <label htmlFor="pdf-profile">{t('select_pdf_profile')}:</label>
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
              {t('no_saved_pdf_profile')}
            </p>
          )}
        </div>
      )}
      {includeEpub && (
        <div>
          {profiles.filter(p => p.format === 'epub').length > 0 ? (
            <>
              <label htmlFor="epub-profile">{t('select_epub_profile')}:</label>
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
              {t('no_saved_epub_profile')}
            </p>
          )}
        </div>
      )}
    </Stack>
  )
}

export default WebDownloadsSelection
