/* stylelint-disable declaration-no-important */
/* stylelint-disable no-eol-whitespace */
import { createGlobalStyle } from 'styled-components'
import { th } from '@coko/client'

export default createGlobalStyle`
  #root {
    * ::selection {
      background-color: ${th('colorPrimary')} !important;
      color: ${th('colorTextReverse')} !important;
      text-shadow: none;
    }

    > div.ant-spin-nested-loading {
      height: 100%;

      > div.ant-spin-container {
        height: 100%;
      }
    }

    *:not([contenteditable="true"]) {
      &:focus {
        outline: none;
      }

      &:focus-visible:not(#ai-overlay input) {
        border-radius: ${th('borderRadius')};
        outline: 2px solid ${th('colorOutline')};
      }
    }
  }

  .ant-tooltip {
    --antd-arrow-background-color: ${th('colorBackgroundHue')} !important;

    .ant-tooltip-arrow::before {
      clip-path: polygon(0 100%, 50% 0%, 100% 100%);
    }

    .ant-tooltip-inner {
      background-color: ${th('colorBackgroundHue')};
      color: ${th('colorText')};
    }
  }

  .ant-modal-confirm-content {
    max-width: 100% !important;
  }

  .ant-modal-root {
    button {
      box-shadow: none;
    }
  }

  a {
    color: ${th('colorPrimary')};
  }
`
