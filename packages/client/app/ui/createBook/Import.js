import React, { useState } from 'react'
import { grid } from '@coko/client'
import { InfoCircleFilled } from '@ant-design/icons'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { Button, Upload, Page, Switcher, Stack } from '../common'

const StyledPage = styled(Page)`
  align-items: center;
  padding: ${grid(4)};
`

const Import = ({ onClickContinue, canImport, loading }) => {
  const [filesToImport, setFilesToImport] = useState([])
  const { t } = useTranslation(null, { keyPrefix: 'pages.newBook.importPage' })

  return (
    <StyledPage maxWidth={1200}>
      <Switcher style={{ justifyContent: 'center', maxWidth: '985px' }}>
        <Stack style={{ '--space': '1.5rem' }}>
          <h1>{t('title')}</h1>
          <p>
            {t('info')} <strong>.docx</strong>
          </p>
          <p>
            <InfoCircleFilled /> {t('info.details')}
          </p>
        </Stack>
        <Stack style={{ '--space': '4px', maxWidth: '4850px' }}>
          <Upload
            accept=".docx"
            data-test="import-upload-button"
            disabled={!canImport}
            multiple
            onFilesChange={setFilesToImport}
          />

          <Button
            data-test="import-continue-button"
            disabled={!filesToImport.length || !canImport || loading}
            loading={loading}
            onClick={() => onClickContinue(filesToImport)}
            size="large"
            style={{ marginInlineStart: 'auto' }}
            type="primary"
          >
            {t('continue', { keyPrefix: 'pages.common.actions' })}
          </Button>
        </Stack>
      </Switcher>
    </StyledPage>
  )
}

Import.propTypes = {
  onClickContinue: PropTypes.func.isRequired,
  canImport: PropTypes.bool,
  loading: PropTypes.bool,
}
Import.defaultProps = {
  canImport: false,
  loading: false,
}

export default Import
