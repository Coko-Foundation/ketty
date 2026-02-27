/* stylelint-disable declaration-no-important */
/* stylelint-disable string-quotes */
/* stylelint-disable value-list-comma-newline-after */
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { grid, th } from '@coko/client'
import { Avatar } from 'antd'
import { useTranslation } from 'react-i18next'
import Popup from './Popup'
import Button from './Button'
import { SunOutlined, MoonOutlined } from './icons'
import { LanguageSwitcher } from '../languageSwitcher'
import { getInitials, themeInitializer } from '../../utils'

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
  z-index: 1001;
`

const Navigation = styled.nav`
  align-items: center;
  background-color: ${th('colorBody')};
  display: flex;
  height: 100%;
  justify-content: space-between;
  width: calc(100vw - 56px);
`

const BookTitle = styled.h1`
  flex-grow: 1;
  font-size: ${th('fontSizeLarge')};
  font-weight: bold;
  overflow: hidden;
  padding: ${grid(2)};
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;

  &[data-pad-left='true'] {
    padding-inline-start: 90px;
  }
`

const BrandingContainer = styled.div`
  margin-right: ${grid(2)};
`

const UnstyledLink = styled(Link)`
  align-items: center;
  border-radius: ${th('borderRadius')};
  color: inherit;
  display: inline-flex;
  justify-content: center;
  min-block-size: 32px;
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
  border-radius: ${th('borderRadius')};
  height: 36px;
`

const BrandLabel = styled.div`
  font-size: ${th('fontSizeLarge')};
  font-weight: bold;
`

const StyledPopup = styled(Popup)`
  border: 1px solid ${th('colorBorder')};
  border-block-start: none;
  box-shadow: 0 6px 16px 0 rgb(0 0 0 / 8%), 0 3px 6px -4px rgb(0 0 0 / 12%),
    0 9px 28px 8px rgb(0 0 0 / 5%);
  inline-size: 170px;
  margin-top: ${grid(1)};
  padding: 5px;

  &::before,
  &::after {
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

  &::before {
    background-color: ${th('colorBorder')};
    top: -8px;
  }
`

const StyledAvatar = styled(Avatar)`
  background-color: ${th('colorPrimary')};
  color: ${th('colorTextReverse')};
  font-weight: bold;
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

const ThemeButton = styled(Button)`
  align-items: center;
  display: flex;
  flex-direction: row-reverse;
  gap: ${grid(2)};
  justify-content: center;
`
// #endregion styles

const Header = props => {
  const {
    brandLabel,
    brandLogoURL,
    homeURL,
    profileURL,
    adminURL,
    templatesURL,
    usersManagerUrl,
    canAccessAdminPage,
    onLogout,
    user,
    showDashboard,
    showBackToBook,
    dropdownItems,
    bookId,
    languages,
    bookTitle,
    ...rest
  } = props

  const { t } = useTranslation(null, {
    keyPrefix: 'pages.common.header.menu.options',
  })

  const userAvatar = user?.avatar?.url
  const userAvatarAlt = user?.avatar?.alt
  const userDisplayName = user?.displayName

  const navItemsLeft = []

  if (showBackToBook) {
    navItemsLeft.push(
      <UnstyledLink
        data-test="header-back-link"
        key="back"
        style={{ position: 'absolute' }}
        to={`/books/${bookId}/producer`}
      >
        {t('backToBook')}
      </UnstyledLink>,
    )
  }

  const [theme, setTheme] = useState(themeInitializer())

  useEffect(() => {
    const themeUpdateListener = event => {
      const { key, newValue } = event

      if (key === 'ketty-theme') {
        setTheme(newValue)
      }
    }

    window.addEventListener('storage', themeUpdateListener)

    return () => window.removeEventListener('storage', themeUpdateListener)
  }, [])

  useEffect(() => {
    const focusUpdateOnNavLinkClick = () => {
      document.querySelector('#main-content').focus()
    }

    document.querySelectorAll('#user-menu a[href]').forEach(link => {
      link.addEventListener('click', focusUpdateOnNavLinkClick)
    })

    return () =>
      document.querySelectorAll('#user-menu a[href]').forEach(link => {
        link.removeEventListener('click', focusUpdateOnNavLinkClick)
      })
  }, [])

  const changeTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('ketty-theme', newTheme)

    window.dispatchEvent(
      new CustomEvent('themeUpdate', {
        detail: { 'ketty-theme': newTheme },
      }),
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
        {navItemsLeft.map(el => el)}
        {bookTitle ? (
          <BookTitle data-pad-left={showBackToBook}>{bookTitle}</BookTitle>
        ) : (
          <p />
        )}
        {user ? (
          <StyledPopup
            alignment="end"
            id="user-menu"
            position="block-end"
            toggle={
              <Button type="text">
                <StyledAvatar
                  alt={userAvatarAlt || 'User avatar'}
                  data-test="avatar-initials"
                  shape="square"
                  src={userAvatar}
                >
                  {getInitials(userDisplayName)}
                </StyledAvatar>
              </Button>
            }
          >
            <PopupContentWrapper>
              <LanguageSwitcher languages={languages} />
              <UnstyledLink to={homeURL}>{t('dashboard')}</UnstyledLink>
              <UnstyledLink to={profileURL}>{t('profile')}</UnstyledLink>
              {canAccessAdminPage && (
                <>
                  <UnstyledLink
                    data-test="header-users-link"
                    to={usersManagerUrl}
                  >
                    {t('users')}
                  </UnstyledLink>

                  <UnstyledLink data-test="header-admin-link" to={adminURL}>
                    {t('admin')}
                  </UnstyledLink>
                  <UnstyledLink
                    data-test="header-template-link"
                    to={templatesURL}
                  >
                    {t('templates')}
                  </UnstyledLink>
                </>
              )}

              <ThemeButton
                icon={theme === 'dark' ? <MoonOutlined /> : <SunOutlined />}
                onClick={changeTheme}
              >
                Theme
              </ThemeButton>

              <Button data-test="logout-button" onClick={onLogout}>
                {t('logout')}
              </Button>
            </PopupContentWrapper>
          </StyledPopup>
        ) : (
          <LanguageSwitcher languages={languages} />
        )}
      </Navigation>
    </StyledHeader>
  )
}

Header.propTypes = {
  bookId: PropTypes.string,
  brandLabel: PropTypes.string.isRequired,
  brandLogoURL: PropTypes.string,
  canAccessAdminPage: PropTypes.bool,
  homeURL: PropTypes.string,
  profileURL: PropTypes.string,
  usersManagerUrl: PropTypes.string,
  adminURL: PropTypes.string,
  templatesURL: PropTypes.string,
  onLogout: PropTypes.func.isRequired,
  showBackToBook: PropTypes.bool.isRequired,
  showDashboard: PropTypes.bool,
  bookTitle: PropTypes.string,
  dropdownItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
      onClickHandler: PropTypes.func.isRequired,
    }),
  ),
  languages: PropTypes.arrayOf(PropTypes.shape({})),
  user: PropTypes.shape(),
}

Header.defaultProps = {
  bookId: undefined,
  brandLogoURL: null,
  canAccessAdminPage: false,
  dropdownItems: [],
  homeURL: '/books',
  profileURL: '/profile',
  usersManagerUrl: '/users-manager',
  adminURL: '/admin',
  templatesURL: '/template-manager',
  languages: [],
  showDashboard: true,
  bookTitle: '',
  user: null,
}

export default Header
