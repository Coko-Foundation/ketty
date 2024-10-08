import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { grid } from '@coko/client'

import AuthenticationForm from './AuthenticationForm'
import AuthenticationHeader from './AuthenticationHeader'
import AuthenticationWrapper from './AuthenticationWrapper'

import {
  Form,
  Input,
  Link,
  Modal,
  Result,
  Checkbox,
  Paragraph,
  Page,
} from '../common'

const ModalContext = React.createContext(null)

const TCWrapper = styled.section`
  max-height: 500px;
  overflow: auto;
  padding-inline-end: ${grid(2)};
`

const Signup = props => {
  const {
    className,
    errorMessage,
    hasError,
    hasSuccess,
    loading,
    onSubmit,
    termsAndConditions,
    // userEmail,
  } = props

  const [modal, contextHolder] = Modal.useModal()

  const [form] = Form.useForm()

  const handleTCAgree = () => {
    form.setFieldValue('agreedTc', true)
  }

  const showTermsAndConditions = e => {
    e.preventDefault()
    const termsAndConditionsModal = modal.info()
    termsAndConditionsModal.update({
      title: 'Usage Terms and Conditions',
      content: (
        <TCWrapper dangerouslySetInnerHTML={{ __html: termsAndConditions }} />
      ),
      onOk() {
        handleTCAgree()
        termsAndConditionsModal.destroy()
      },
      okText: 'Agree',
      maskClosable: true,
      width: 570,
      bodyStyle: {
        marginRight: 38,
        textAlign: 'justify',
      },
    })
  }

  return (
    <Page maxWidth={600}>
      <AuthenticationWrapper className={className}>
        <AuthenticationHeader>Signup</AuthenticationHeader>

        {hasSuccess && (
          <div role="alert">
            <Result
              className={className}
              status="success"
              subTitle={
                <Paragraph>
                  We&apos;ve sent you a verification email. Click on the link in
                  the email to activate your account.
                </Paragraph>
              }
              title="Signup successful!"
            />
          </div>
        )}

        {!hasSuccess && (
          <AuthenticationForm
            alternativeActionLabel="Do you want to log in instead?"
            alternativeActionLink="/login"
            errorMessage={errorMessage}
            form={form}
            hasError={hasError}
            loading={loading}
            onSubmit={onSubmit}
            showForgotPassword={false}
            submitButtonLabel="Sign Up"
            title="Signup"
          >
            <Form.Item
              label="Given name"
              name="givenNames"
              rules={[{ required: true, message: 'Given name is required' }]}
            >
              <Input
                placeholder="Fill in your first name"
                data-test="signup-givenName-input"
              />
            </Form.Item>

            <Form.Item
              label="Surname"
              name="surname"
              rules={[{ required: true, message: 'Surname is required' }]}
            >
              <Input
                placeholder="Fill in your last name"
                data-test="signup-surname-input"
              />
            </Form.Item>

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
                placeholder="Fill in your email"
                type="email"
                data-test="signup-email-input"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Password is required' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (value && value.length >= 8) {
                      return Promise.resolve()
                    }

                    return Promise.reject(
                      new Error(
                        'Password should not be shorter than 8 characters',
                      ),
                    )
                  },
                }),
              ]}
            >
              <Input
                placeholder="Fill in your password"
                type="password"
                data-test="signup-password-input"
              />
            </Form.Item>

            <Form.Item
              dependencies={['password']}
              label="Confirm password"
              name="confirmPassword"
              rules={[
                {
                  required: true,
                  message: 'Please confirm your password!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }

                    return Promise.reject(
                      new Error(
                        'The two passwords that you entered do not match!',
                      ),
                    )
                  },
                }),
              ]}
            >
              <Input
                placeholder="Fill in your password again"
                type="password"
                data-test="signup-confirmPassword-input"
              />
            </Form.Item>
            <ModalContext.Provider value={null}>
              <Form.Item
                name="agreedTc"
                rules={[
                  {
                    validator: (_, value) =>
                      value
                        ? Promise.resolve()
                        : Promise.reject(
                            new Error(
                              'You need to agree to the terms and conditions',
                            ),
                          ),
                  },
                ]}
                valuePropName="checked"
              >
                <Checkbox
                  aria-label="I agree to the terms and conditions"
                  data-test="signup-agreedTc-checkbox"
                >
                  I agree to the{' '}
                  <Link
                    as="a"
                    href="#termsAndCondition"
                    id="termsAndConditions"
                    onClick={showTermsAndConditions}
                  >
                    terms and conditions
                  </Link>
                </Checkbox>
              </Form.Item>
              {contextHolder}
            </ModalContext.Provider>
          </AuthenticationForm>
        )}
      </AuthenticationWrapper>
    </Page>
  )
}

Signup.propTypes = {
  onSubmit: PropTypes.func.isRequired,

  errorMessage: PropTypes.string,
  hasError: PropTypes.bool,
  hasSuccess: PropTypes.bool,
  loading: PropTypes.bool,
  termsAndConditions: PropTypes.string,
}

Signup.defaultProps = {
  errorMessage: null,
  hasError: false,
  hasSuccess: false,
  loading: false,
  termsAndConditions: '',
}

export default Signup
