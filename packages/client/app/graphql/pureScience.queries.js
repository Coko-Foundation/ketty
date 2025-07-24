import { gql } from '@apollo/client'

const TRIGGER_WORKFLOW = gql`
  mutation TriggerWorkflow($token: ID!, $data: String!) {
    triggerWorkflow(token: $token, data: $data)
  }
`

/* eslint-disable import/prefer-default-export */
export { TRIGGER_WORKFLOW }
