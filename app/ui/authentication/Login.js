import React from 'react'
import PropTypes from 'prop-types'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
// import styled from 'styled-components'

import { Form, Input, Page } from '../common'
import AuthenticationForm from './AuthenticationForm'
import AuthenticationHeader from './AuthenticationHeader'
import AuthenticationWrapper from './AuthenticationWrapper'

const Login = props => {
  const { className, errorMessage, hasError, loading, onSubmit } = props

  return (
    <Page maxWidth={600}>
      <AuthenticationWrapper className={className}>
        <AuthenticationHeader>Login</AuthenticationHeader>

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
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: 'Email is required',
              },
              {
                type: 'email',
                message: 'This is not a valid email address',
              },
            ]}
          >
            <Input
              autoComplete="on"
              placeholder="Please enter your email"
              prefix={<UserOutlined className="site-form-item-icon" />}
              type="email"
              data-test="login-email-input"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Password is required' }]}
          >
            <Input
              autoComplete="on"
              placeholder="Please enter your password"
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              data-test="login-password-input"
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
