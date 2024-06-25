import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { grid, th } from '@coko/client'
import {
  TeamOutlined,
  EyeOutlined,
  SettingOutlined,
  SnippetsOutlined,
  ReadOutlined,
  FormatPainterOutlined,
} from '@ant-design/icons'
import BookPanel from './BookPanel'
import Cluster from '../common/styledPrimitives/Cluster'

const Wrapper = styled.aside`
  border-right: ${th('borderWidth')} ${th('borderStyle')} ${th('colorBorder')};
  padding: 0;
  width: 32%;

  @media (min-width: 1200px) {
    flex: 0 0 49ch;
  }
`

const BookMenu = styled(Cluster)`
  margin-block: ${grid(3)};
  padding: ${grid(2)};
`

const StyledLink = styled(Link)`
  /* background-color: rgb(246 171 27); */
  border: 1px solid rgb(231 229 25);
  box-shadow: rgb(231 229 25) 2px 2px 2px;
  /* color: ${th('colorText')}; */
  color: #444;
  font-size: 20px;
  font-weight: bold;
  padding: ${grid(1)} ${grid(2)};

  &:hover {
    color: ${th('colorText')};
  }
`

const Sidebar = props => {
  const { id, page } = props

  return (
    <Wrapper>
      <BookMenu>
        {page === 'producer' ? (
          <>
            <StyledLink to={`/books/${id}/metadata`}>
              <SnippetsOutlined />
            </StyledLink>
            <StyledLink to={`/books/${id}/exporter`}>
              <EyeOutlined />
            </StyledLink>
            <StyledLink to={`/books/${id}/share`}>
              <TeamOutlined />
            </StyledLink>
            <StyledLink to={`/books/${id}/settings`}>
              <SettingOutlined />{' '}
            </StyledLink>
            <StyledLink to={`/books/${id}/knowledge-base`}>
              <ReadOutlined />
            </StyledLink>
            <StyledLink to={`/books/${id}/ai-pdf`}>
              <FormatPainterOutlined />
            </StyledLink>
          </>
        ) : (
          <StyledLink to={`/books/${id}/producer`}>Back to editor</StyledLink>
        )}
      </BookMenu>
      {page === 'producer' && <BookPanel {...props} />}
    </Wrapper>
  )
}

Sidebar.propTypes = {
  id: PropTypes.string,
  page: PropTypes.string,
}

Sidebar.defaultProps = {
  id: null,
  page: null,
}

export default Sidebar
