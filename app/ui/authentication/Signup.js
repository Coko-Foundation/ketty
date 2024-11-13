import React, { Suspense } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { grid } from '@coko/client'

import { Trans, useTranslation } from 'react-i18next'
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

  const { t } = useTranslation()

  const [modal, contextHolder] = Modal.useModal()

  const [form] = Form.useForm()

  const handleTCAgree = () => {
    form.setFieldValue('agreedTc', true)
  }

  const showTermsAndConditions = e => {
    e.preventDefault()

    const termsAndConditionsModal = modal.info()
    termsAndConditionsModal.update({
      title: t('Usage Terms and Conditions'.toLowerCase().replace(/ /g, '_')),
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
      <Suspense fallback={<div>Loading...</div>}>
        <AuthenticationWrapper className={className}>
          <AuthenticationHeader>
            {t('Sign up'.toLowerCase().replace(/ /g, '_'))}
          </AuthenticationHeader>

          {hasSuccess && (
            <div role="alert">
              <Result
                className={className}
                status="success"
                subTitle={
                  <Paragraph>
                    <Trans i18nKey={"we've_sent_you_a_verification_email"}>
                      {/* We & apos;ve sent you a verification email. Click on the link in
                      the email to activate your account. */}
                      We&apos;ve sent you a verification email. Click on the
                      link in the email to activate your account.
                    </Trans>
                  </Paragraph>
                }
                title={t('Signup successful!'.toLowerCase().replace(/ /g, '_'))}
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
                label={t('Given Name'.toLowerCase().replace(/ /g, '_'))}
                name="givenNames"
                rules={[
                  {
                    required: true,
                    message: () =>
                      t(
                        'Given name is required'
                          .replace(/ /g, '_')
                          .toLowerCase(),
                      ),
                  },
                ]}
              >
                <Input
                  data-test="signup-givenName-input"
                  placeholder={t(
                    'Fill in your first name'.toLowerCase().replace(/ /g, '_'),
                  )}
                />
              </Form.Item>

              <Form.Item
                label={t('Surname'.toLowerCase().replace(/ /g, '_'))}
                name="surname"
                rules={[
                  {
                    required: true,
                    message: () =>
                      t('Surname is required'.toLowerCase().replace(/ /g, '_')),
                  },
                ]}
              >
                <Input
                  data-test="signup-surname-input"
                  placeholder={t(
                    'Fill in your last name'.toLowerCase().replace(/ /g, '_'),
                  )}
                />
              </Form.Item>

              <Form.Item
                label={t('Email'.toLowerCase().replace(/ /g, '_'))}
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
                  data-test="signup-email-input"
                  placeholder={t(
                    'Fill in your email'.toLowerCase().replace(/ /g, '_'),
                  )}
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
                      t(
                        'Password is required'.toLowerCase().replace(/ /g, '_'),
                      ),
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (value && value.length >= 8) {
                        return Promise.resolve()
                      }

                      return Promise.reject(
                        new Error(
                          t(
                            'Password should not be shorter than 8 characters'
                              .toLowerCase()
                              .replace(/ /g, '_'),
                          ),
                        ),
                      )
                    },
                  }),
                ]}
              >
                <Input
                  data-test="signup-password-input"
                  placeholder={t(
                    'Fill in your password'.toLowerCase().replace(/ /g, '_'),
                  )}
                  type="password"
                />
              </Form.Item>

              <Form.Item
                dependencies={['password']}
                label={t('Confirm Password'.toLowerCase().replace(/ /g, '_'))}
                name="confirmPassword"
                rules={[
                  {
                    required: true,
                    message: () =>
                      t(
                        'Please confirm your password!'
                          .replace(/ /g, '_')
                          .toLowerCase(),
                      ),
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve()
                      }

                      return Promise.reject(
                        new Error(
                          t(
                            'The two passwords that you entered do not match!'
                              .replace(/ /g, '_')
                              .toLowerCase(),
                          ),
                        ),
                      )
                    },
                  }),
                ]}
              >
                <Input
                  data-test="signup-confirmPassword-input"
                  placeholder={t(
                    'Fill in your password again'
                      .toLowerCase()
                      .replace(/ /g, '_'),
                  )}
                  type="password"
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
                                t(
                                  'You need to agree to the terms and conditions'
                                    .toLowerCase()
                                    .replace(/ /g, '_'),
                                ),
                              ),
                            ),
                    },
                  ]}
                  valuePropName="checked"
                >
                  <Checkbox
                    aria-label={t(
                      'I agree to the terms and conditions'
                        .toLowerCase()
                        .replace(/ /g, '_'),
                    )}
                    data-test="signup-agreedTc-checkbox"
                  >
                    {t('I agree to the'.toLowerCase().replace(/ /g, '_'))}{' '}
                    <Link
                      as="a"
                      href="#termsAndCondition"
                      id="termsAndConditions"
                      onClick={showTermsAndConditions}
                    >
                      {t(
                        'terms and conditions'.toLowerCase().replace(/ /g, '_'),
                      )}
                    </Link>
                  </Checkbox>
                </Form.Item>
                {contextHolder}
              </ModalContext.Provider>
            </AuthenticationForm>
          )}
        </AuthenticationWrapper>
      </Suspense>
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
