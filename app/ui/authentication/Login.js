import React from 'react'
import PropTypes from 'prop-types'
import { LockOutlined, UserOutlined } from '@ant-design/icons'

import { useTranslation } from 'react-i18next'
import { Form, Input, Page } from '../common'
import AuthenticationForm from './AuthenticationForm'
import AuthenticationHeader from './AuthenticationHeader'
import AuthenticationWrapper from './AuthenticationWrapper'

const Login = props => {
  const { className, errorMessage, hasError, loading, onSubmit } = props
  const { t } = useTranslation('translation', { useSuspense: false })

  return (
    <Page maxWidth={600}>
      <AuthenticationWrapper className={className}>
        <AuthenticationHeader>{t('Login'.toLowerCase())}</AuthenticationHeader>

        <AuthenticationForm
          alternativeActionLabel="Do you want to sign up instead?"
          alternativeActionLink="/signup"
          errorMessage={errorMessage}
          hasError={hasError}
          loading={loading}
          onSubmit={onSubmit}
          showForgotPassword
          submitButtonLabel="Log In"
          title="Login"
        >
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
                message: () =>
                  t(
                    'This is not a valid email address'
                      .toLowerCase()
                      .replace(/ /g, '_'),
                  ),
              },
            ]}
          >
            <Input
              autoComplete="on"
              data-test="login-email-input"
              placeholder={t(
                'Please enter your email'.toLowerCase().replace(/ /g, '_'),
              )}
              prefix={<UserOutlined className="site-form-item-icon" />}
              type="email"
            />
          </Form.Item>

          <Form.Item
            label={t('Password'.toLowerCase())}
            name="password"
            rules={[
              {
                required: true,
                message: () =>
                  t('Password is required'.toLowerCase().replace(/ /g, '_')),
              },
            ]}
          >
            <Input
              autoComplete="on"
              data-test="login-password-input"
              placeholder={t(
                'Please enter your password'.toLowerCase().replace(/ /g, '_'),
              )}
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
            />
          </Form.Item>
        </AuthenticationForm>
      </AuthenticationWrapper>
    </Page>
  )
}

Login.propTypes = {
  errorMessage: PropTypes.string,
  hasError: PropTypes.bool,
  loading: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
}

Login.defaultProps = {
  errorMessage: null,
  hasError: false,
  loading: false,
}

export default Login
