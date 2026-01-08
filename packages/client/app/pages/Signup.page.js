import React from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { Signup, Result, Link, Paragraph } from '../ui'
import { SIGNUP, APPLICATION_PARAMETERS } from '../graphql'

const SignupPage = () => {
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

  const {
    data: {
      getApplicationParameters: [{ config: allowSignups } = {}] = [],
    } = {},
  } = useQuery(APPLICATION_PARAMETERS, {
    variables: {
      context: 'bookBuilder',
      area: 'allowSignups',
    },
  })

  const [signupMutation, { data, loading, error }] = useMutation(SIGNUP)

  const signup = formData => {
    const { agreedTc, email, givenNames, surname, password } = formData

    const mutationData = {
      variables: {
        input: {
          agreedTc,
          email,
          givenNames,
          surname,
          password,
        },
      },
    }

    if (allowSignups) {
      signupMutation(mutationData).catch(e => console.error(e))
    }
  }

  return allowSignups === false ? (
    <Result
      extra={<Link to="/login">Back to login</Link>}
      status="error"
      subTitle={
        <Paragraph>
          Signups are disabled for this instance. Only administrators can invite
          new users to join.
        </Paragraph>
      }
      title={<h1>Signups disabled</h1>}
    />
  ) : (
    <Signup
      errorMessage={error?.message}
      hasError={!!error}
      hasSuccess={!!data}
      loading={loading}
      onSubmit={signup}
      termsAndConditions={termsAndConditions}
    />
  )
}

export default SignupPage
