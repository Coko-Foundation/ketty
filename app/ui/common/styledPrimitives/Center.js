// import React, { useState } from 'react'
import styled from 'styled-components'
import { grid } from '@coko/client'

const Center = styled.div`
  --max-width: 90ch;
  --min-width: 0;
  --padding: ${grid(10)};

  box-sizing: content-box;
  margin-inline: auto;
  max-width: var(--max-width, 70ch);
  min-width: var(--min-width, 0);
  padding: var(--padding);
`

export default Center
