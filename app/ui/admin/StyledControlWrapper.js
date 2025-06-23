/* stylelint-disable declaration-no-important */
import styled from 'styled-components'
import { grid } from '@coko/client'

export default styled.div`
  align-items: center;
  column-gap: ${grid(4)};
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  max-width: 450px;
  row-gap: ${grid(1)};

  > .ant-form-item {
    margin-bottom: 0 !important;
  }

  button[type='submit'] {
    padding-inline: 2ch;
  }
`
