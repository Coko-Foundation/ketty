import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { th, grid } from '@coko/client'
import { Button, Center, Form, Input, Divider } from '../common'

const UpdateResult = styled.span`
  color: ${props => (props.$success ? th('colorSuccess') : th('colorError'))};
  display: inline-flex;
  gap: ${grid(1)};
`

const ResultWrapper = styled.div`
  align-items: center;
  display: flex;
  gap: ${grid(8)};
`

const Profile = props => {
  const { onProfileUpdate, onPasswordUpdate, currentUser } = props

  const [profileForm] = Form.useForm()
  const [passwordForm] = Form.useForm()
  const [profileUpdateResult, setProfileUpdateResult] = useState()
  const [passwordUpdateResult, setPasswordUpdateResult] = useState()

  useEffect(() => {
    if (currentUser) {
      profileForm.setFieldsValue({
        id: currentUser.id,
        givenNames: currentUser.givenNames,
        surname: currentUser.surname,
        email: currentUser.defaultIdentity.email,
      })
    }
  }, [currentUser])

  const handleProfileUpdate = () => {
    setProfileUpdateResult({ loading: true })
    profileForm.validateFields().then(values => {
      onProfileUpdate(values)
        .then(() => {
          setProfileUpdateResult({
            success: true,
            message: 'Profile information updated',
          })
          setTimeout(() => {
            setProfileUpdateResult(null)
          }, 5000)
        })
        .catch(e => {
          setProfileUpdateResult({
            success: false,
            message: e.message, // 'Error updating profile information',
          })
          setTimeout(() => {
            setProfileUpdateResult(null)
          }, 5000)
        })
    })
  }

  const handlePasswordUpdate = () => {
    setPasswordUpdateResult({ loading: true })
    passwordForm.validateFields().then(values => {
      onPasswordUpdate(values)
        .then(() => {
          setPasswordUpdateResult({
            success: true,
            message: 'Password updated',
          })
          setTimeout(() => {
            setPasswordUpdateResult(null)
          }, 5000)
        })
        .catch(e => {
          setPasswordUpdateResult({
            success: false,
            message: e.message.substr(
              e.message.indexOf('Update password:') + 17,
            ), // 'Error updating password',
          })
          setTimeout(() => {
            setPasswordUpdateResult(null)
          }, 5000)
        })
    })
  }

  return (
    <Center>
      <h1 id="userProfile">User profile</h1>
      <Form
        aria-labelledby="userProfile"
        form={profileForm}
        layout="vertical"
        onFinish={handleProfileUpdate}
      >
        <Form.Item
          label="Given name"
          name="givenNames"
          rules={[
            {
              required: true,
              message: 'Given name is required',
            },
          ]}
        >
          <Input placeholder="Given name" />
        </Form.Item>
        <Form.Item
          label="Surname"
          name="surname"
          rules={[
            {
              required: true,
              message: 'Surname is required',
            },
          ]}
        >
          <Input placeholder="Surname" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: 'Email is required',
            },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <ResultWrapper>
          <Button
            htmlType="submit"
            loading={profileUpdateResult?.loading}
            type="primary"
          >
            Update profile
          </Button>

          <UpdateResult $success={profileUpdateResult?.success} role="status">
            {profileUpdateResult?.message && (
              <>
                {profileUpdateResult?.success ? (
                  <CheckOutlined />
                ) : (
                  <CloseOutlined />
                )}

                {profileUpdateResult?.message}
              </>
            )}
          </UpdateResult>
        </ResultWrapper>
      </Form>
      <Divider />
      <h2 id="resetPass">Reset password</h2>
      <Form
        aria-labelledby="resetPass"
        form={passwordForm}
        layout="vertical"
        onFinish={handlePasswordUpdate}
      >
        <Form.Item
          label="Current password"
          name="currentPassword"
          rules={[{ required: true, message: 'Current password is required' }]}
        >
          <Input placeholder="Enter current password" type="password" />
        </Form.Item>

        <Form.Item
          label="New password"
          name="newPassword"
          rules={[{ required: true, message: 'New password is required' }]}
        >
          <Input placeholder="Enter new password" type="password" />
        </Form.Item>

        <Form.Item
          label="Confirm new password"
          name="confirmPassword"
          rules={[
            {
              required: true,
              message: 'Please confirm your new password!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve()
                }

                return Promise.reject(
                  new Error('The two passwords that you entered do not match!'),
                )
              },
            }),
          ]}
        >
          <Input placeholder="Enter new password again" type="password" />
        </Form.Item>

        <ResultWrapper>
          <Button
            htmlType="submit"
            loading={passwordUpdateResult?.loading}
            type="primary"
          >
            Update password
          </Button>

          <UpdateResult $success={passwordUpdateResult?.success} role="status">
            {passwordUpdateResult?.message && (
              <>
                {passwordUpdateResult?.success ? (
                  <CheckOutlined />
                ) : (
                  <CloseOutlined />
                )}

                {passwordUpdateResult?.message}
              </>
            )}
          </UpdateResult>
        </ResultWrapper>
      </Form>
    </Center>
  )
}

Profile.propTypes = {
  onProfileUpdate: PropTypes.func.isRequired,
  onPasswordUpdate: PropTypes.func.isRequired,
  currentUser: PropTypes.shape().isRequired,
}

export default Profile
