/* stylelint-disable indentation */
/* stylelint-disable selector-combinator-space-before */
/* stylelint-disable declaration-no-important */
/* stylelint-disable string-quotes */
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Tabs } from 'antd'
import { th } from '@coko/client'
import { useTranslation } from 'react-i18next'
import AiIntegration from './AiIntegration'
import Publishing from './Publishing'
import PureScienceConfig from './PureScienceConfig'
import Languages from './Languages'
import TermsAndConditions from './TermsAndConditions'

import { Center, Box } from '../common'

const AdminWrapper = styled.div`
  background-color: #e8e8e8;
  min-height: 100vh;
  padding-block: 1rem 3rem;

  h1 {
    text-align: center;
  }
`

const StyledCenter = styled(Center)`
  --max-width: 100ch;
  --s1: 32px;
  background-color: ${th('colorBackground')};
  margin-bottom: 3rem;
  padding-block: calc(var(--s1) / 2) var(--s1);
`

const AdminDashboard = props => {
  const {
    aiEnabled,
    chatGptApiKey,
    luluToggleConfig,
    luluUpdateConfig,
    luluConfig,
    paramsLoading,
    termsAndConditions,
    onTCUpdate,
    onChatGPTKeyUpdate,
    onLanguagesUpdate,
    exportOptions,
    exportConfigUpdate,
    languages,
    onTranslationsUpload,
    onUpdatePsConfig,
    psConfig,
  } = props

  const { t } = useTranslation(null, { keyPrefix: 'pages.admin' })

  return (
    <AdminWrapper>
      <Box>
        <StyledCenter>
          <h1>{t('title')}</h1>
          <Tabs
            items={[
              {
                key: 'aiIntegration',
                label: t('aiIntegration.heading'),
                children: (
                  <AiIntegration
                    aiEnabled={aiEnabled}
                    chatGptApiKey={chatGptApiKey}
                    onChatGPTKeyUpdate={onChatGPTKeyUpdate}
                    paramsLoading={paramsLoading}
                  />
                ),
              },
              {
                key: 'publishing',
                label: t('publishing.heading'),
                children: (
                  <Publishing
                    exportConfigUpdate={exportConfigUpdate}
                    exportOptions={exportOptions}
                    luluConfig={luluConfig}
                    luluToggleConfig={luluToggleConfig}
                    luluUpdateConfig={luluUpdateConfig}
                    paramsLoading={paramsLoading}
                  />
                ),
              },
              {
                key: 'pureScience',
                label: 'PureScience ',
                children: (
                  <PureScienceConfig
                    onUpdatePsConfig={onUpdatePsConfig}
                    psConfig={psConfig}
                  />
                ),
              },
              {
                key: 'languages',
                label: 'Languages',
                children: (
                  <Languages
                    languages={languages}
                    onLanguagesUpdate={onLanguagesUpdate}
                    onTranslationsUpload={onTranslationsUpload}
                  />
                ),
              },
              {
                key: 'tc',
                label: t('termsAndConditions.heading'),
                children: (
                  <TermsAndConditions
                    termsAndConditions={termsAndConditions}
                    onTCUpdate={onTCUpdate}
                  />
                ),
              },
            ]}
            tabPosition="left"
          />
        </StyledCenter>
      </Box>
    </AdminWrapper>
  )
}

AdminDashboard.propTypes = {
  aiEnabled: PropTypes.bool,
  luluToggleConfig: PropTypes.func,
  luluUpdateConfig: PropTypes.func,
  luluConfig: PropTypes.shape(),
  paramsLoading: PropTypes.bool,
  termsAndConditions: PropTypes.string,
  onTCUpdate: PropTypes.func,
  chatGptApiKey: PropTypes.string,
  onChatGPTKeyUpdate: PropTypes.func,
  exportOptions: PropTypes.shape(),
  exportConfigUpdate: PropTypes.func,
  onLanguagesUpdate: PropTypes.func,
  onTranslationsUpload: PropTypes.func,
  languages: PropTypes.arrayOf(PropTypes.shape()),
  onUpdatePsConfig: PropTypes.func,
  psConfig: PropTypes.shape({
    url: PropTypes.string,
    workflows: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
      }),
    ),
  }),
}

AdminDashboard.defaultProps = {
  aiEnabled: false,
  luluToggleConfig: null,
  luluUpdateConfig: null,
  luluConfig: null,
  paramsLoading: false,
  termsAndConditions: '',
  onTCUpdate: null,
  chatGptApiKey: '',
  onChatGPTKeyUpdate: null,
  exportOptions: {},
  exportConfigUpdate: null,
  onLanguagesUpdate: null,
  onTranslationsUpload: null,
  languages: [],
  onUpdatePsConfig: null,
  psConfig: null,
}

export default AdminDashboard
