import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { grid } from '@coko/client'
import { t } from 'i18next'

import { Button } from '../common'
import Synced from './Synced'
import ExportOption from './ExportOption'

const Wrapper = styled.div``

const ConnectedWrapper = styled.div`
  display: flex;
  flex-direction: column;

  > div:not(:last-child) {
    margin-bottom: ${grid(2)};
  }

  > :not(:first-child) {
    margin-left: 26px;
  }
`

const StyledButton = styled(Button)`
  margin-top: ${grid(5)};
  width: fit-content;
`

const LuluIntegration = props => {
  const {
    canUploadToProvider,
    className,
    isConnected,
    isInLulu,
    isSynced,
    lastSynced,
    onClickConnect,
    projectId,
    projectUrl,
  } = props

  return (
    <Wrapper className={className}>
      <h3 style={{ marginBlockStart: 0 }}>{t('lulu_integration')}:</h3>
      {!isConnected && canUploadToProvider && (
        <div>
          <Button
            data-test="preview-connectLulu-btn"
            onClick={onClickConnect}
            type="primary"
          >
            {t('lulu_connect')}
          </Button>
        </div>
      )}
      {isConnected && !isInLulu && <p>{t('lulu_not_uploaded')}</p>}

      {isConnected && isInLulu && (
        <ConnectedWrapper>
          <Synced isSynced={isSynced} lastSynced={lastSynced} />

          <ExportOption inline label={t('lulu_project_id')}>
            {projectId}
          </ExportOption>

          <StyledButton
            disabled={!projectUrl}
            onClick={() => window.open(projectUrl, '_blank', 'noreferrer')}
          >
            {t('lulu_open_project')}
          </StyledButton>
        </ConnectedWrapper>
      )}
    </Wrapper>
  )
}

LuluIntegration.propTypes = {
  canUploadToProvider: PropTypes.bool.isRequired,
  /** Is the export profile uploaded to a lulu project */
  isConnected: PropTypes.bool.isRequired,
  /** Has the project been pushed to lulu at all */
  isInLulu: PropTypes.bool,
  /** Is the lulu account connecteed */
  isSynced: PropTypes.bool,
  lastSynced: PropTypes.string,
  onClickConnect: PropTypes.func.isRequired,
  projectId: PropTypes.string,
  projectUrl: PropTypes.string,
}

LuluIntegration.defaultProps = {
  isInLulu: false,
  isSynced: false,
  lastSynced: null,
  projectId: null,
  projectUrl: null,
}

export default LuluIntegration
