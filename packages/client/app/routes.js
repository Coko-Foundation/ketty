/* stylelint-disable no-descending-specificity */

import React, { useState, useEffect, Suspense } from 'react'
import { useApolloClient, useQuery } from '@apollo/client'
import { Route, Switch, useHistory, Redirect } from 'react-router-dom'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import {
  Authenticate,
  PageLayout as Page,
  RequireAuth,
  useCurrentUser,
  ProviderConnectionPage,
} from '@coko/client'

// import theme from './theme'
import { isAdmin } from './helpers/permissions'
import Header from './ui/common/Header'

import {
  BookTitlePage,
  BooksPage,
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
  TemplateMananger,
  Profile,
  Users,
  InvitationAccountSetup,
  A11yStatement,
} from './pages'

import { GET_BOOK, APPLICATION_PARAMETERS, CURRENT_USER } from './graphql'
import { CssAssistantProvider } from './ui/AiPDFDesigner/hooks/CssAssistantContext'
import { GlobalContextProvider } from './helpers/hooks/GlobalContext'
import { YjsProvider } from './ui/provider-yjs/YjsProvider'
import GlobalStyles from './globalStyles'

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
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

const StyledMain = styled.main`
  height: 100%;
  position: relative;
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

const SiteHeader = () => {
  const { currentUser, setCurrentUser } = useCurrentUser()
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

  const { data: getBook } = useQuery(GET_BOOK, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'network-only',
    variables: {
      id: getBookId(),
    },
    skip: !getBookId(),
  })

  const { data: applicationParametersData } = useQuery(APPLICATION_PARAMETERS, {
    fetchPolicy: 'network-only',
    variables: {
      context: 'bookBuilder',
      area: 'languages',
    },
  })

  const languages = applicationParametersData?.getApplicationParameters.find(
    c => c.area === 'languages',
  )

  const isExporterPage = currentPath.includes('/exporter')
  const isAiAssistantPage = currentPath.includes('/ai-pdf')
  const isKnowledgeBasePage = currentPath.includes('/knowledge-base')

  const bookTitle =
    getBook?.getBook.title !== undefined
      ? getBook?.getBook.title ||
        t('untitledBook', { keyPrefix: 'pages.producer' })
      : ''

  return (
    <Header
      bookId={getBookId()}
      bookTitle={bookTitle}
      brandLabel="Ketty"
      brandLogoURL="/ketida.png"
      canAccessAdminPage={currentUser ? isAdmin(currentUser) : false}
      homeURL="/books"
      languages={languages?.config.filter(l => l.enabled)}
      onLogout={logout}
      profileURL="/profile"
      showBackToBook={
        isExporterPage || isAiAssistantPage || isKnowledgeBasePage
      }
      user={currentUser}
    />
  )
}

const routes = (
  <Authenticate currentUserQuery={CURRENT_USER}>
    <GlobalStyles />
    <LayoutWrapper>
      <Wrapper>
        <Suspense fallback={<div>Loading...</div>}>
          <SiteHeader />
          <StyledPage fadeInPages>
            <StyledMain id="main-content" tabIndex="-1">
              <GlobalContextProvider>
                <YjsProvider>
                  <Switch>
                    <Redirect exact path="/" to="/books" />
                    <Redirect exact path="/dashboard" to="/books" />

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
                      path="/books"
                      render={() => (
                        <Authenticated>
                          <BooksPage />
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
                    <Route exact path="/template-manager">
                      <Authenticated>
                        <TemplateMananger />
                      </Authenticated>
                    </Route>
                    <Route exact path="/profile">
                      <Authenticated>
                        <Profile />
                      </Authenticated>
                    </Route>
                    <Route exact path="/users-manager">
                      <Authenticated>
                        <Users />
                      </Authenticated>
                    </Route>
                    <Route
                      component={InvitationAccountSetup}
                      exact
                      path="/invitation/:token"
                    />
                    <Route
                      component={A11yStatement}
                      exact
                      path="/accessibility"
                    />
                  </Switch>
                </YjsProvider>
              </GlobalContextProvider>
            </StyledMain>
          </StyledPage>
        </Suspense>
      </Wrapper>
    </LayoutWrapper>
  </Authenticate>
)

export default routes
