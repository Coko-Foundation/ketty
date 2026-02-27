import React from 'react'
import styled from 'styled-components'
import { useQuery } from '@apollo/client'
import { th } from '@coko/client'
import { Center } from '../ui'
import { APPLICATION_PARAMETERS } from '../graphql'

const Wrapper = styled(Center)`
  font-size: 120%;
  line-height: 1.5;
  padding: 1rem 1rem 5rem;

  h1 {
    border-bottom: 2px solid ${th('colorPrimary')};
  }
`

const A11Statement = () => {
  const {
    data: {
      getApplicationParameters: [{ config: a11yStatement } = {}] = [],
    } = {},
  } = useQuery(APPLICATION_PARAMETERS, {
    variables: {
      context: 'bookBuilder',
      area: 'a11yStatement',
    },
  })

  return <Wrapper dangerouslySetInnerHTML={{ __html: a11yStatement }} />
}

export default A11Statement
