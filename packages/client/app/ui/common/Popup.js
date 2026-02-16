import Popup from '@coko/client/dist/ui/common/Popup'
import styled from 'styled-components'
import { th } from '@coko/client'

export default styled(Popup)`
  background-color: ${th('colorBackground')};
  border-radius: ${th('borderRadius')};
  color: ${th('colorText')};
`
