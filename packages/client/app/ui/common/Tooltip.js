import { th } from '@coko/client'
import { Tooltip } from 'antd'
import styled from 'styled-components'

export default styled(Tooltip)`
  --antd-arrow-background-color: ${th('colorBackgroundHue')};

  .ant-tooltip-inner {
    background-color: ${th('colorBackgroundHue')};
    color: ${th('colorText')};
  }
`
