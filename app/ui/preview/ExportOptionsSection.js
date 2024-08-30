import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { grid } from '@coko/client'

import ExportOption from './ExportOption'
import TemplateList from './TemplateList'
import { Select } from '../common'

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
// .filter(Boolean)
// #endregion menu options

// #region styled
const Wrapper = styled.div`
  > div:last-child {
    margin-top: ${grid(6)};
  }
`

const MultiSelect = styled(Select)`
  min-width: 150px;
`
// #endregion styled

const ExportOptionsSection = props => {
  const {
    className,
    disabled,
    onChange,
    selectedContent,
    selectedFormat,
    selectedSize,
    selectedTemplate,
    selectedIsbn,
    templates,
    isbns,
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

  const isEpub = selectedFormat === 'epub'
  const contentOptions = makeContentOptions(isEpub)
  const contentValue = selectedContent
  if (isEpub && !contentValue.includes('includeTOC'))
    contentValue.push('includeTOC')

  const handleChange = newData => {
    if (disabled) return // handle here to prevent flashing
    onChange(newData)
  }

  const handleExportFormatChange = value => {
    handleChange({ format: value })
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

  return (
    <Wrapper className={className}>
      <ExportOption inline label="format">
        <Select
          bordered={false}
          // disabled={disabled}
          onChange={handleExportFormatChange}
          options={exportFormatOptions}
          value={selectedFormat}
          data-test="preview-format"
        />
      </ExportOption>

      {!isEpub && (
        <ExportOption inline label="size">
          <Select
            bordered={false}
            // disabled={disabled}
            onChange={handleSizeChange}
            options={exportSizeOptions}
            value={selectedSize}
            data-test="preview-size"
          />
        </ExportOption>
      )}

      {isEpub && (
        <ExportOption inline label="ISBN">
          <Select
            allowClear
            bordered={false}
            // disabled={disabled}
            onChange={handleIsbnChange}
            options={isbnOptions}
            placeholder="No selection"
            style={{ minWidth: '230px' }}
            value={selectedIsbn || null}
          />
        </ExportOption>
      )}

      <ExportOption inline label="content">
        <MultiSelect
          allowClear
          bordered={false}
          // disabled={disabled}
          mode="multiple"
          onChange={handleContentChange}
          options={contentOptions}
          placeholder="Please select"
          showSearch={false}
          value={selectedContent}
          data-test="preview-content"
        />
      </ExportOption>

      <ExportOption label="templates">
        <TemplateList
          // disabled={disabled}
          onTemplateClick={handleTemplateClick}
          selectedTemplate={selectedTemplate}
          templates={templates}
        />
      </ExportOption>
    </Wrapper>
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
}

ExportOptionsSection.defaultProps = {
  selectedSize: null,
  selectedIsbn: null,
  selectedTemplate: null,
  templates: [],
}

export default ExportOptionsSection
