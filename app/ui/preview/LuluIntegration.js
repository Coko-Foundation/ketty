import React from 'react'
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
    projectId,
    projectUrl,
  } = props

  return (
    <Wrapper className={className}>
      <h3 style={{ marginBlockStart: 0 }}>Lulu integration:</h3>
      {!isConnected && canUploadToProvider && (
        <div>
          <Button
            data-test="preview-connectLulu-btn"
            onClick={onClickConnect}
            type="primary"
          >
            Connect to Lulu
          </Button>
        </div>
      )}
      {isConnected && !isInLulu && <p>Not uploaded to Lulu</p>}

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
