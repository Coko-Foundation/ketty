import React, { Suspense } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import AuthenticationForm from './AuthenticationForm'
import AuthenticationHeader from './AuthenticationHeader'
import AuthenticationWrapper from './AuthenticationWrapper'
import SuccessSubTitle from './SuccessSubTitle'
import { Form, Input, Paragraph, Result, Page } from '../common'

const RequestPasswordResetForm = props => {
  // disable prop types that will be checked in the exported component anyway
  // eslint-disable-next-line react/prop-types
  const { hasError, loading, onSubmit } = props
  const { t } = useTranslation('translation', { useSuspense: false })

  return (
    <AuthenticationForm
      alternativeActionLabel="Return to login form"
      alternativeActionLink="/login"
      errorMessage={t(
        'Something went wrong! Please contact the administrator.'
          .toLowerCase()
          .replace(/ /g, '_'),
      )}
      hasError={hasError}
      loading={loading}
      onSubmit={onSubmit}
      submitButtonLabel="Send"
    >
      <Paragraph>
        {t(
          'Please enter the email address connected to your account.'
            .toLowerCase()
            .replace(/ /g, '_'),
        )}
      </Paragraph>

      <Form.Item
        label={t('Email'.toLowerCase())}
        name="email"
        rules={[
          {
            required: true,
            message: () =>
              t('Email is required'.toLowerCase().replace(/ /g, '_')),
          },
          {
            type: 'email',
            message: () => t("Doesn't look like a valid email"),
          },
        ]}
      >
        <Input
          placeholder={t('Enter your email'.toLowerCase().replace(/ /g, '_'))}
        />
      </Form.Item>
    </AuthenticationForm>
  )
}

const RequestPasswordReset = props => {
  const { className, hasError, hasSuccess, loading, onSubmit, userEmail } =
    props

  const { t } = useTranslation('translation', { useSuspense: false })

  return (
    <Page maxWidth={600}>
      <Suspense fallback={<div>Loading...</div>}>
        <AuthenticationWrapper className={className}>
          <AuthenticationHeader>
            {t('Request password reset'.toLowerCase().replace(/ /g, '_'))}
          </AuthenticationHeader>

          {hasSuccess && (
            <div role="alert">
              <Result
                data-testid="result-request-password-success"
                extra={[
                  <Link key={1} to="/login">
                    {t(
                      'Return to the login form'
                        .toLowerCase()
                        .replace(/ /g, '_'),
                    )}
                  </Link>,
                ]}
                status="success"
                subTitle={<SuccessSubTitle userEmail={userEmail} />}
                title={t(
                  'Request successful!'.toLowerCase().replace(/ /g, '_'),
                )}
              />
            </div>
          )}

          {!hasSuccess && (
            <RequestPasswordResetForm
              hasError={hasError}
              loading={loading}
              onSubmit={onSubmit}
            />
          )}
        </AuthenticationWrapper>
      </Suspense>
    </Page>
  )
}

RequestPasswordReset.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  hasError: PropTypes.bool,
  hasSuccess: PropTypes.bool,
  loading: PropTypes.bool,
  userEmail: PropTypes.string,
}

RequestPasswordReset.defaultProps = {
  hasError: false,
  hasSuccess: false,
  loading: false,
  userEmail: null,
}

export default RequestPasswordReset
