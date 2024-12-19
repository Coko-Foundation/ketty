import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Button } from '../common'

const TemplateDetailsWrapper = styled.div`
  padding-inline: clamp(0rem, -1.0435rem + 5.2174vw, 3rem);
`

const TemplateInner = styled.div`
  display: grid;
  gap: clamp(0.25rem, -0.0109rem + 1.3043vw, 1rem);
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
`

const TemplateActions = styled.div`
  align-items: center;
  display: flex;
  gap: clamp(0.25rem, -0.0109rem + 1.3043vw, 1rem);
`

const StyledP = styled.p`
  max-width: 60ch;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const targetOptions = {
  pagedjs: 'PDF (pagedjs)',
  epub: 'EPUB',
  web: 'Web',
}

const TemplateDetails = props => {
  const {
    record: {
      name,
      author,
      url,
      formats,
      enabled,
      enable,
      disable,
      canBeDeleted,
      deleteTemplate,
    },
  } = props

  return (
    <TemplateDetailsWrapper>
      <TemplateInner>
        <div>
          <p>
            <strong>Name: </strong> {name}
          </p>
          <p>
            <strong>Author: </strong> {author}
          </p>
          <StyledP>
            <strong>URL: </strong>
            <a href={url} rel="noreferrer" target="_blank">
              {url}
            </a>
          </StyledP>
        </div>
        <div>
          <p>
            <strong id={`${name}-template-list`}>Available formats:</strong>
          </p>
          <ul aria-labelledby={`${name}-template-list`}>
            {formats.map(t => (
              <li key={t.id}>
                {targetOptions[t.target]}
                {t.target === 'pagedjs' && `, dimensions ${t.trimSize}`}
              </li>
            ))}
          </ul>
        </div>
      </TemplateInner>
      <TemplateActions>
        {enabled ? (
          <Button onClick={disable} status="danger">
            Disable
          </Button>
        ) : (
          <Button onClick={enable} status="success">
            Enable
          </Button>
        )}
        {canBeDeleted ? (
          <Button onClick={deleteTemplate} status="danger">
            Delete template
          </Button>
        ) : (
          <span>This template cannot be deleted</span>
        )}
      </TemplateActions>
    </TemplateDetailsWrapper>
  )
}

TemplateDetails.propTypes = {
  record: PropTypes.shape({
    name: PropTypes.string,
    author: PropTypes.string,
    url: PropTypes.string,
    formats: PropTypes.arrayOf(PropTypes.shape()),
    enabled: PropTypes.bool,
    enable: PropTypes.func,
    disable: PropTypes.func,
    canBeDeleted: PropTypes.bool,
    deleteTemplate: PropTypes.func,
  }),
}

TemplateDetails.defaultProps = {
  record: {},
}

export default TemplateDetails
