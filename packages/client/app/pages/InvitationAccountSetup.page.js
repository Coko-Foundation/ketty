import React from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client'
import { useCurrentUser } from '@coko/client'
import styled from 'styled-components'
import {
  GET_USER_BY_INVITATION_TOKEN,
  APPLICATION_PARAMETERS,
  SIGN_UP_FROM_INVITATION,
} from '../graphql'
import { Result, Spin, Paragraph, Link, Signup } from '../ui'

const StyledSpin = styled(Spin)`
  display: grid;
  height: calc(100% - 48px);
  place-content: center;
`

const InvitationAccountSetupPage = () => {
  const { token } = useParams()
  const history = useHistory()
  const { setCurrentUser } = useCurrentUser()

  const { data: invitationData, error: invitationError } = useQuery(
    GET_USER_BY_INVITATION_TOKEN,
    {
      variables: {
        token,
      },
    },
  )

  const {
    data: {
      getApplicationParameters: [{ config: termsAndConditions } = {}] = [],
    } = {},
  } = useQuery(APPLICATION_PARAMETERS, {
    variables: {
      context: 'bookBuilder',
      area: 'termsAndConditions',
    },
  })

  const [finishAccountSetupMutation, { data, loading, error }] = useMutation(
    SIGN_UP_FROM_INVITATION,
  )

  const finishAccountSetup = formData => {
    const { agreedTc, givenNames, surname, password } = formData

    const mutationData = {
      variables: {
        input: {
          id: invitationData?.userByInvitationToken.id,
          agreedTc,
          givenNames,
          surname,
          password,
        },
      },
    }

    finishAccountSetupMutation(mutationData)
      .then(res => {
        setCurrentUser(res.data.setupAccountOnInvitation?.user)

        if (res.data.setupAccountOnInvitation?.token) {
          localStorage.setItem(
            'token',
            res.data.setupAccountOnInvitation?.token,
          )
          history.push('/dashboard')
        }
      })
      .catch(e => console.error(e))
  }

  if (invitationError) {
    return (
      <Result
        extra={<Link to="/login">Back to login</Link>}
        status="error"
        subTitle={
          <>
            <Paragraph>
              There was an error retrieving the user from the invitation link.
              The invitation token is not valid. administrators.
            </Paragraph>
            <Paragraph>For further assistance contact the</Paragraph>
          </>
        }
        title={<h1>Invalid invitation</h1>}
      />
    )
  }

  if (!invitationData) {
    return <StyledSpin spinning />
  }

  return (
    <Signup
      errorMessage={error?.message}
      hasError={!!error}
      hasSuccess={!!data}
      headerText="Complete the registration and set up your account by submitting the form below."
      loading={loading}
      onSubmit={finishAccountSetup}
      termsAndConditions={termsAndConditions}
      userEmail={invitationData?.userByInvitationToken?.defaultIdentity?.email}
    />
  )
}

export default InvitationAccountSetupPage
