import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { grid } from '@coko/client'

import { Button, ButtonGroup } from '../common'
import Synced from './Synced'
import ExportOption from './ExportOption'

const Wrapper = styled.div``

const ConnectedWrapper = styled.div`
  display: flex;
  flex-direction: column;

  > div:not(:last-child) {
    margin-bottom: ${grid(2)};
  }

  > div:not(:first-child) {
    margin-left: 26px;
  }
`

const StyledButtonGroup = styled(ButtonGroup)`
  margin-top: ${grid(5)};
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
    onClickSendToLulu,
    projectId,
    projectUrl,
  } = props

  const [isUploading, setUploading] = useState(false)

  const handleClickSendToLulu = () => {
    setUploading(true)

    onClickSendToLulu().finally(() => {
      setUploading(false)
    })
  }

  return (
    <Wrapper className={className}>
      {!isConnected && canUploadToProvider && (
        <div>
          <Button
            onClick={onClickConnect}
            type="primary"
            data-test="preview-connectLulu-btn"
          >
            Connect to Lulu
          </Button>
        </div>
      )}

      {isConnected && !isInLulu && canUploadToProvider && (
        <div>
          <Button
            disabled={isUploading}
            loading={isUploading}
            onClick={handleClickSendToLulu}
            type="primary"
          >
            Upload to Lulu
          </Button>
        </div>
      )}

      {isConnected && isInLulu && (
        <ConnectedWrapper>
          <Synced isSynced={isSynced} lastSynced={lastSynced} />

          <ExportOption inline label="Project ID">
            {projectId}
          </ExportOption>

          <StyledButtonGroup>
            <Button disabled={!projectUrl}>
              <a href={projectUrl} rel="noreferrer" target="_blank">
                Open lulu project
              </a>
            </Button>

            {!isSynced && (
              <Button
                disabled={isUploading}
                loading={isUploading}
                onClick={handleClickSendToLulu}
                type="primary"
              >
                Sync with lulu
              </Button>
            )}
          </StyledButtonGroup>
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
  onClickSendToLulu: PropTypes.func.isRequired,
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
