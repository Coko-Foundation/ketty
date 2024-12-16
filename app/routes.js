/* stylelint-disable no-descending-specificity */

import React, { useState, useEffect, Suspense } from 'react'
import { Modal, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { useApolloClient, useQuery } from '@apollo/client'
import { Route, Switch, useHistory, Redirect } from 'react-router-dom'
import styled, { createGlobalStyle } from 'styled-components'
import { useTranslation } from 'react-i18next'

import {
  Authenticate,
  PageLayout as Page,
  RequireAuth,
  grid,
  th,
  useCurrentUser,
  ProviderConnectionPage,
} from '@coko/client'

import { CURRENT_USER } from '@coko/client/dist/helpers/currentUserQuery'
import { isAdmin, hasEditAccess } from './helpers/permissions'
import Header from './ui/common/Header'

import UserInviteModal from './ui/invite/UserInviteModal'
import SettingsModal from './ui/settings/SettingsModal'

import {
  BookTitlePage,
  DashboardPage,
  ImportPage,
  LoginPage,
  ProducerPage,
  ExporterPage,
  RequestPasswordResetPage,
  RequestVerificationEmailPage,
  UnverifiedUserPage,
  ResetPasswordPage,
  SignupPage,
  VerifyEmailPage,
  AiPDFDesignerPage,
  AdminPage,
  CreateBook,
  KnowledgeBasePage,
} from './pages'

import { GET_BOOK_SETTINGS, APPLICATION_PARAMETERS } from './graphql'
import { CssAssistantProvider } from './ui/AiPDFDesigner/hooks/CssAssistantContext'
import { GlobalContextProvider } from './helpers/hooks/GlobalContext'

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const GlobalStyle = createGlobalStyle`
  #root {
    > div.ant-spin-nested-loading {
      height: 100%;

      > div.ant-spin-container {
        height: 100%;
      }
    }

    *:not([contenteditable="true"]) {
      &:focus {
        outline: none;
      }

      &:focus-visible:not(#ai-overlay input) {
        outline: 2px solid ${th('colorOutline')};
      }
    }
  }

  .ant-modal-confirm-content {
    /* stylelint-disable-next-line declaration-no-important */
    max-width: 100% !important;
  }
`

const Wrapper = props => {
  const { children } = props

  return <LayoutWrapper>{children}</LayoutWrapper>
}

const StyledPage = styled(Page)`
  height: calc(100% - 48px);

  > div {
    padding: 0;
  }
`

const ModalHeader = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-start;
`

const ModalTitle = styled.h4`
  font-size: ${th('fontSizeLarge')};
  margin: 0 ${grid(1)} 0 0;
`

const SiteHeader = () => {
  const { currentUser, setCurrentUser } = useCurrentUser()
  const [modal, contextHolder] = Modal.useModal()
  const client = useApolloClient()
  const history = useHistory()
  const { t } = useTranslation(null, { keyPrefix: 'pages.common.header' })
  const [currentPath, setCurrentPath] = useState(history.location.pathname)

  useEffect(() => {
    const unlisten = history.listen(val => setCurrentPath(val.pathname))

    return unlisten
  }, [])

  const logout = () => {
    setCurrentUser(null)
    client.cache.reset()
    localStorage.removeItem('token')
    history.push('/login')
  }

  const getBookId = () => {
    return currentPath.split('/')[2]
  }

  // This can be placed in a custom hook
  const { data: bookQueryData, refetch: refetchBookSettings } = useQuery(
    GET_BOOK_SETTINGS,
    {
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'network-only',
      variables: {
        id: getBookId(),
      },
      skip: !getBookId(),
    },
  )

  const { data: applicationParametersData } = useQuery(APPLICATION_PARAMETERS, {
    fetchPolicy: 'network-only',
  })

  const isAIEnabled = applicationParametersData?.getApplicationParameters.find(
    c => c.area === 'aiEnabled',
  )

  const languages = applicationParametersData?.getApplicationParameters.find(
    c => c.area === 'languages',
  )

  const triggerInviteModal = () => {
    const inviteModal = modal.confirm()
    return inviteModal.update({
      title: (
        <ModalHeader>
          <ModalTitle>{t('shareModal.title')}</ModalTitle>
          <Tooltip
            arrow={false}
            color="black"
            overlayInnerStyle={{ width: '480px' }}
            placement="right"
            title={t('shareModal.info')}
          >
            <QuestionCircleOutlined />
          </Tooltip>
        </ModalHeader>
      ),
      content: (
        <UserInviteModal
          bookId={isProducerPage || isExporterPage ? getBookId() : undefined}
        />
      ),
      maskClosable: true,
      width: 680,
      bodyStyle: {
        textAlign: 'justify',
      },
      closable: true,
      icon: null,
      footer: null,
    })
  }

  const triggerSettingsModal = () => {
    const settingsModal = modal.confirm()
    return settingsModal.update({
      title: (
        <ModalHeader>
          <ModalTitle>{t('bookSettingsModal.title')}</ModalTitle>
        </ModalHeader>
      ),
      content: (
        <SettingsModal
          bookId={isProducerPage || isExporterPage ? getBookId() : undefined}
          bookSettings={bookQueryData?.getBook.bookSettings}
          closeModal={() => settingsModal.destroy()}
          refetchBookSettings={refetchBookSettings}
        />
      ),
      maskClosable: false,
      width: 680,
      bodyStyle: {
        textAlign: 'justify',
      },
      closable: true,
      icon: null,
      footer: null,
    })
  }

  const isProducerPage = currentPath.includes('/producer')
  const isExporterPage = currentPath.includes('/exporter')
  const isAiAssistantPage = currentPath.includes('/ai-pdf')
  const isKnowledgeBasePage = currentPath.includes('/knowledge-base')
  const canEdit = currentUser && hasEditAccess(getBookId(), currentUser)

  return (
    <>
      <Header
        bookId={getBookId()}
        brandLabel="Lulu"
        brandLogoURL="/ketida.png"
        canAccessAdminPage={currentUser ? isAdmin(currentUser) : false}
        homeURL="/dashboard"
        languages={languages?.config.filter(l => l.enabled)}
        onInvite={triggerInviteModal}
        onLogout={logout}
        onSettings={triggerSettingsModal}
        showAiAssistantLink={
          canEdit &&
          isAIEnabled?.config &&
          bookQueryData?.getBook.bookSettings.aiPdfDesignerOn &&
          isProducerPage
        }
        showBackToBook={
          isExporterPage || isAiAssistantPage || isKnowledgeBasePage
        }
        showDashboard={currentUser && currentPath !== '/dashboard'}
        showInvite={isProducerPage}
        showKnowledgeBaseLink={
          canEdit &&
          isAIEnabled?.config &&
          bookQueryData?.getBook.bookSettings.knowledgeBaseOn &&
          isProducerPage
        }
        showPreview={isProducerPage}
        showSettings={isProducerPage && canEdit && isAIEnabled?.config}
        userDisplayName={currentUser ? currentUser.displayName : ''}
      />
      {contextHolder}
    </>
  )
}

const StyledMain = styled.main`
  height: 100%;
`

const RequireVerifiedUser = ({ children }) => {
  const { currentUser } = useCurrentUser()

  if (!currentUser) return <Redirect to="/login" />

  if (!currentUser.isActive || !currentUser.defaultIdentity.isVerified) {
    return <Redirect to="/unverified-user" />
  }

  return children
}

const Authenticated = ({ children }) => {
  return (
    <RequireAuth notAuthenticatedRedirectTo="/login">
      <RequireVerifiedUser>{children}</RequireVerifiedUser>
    </RequireAuth>
  )
}

const routes = (
  <Authenticate currentUserQuery={CURRENT_USER}>
    <GlobalStyle />
    <LayoutWrapper>
      <Wrapper>
        <Suspense fallback={<div>Loading...</div>}>
          <SiteHeader />
          <StyledPage fadeInPages>
            <StyledMain id="main-content" tabIndex="-1">
              <GlobalContextProvider>
                <Switch>
                  <Redirect exact path="/" to="/dashboard" />

                  <Route component={SignupPage} exact path="/signup" />
                  <Route component={LoginPage} exact path="/login" />

                  <Route
                    component={RequestPasswordResetPage}
                    exact
                    path="/request-password-reset"
                  />
                  <Route
                    component={ResetPasswordPage}
                    exact
                    path="/password-reset/:token"
                  />
                  <Route
                    component={VerifyEmailPage}
                    exact
                    path="/email-verification/:token"
                  />
                  <Route
                    component={UnverifiedUserPage}
                    exact
                    path="/unverified-user/"
                  />
                  <Route
                    component={RequestVerificationEmailPage}
                    exact
                    path="/request-verification-email/"
                  />
                  <Route
                    exact
                    path="/dashboard"
                    render={() => (
                      <Authenticated>
                        <DashboardPage />
                      </Authenticated>
                    )}
                  />
                  <Route
                    exact
                    path="/create-book"
                    render={() => (
                      <Authenticated>
                        <CreateBook />
                      </Authenticated>
                    )}
                  />
                  <Route
                    exact
                    path="/books/:bookId/rename"
                    render={() => (
                      <Authenticated>
                        <BookTitlePage />
                      </Authenticated>
                    )}
                  />
                  <Route
                    exact
                    path="/books/:bookId/import"
                    render={() => (
                      <Authenticated>
                        <ImportPage />
                      </Authenticated>
                    )}
                  />
                  <Route
                    exact
                    path="/books/:bookId/producer"
                    render={() => (
                      <Authenticated>
                        <ProducerPage />
                      </Authenticated>
                    )}
                  />

                  <Route exact path="/books/:bookId/exporter">
                    <Authenticated>
                      <ExporterPage />
                    </Authenticated>
                  </Route>

                  <Route exact path="/books/:bookId/ai-pdf">
                    <Authenticated>
                      <CssAssistantProvider>
                        <AiPDFDesignerPage />
                      </CssAssistantProvider>
                    </Authenticated>
                  </Route>

                  <Route exact path="/books/:bookId/knowledge-base">
                    <Authenticated>
                      <KnowledgeBasePage />
                    </Authenticated>
                  </Route>

                  <Route exact path="/provider-redirect/:provider">
                    <ProviderConnectionPage closeOnSuccess />
                  </Route>

                  <Route exact path="/admin">
                    <Authenticated>
                      <AdminPage />
                    </Authenticated>
                  </Route>
                </Switch>
              </GlobalContextProvider>
            </StyledMain>
          </StyledPage>
        </Suspense>
      </Wrapper>
    </LayoutWrapper>
  </Authenticate>
)

export default routes
