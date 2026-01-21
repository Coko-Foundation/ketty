import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { CheckOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons'
import { th, grid } from '@coko/client'
import { useTranslation } from 'react-i18next'
import { Upload, Image } from 'antd'
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

const UploadAction = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: ${grid(1)};
`

const Profile = props => {
  const { onProfileUpdate, onPasswordUpdate, currentUser } = props

  const { t } = useTranslation(null, { keyPrefix: 'pages.userProfile' })

  const [profileForm] = Form.useForm()
  const [passwordForm] = Form.useForm()
  const [profileUpdateResult, setProfileUpdateResult] = useState()
  const [passwordUpdateResult, setPasswordUpdateResult] = useState()
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')

  const [profilePicture, setProfilePicture] = useState(
    currentUser?.avatar?.id
      ? [
          {
            uid: currentUser.avatar.id,
            name: 'rpofile',
            status: 'done',
            url: currentUser.avatar.url,
          },
        ]
      : [],
  )

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
      onProfileUpdate({
        ...values,
        avatar: profilePicture[0] || null,
      })
        .then(() => {
          setProfileUpdateResult({
            success: true,
            message: t('accountForm.actions.update.success'),
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
            message: t('passwordForm.actions.update.success'),
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

  const handleProfilePictureUpload = ({ fileList: newFileList }) => {
    setProfilePicture(newFileList)
  }

  const handlePreview = async file => {
    setPreviewImage(file.url || file.preview || file.thumbUrl)
    setPreviewOpen(true)
  }

  return (
    <Center>
      <h1 id="userProfile">{t('title')}</h1>
      <Form
        aria-labelledby="userProfile"
        form={profileForm}
        layout="vertical"
        onFinish={handleProfileUpdate}
      >
        <Form.Item
          label={t('accountForm.name')}
          name="givenNames"
          rules={[
            {
              required: true,
              message: t('accountForm.name.validation'),
            },
          ]}
        >
          <Input placeholder="Given name" />
        </Form.Item>
        <Form.Item
          label={t('accountForm.surname')}
          name="surname"
          rules={[
            {
              required: true,
              message: t('accountForm.surname.validation'),
            },
          ]}
        >
          <Input placeholder="Surname" />
        </Form.Item>
        <Form.Item
          label={t('accountForm.email')}
          name="email"
          rules={[
            {
              required: true,
              message: t('accountForm.email.validation'),
            },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item
          label="Profile picture"
          labelCol={{ span: 24 }}
          name="avatar"
          valuePropName="file"
        >
          <Upload
            accept="image/*"
            beforeUpload={() => false}
            fileList={profilePicture}
            listType="picture-card"
            maxCount={1}
            onChange={handleProfilePictureUpload}
            onPreview={handlePreview}
            onRemove={() => setProfilePicture([])}
          >
            {profilePicture?.length === 0 ? (
              <UploadAction>
                <PlusOutlined />
                <span>Upload image</span>
              </UploadAction>
            ) : null}
          </Upload>
        </Form.Item>
        {previewImage && (
          <Image
            preview={{
              visible: previewOpen,
              onVisibleChange: visible => setPreviewOpen(visible),
              afterOpenChange: visible => !visible && setPreviewImage(''),
            }}
            src={previewImage}
            wrapperStyle={{ display: 'none' }}
          />
        )}
        <ResultWrapper>
          <Button
            htmlType="submit"
            loading={profileUpdateResult?.loading}
            type="primary"
          >
            {t('accountForm.actions.update')}
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
      <h2 id="resetPass">{t('passwordSectiontitle')}</h2>
      <Form
        aria-labelledby="resetPass"
        form={passwordForm}
        layout="vertical"
        onFinish={handlePasswordUpdate}
      >
        <Form.Item
          label={t('passwordForm.current')}
          name="currentPassword"
          rules={[
            { required: true, message: t('passwordForm.current.validation') },
          ]}
        >
          <Input placeholder="Enter current password" type="password" />
        </Form.Item>

        <Form.Item
          label={t('passwordForm.new')}
          name="newPassword"
          rules={[
            { required: true, message: t('passwordForm.new.validation') },
          ]}
        >
          <Input placeholder="Enter new password" type="password" />
        </Form.Item>

        <Form.Item
          label={t('passwordForm.confirm')}
          name="confirmPassword"
          rules={[
            {
              required: true,
              message: t('passwordForm.confirm.validation'),
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve()
                }

                return Promise.reject(
                  new Error(t('passwordForm.confirm.validation.mismatch')),
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
            {t('passwordForm.actions.update')}
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
