/* stylelint-disable declaration-no-important */
/* stylelint-disable string-quotes */
/* stylelint-disable value-list-comma-newline-after */
import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { grid, th } from '@coko/client'
import { Avatar } from 'antd'
import isEmpty from 'lodash/isEmpty'
import { SettingOutlined } from '@ant-design/icons'
import Popup from '@coko/client/dist/ui/common/Popup'
import { useTranslation } from 'react-i18next'
import Button from './Button'
import { LanguageSwitcher } from '../languageSwitcher'

// #region styles
const StyledHeader = styled.header`
  align-items: center;
  background-color: ${th('colorBody')};
  border-bottom: ${th('borderWidth')} ${th('borderStyle')} ${th('colorBorder')};
  display: flex;
  height: 48px;
  justify-content: flex-start;
  padding: ${grid(1)};
  width: 100%;
  z-index: 9;
`

const Navigation = styled.nav`
  align-items: center;
  background-color: ${th('colorBody')};
  display: flex;
  flex-grow: 1;
  height: 100%;
  justify-content: space-between;
`

const LinksContainer = styled.div`
  align-items: stretch;
  display: flex;
  gap: ${grid(6)};
  height: 100%;
  padding-inline: ${grid(2)};
`

const BrandingContainer = styled.div`
  margin-right: ${grid(2)};
`

const UnstyledLink = styled(Link)`
  align-items: center;
  border-radius: ${th('borderRadius')};
  color: inherit;
  display: inline-flex;
  padding: 4px;
  text-decoration: none;

  &:hover,
  &:focus,
  &:active {
    background-color: rgba(105 105 105 / 6%);
    color: inherit;
    text-decoration: none;
  }
`

const BrandLogo = styled.img`
  height: 36px;
`

const BrandLabel = styled.div`
  font-size: ${th('fontSizeLarge')};
  font-weight: bold;
`

const StyledPopup = styled(Popup)`
  border: medium;
  border-radius: 0;
  box-shadow: 0 6px 16px 0 rgb(0 0 0 / 8%), 0 3px 6px -4px rgb(0 0 0 / 12%),
    0 9px 28px 8px rgb(0 0 0 / 5%);
  margin-top: ${grid(3)};
  padding: 5px;

  &::before {
    background-color: inherit;
    clip-path: polygon(50% 0, 100% 100%, 0 100%);
    content: '';
    height: 7px;
    overflow: hidden;
    pointer-events: none;
    position: absolute;
    right: 12px;
    top: -7px;
    width: 16px;
    z-index: 1;
  }
`

const PopupContentWrapper = styled.div`
  display: flex;
  flex-direction: column;

  > * {
    background-color: transparent;
    border: none;
    padding: 5px 12px;

    &:focus,
    &:hover {
      background-color: rgb(105 105 105 / 4%);
      color: inherit !important;
      outline: none;
    }
  }
`
// #endregion styles

const getInitials = fullname => {
  const deconstructName = fullname.split(' ')
  return `${deconstructName[0][0].toUpperCase()}${
    deconstructName[1][0] && deconstructName[1][0].toUpperCase()
  }`
}

const Header = props => {
  const {
    homeURL,
    brandLabel,
    brandLogoURL,
    canAccessAdminPage,
    onLogout,
    onInvite,
    onSettings,
    userDisplayName,
    showDashboard,
    dashboardURL,
    showBackToBook,
    backToBookURL,
    showInvite,
    showPreview,
    showSettings,
    previewURL,
    dropdownItems,
    showAiAssistantLink,
    showKnowledgeBaseLink,
    bookId,
    languages,
    ...rest
  } = props

  const { t } = useTranslation()
  const navItemsLeft = []
  const navItemsRight = []

  if (showDashboard) {
    navItemsLeft.push(
      <UnstyledLink
        data-test="header-dashboard-link"
        key="dashboard"
        to="/dashboard"
      >
        {t('dashboard')}
      </UnstyledLink>,
    )
  }

  if (showBackToBook) {
    navItemsLeft.push(
      <UnstyledLink
        data-test="header-back-link"
        key="back"
        to={`/books/${bookId}/producer`}
      >
        {t('Back to book'.toLowerCase().replace(/ /g, '_'))}
      </UnstyledLink>,
    )
  }

  if (showPreview) {
    navItemsRight.push(
      <UnstyledLink
        data-test="header-preview-link"
        key="preiew"
        to={`/books/${bookId}/exporter`}
      >
        {t('Preview and Publish'.toLowerCase().replace(/ /g, '_'))}
      </UnstyledLink>,
    )
  }

  if (showInvite) {
    navItemsRight.push(
      <Button
        data-test="header-share-btn"
        key="share"
        onClick={onInvite}
        type="text"
      >
        {t('share')}
      </Button>,
    )
  }

  if (showKnowledgeBaseLink) {
    navItemsRight.push(
      <UnstyledLink
        data-test="header-kb-link"
        key="kb"
        to={`/books/${bookId}/knowledge-base`}
      >
        {t('Knowledge Base'.toLowerCase().replace(/ /g, '_'))}
      </UnstyledLink>,
    )
  }

  if (showAiAssistantLink) {
    navItemsRight.push(
      <UnstyledLink
        data-test="header-aiDesigner-link"
        key="ai-designer"
        to={`/books/${bookId}/ai-pdf`}
      >
        {t('AI Book Designer'.toLowerCase().replace(/ /g, '_'))} (Beta)
      </UnstyledLink>,
    )
  }

  if (showSettings) {
    navItemsRight.push(
      <Button
        aria-label="Book settings"
        data-test="header-bookSettings-btn"
        key="settings"
        onClick={onSettings}
        title="Book Settings"
        type="text"
      >
        <SettingOutlined />
      </Button>,
    )
  }

  return (
    <StyledHeader role="banner" {...rest}>
      <BrandingContainer>
        <UnstyledLink data-test="header-logo-link" to={homeURL}>
          {brandLogoURL ? (
            <BrandLogo alt={brandLabel} src={brandLogoURL} />
          ) : (
            <BrandLabel>{brandLabel}</BrandLabel>
          )}
        </UnstyledLink>
      </BrandingContainer>
      <Navigation role="navigation">
        <LinksContainer>
          {!isEmpty(navItemsLeft) && navItemsLeft.map(item => item)}
        </LinksContainer>
        <LinksContainer>
          {!isEmpty(navItemsRight) && navItemsRight.map(item => item)}
          {userDisplayName ? (
            <StyledPopup
              alignment="end"
              position="block-end"
              toggle={
                <Button type="text">
                  <Avatar data-test="avatar-initials">
                    {getInitials(userDisplayName)}
                  </Avatar>
                </Button>
              }
            >
              <PopupContentWrapper>
                <LanguageSwitcher languages={languages} />
                {canAccessAdminPage && (
                  <UnstyledLink
                    data-test="header-admin-link"
                    onClick={() => {
                      document.querySelector('#main-content').focus()
                    }}
                    style={{ justifyContent: 'center', height: '32px' }}
                    to="/admin"
                  >
                    {t('admin')}
                  </UnstyledLink>
                )}
                <Button data-test="logout-button" onClick={onLogout}>
                  {t('logout')}
                </Button>
              </PopupContentWrapper>
            </StyledPopup>
          ) : (
            <LanguageSwitcher languages={languages} />
          )}
        </LinksContainer>
      </Navigation>
    </StyledHeader>
  )
}

Header.propTypes = {
  bookId: PropTypes.string,
  brandLabel: PropTypes.string.isRequired,
  brandLogoURL: PropTypes.string,
  canAccessAdminPage: PropTypes.bool,
  homeURL: PropTypes.string.isRequired,
  userDisplayName: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired,
  showBackToBook: PropTypes.bool.isRequired,
  showDashboard: PropTypes.bool,
  showAiAssistantLink: PropTypes.bool,
  showKnowledgeBaseLink: PropTypes.bool,
  showInvite: PropTypes.bool.isRequired,
  showSettings: PropTypes.bool.isRequired,
  onInvite: PropTypes.func.isRequired,
  onSettings: PropTypes.func.isRequired,
  showPreview: PropTypes.bool.isRequired,
  dashboardURL: PropTypes.string,
  backToBookURL: PropTypes.string,
  previewURL: PropTypes.string,
  dropdownItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
      onClickHandler: PropTypes.func.isRequired,
    }),
  ),
  languages: PropTypes.arrayOf(PropTypes.shape({})),
}

Header.defaultProps = {
  bookId: undefined,
  brandLogoURL: null,
  canAccessAdminPage: false,
  dropdownItems: [],
  dashboardURL: null,
  backToBookURL: null,
  previewURL: null,
  showAiAssistantLink: false,
  showKnowledgeBaseLink: false,
  languages: [],
  showDashboard: true,
}

export default Header
