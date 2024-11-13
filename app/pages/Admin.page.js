import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useCurrentUser } from '@coko/client'
import { useQuery, useMutation } from '@apollo/client'
import {
  APPLICATION_PARAMETERS,
  UPDATE_APPLICATION_PARAMETERS,
  UPLOAD_TRANSLATION,
} from '../graphql'
import { isAdmin } from '../helpers/permissions'
import { AdminDashboard } from '../ui/admin'

const AdminPage = () => {
  const { currentUser } = useCurrentUser()
  const history = useHistory()
  const [tcContent, setTCContent] = useState()

  const { data: { getApplicationParameters } = {}, loading: paramsLoading } =
    useQuery(APPLICATION_PARAMETERS, {
      onCompleted(data) {
        // keep local state of terms and conditions and update only in the first moment
        if (tcContent === undefined) {
          const termsAndConditions = data.getApplicationParameters?.find(
            p => p.area === 'termsAndConditions',
          )?.config

          setTCContent(termsAndConditions)
        }
      },
    })

  const [updateApplicationParametersMutation, { loading: updateLoading }] =
    useMutation(UPDATE_APPLICATION_PARAMETERS, {
      refetchQueries: [APPLICATION_PARAMETERS],
    })

  const [upload] = useMutation(UPLOAD_TRANSLATION)

  const luluConfig = getApplicationParameters?.find(
    p => p.area === 'integrations',
  )?.config.lulu

  const aiEnabled = getApplicationParameters?.find(
    p => p.area === 'aiEnabled',
  )?.config

  const chatGptApiKey = getApplicationParameters?.find(
    p => p.area === 'chatGptApiKey',
  )?.config

  const exportsConfig = getApplicationParameters?.find(
    p => p.area === 'exportsConfig',
  )?.config

  const languages = getApplicationParameters?.find(
    p => p.area === 'languages',
  )?.config

  const toggleLuluConfig = val => {
    const config = getApplicationParameters?.find(
      p => p.area === 'integrations',
    ).config

    const newConfig = {
      ...config,
      lulu: {
        ...config.lulu,
        disabled: !val,
      },
    }

    const variables = {
      input: {
        context: 'bookBuilder',
        area: 'integrations',
        config: JSON.stringify(newConfig),
      },
    }

    updateApplicationParametersMutation({ variables })
  }

  const toggleAIFeatures = val => {
    const variables = {
      input: {
        context: 'bookBuilder',
        area: 'aiEnabled',
        config: `${val}`,
      },
    }

    updateApplicationParametersMutation({ variables })
  }

  const toggleExportsConfig = (val, which) => {
    const config = JSON.parse(JSON.stringify(exportsConfig))

    config[which] = { enabled: val }

    const variables = {
      input: {
        context: 'bookBuilder',
        area: 'exportsConfig',
        config: JSON.stringify(config),
      },
    }

    updateApplicationParametersMutation({ variables })
  }

  const handleUpdateChatGPTApiKey = val => {
    const headers = new Headers()
    headers.append('Authorization', `Bearer ${val}`)
    headers.append('Content-Type', 'application/json')
    return new Promise((resolve, reject) => {
      // validate API key before saving
      fetch(`https://api.openai.com/v1/engines`, {
        method: 'GET',
        headers,
        muteHttpExceptions: true,
      }).then(async ({ status }) => {
        if (status === 200) {
          const variables = {
            input: {
              context: 'bookBuilder',
              area: 'chatGptApiKey',
              config: JSON.stringify(val),
            },
          }

          await updateApplicationParametersMutation({ variables })
          resolve()
        } else if (status === 401) {
          // console.log('invalid api key')
          reject()
        }
      })
    })
  }

  const handleTCUppdate = newContent => {
    const variables = {
      input: {
        context: 'bookBuilder',
        area: 'termsAndConditions',
        config: JSON.stringify(newContent),
      },
    }

    return updateApplicationParametersMutation({ variables })
  }

  const handleLanguagesUpdate = newConfig => {
    const variables = {
      input: {
        context: 'bookBuilder',
        area: 'languages',
        config: JSON.stringify(newConfig),
      },
    }

    return updateApplicationParametersMutation({ variables })
  }

  const handleTranslationsUpload = async (file, code) => {
    const mutationVariables = {
      variables: {
        file,
        code,
      },
    }

    return upload(mutationVariables)
  }

  if (currentUser && !isAdmin(currentUser)) {
    history.push('/dashboard')
  }

  return (
    <AdminDashboard
      aiEnabled={aiEnabled}
      aiToggleIntegration={toggleAIFeatures}
      chatGptApiKey={chatGptApiKey}
      exportConfigUpdate={toggleExportsConfig}
      exportOptions={exportsConfig}
      languages={languages}
      luluConfigEnabled={!luluConfig?.disabled}
      luluToggleConfig={toggleLuluConfig}
      onChatGPTKeyUpdate={handleUpdateChatGPTApiKey}
      onLanguagesUpdate={handleLanguagesUpdate}
      onTCUpdate={handleTCUppdate}
      onTranslationsUpload={handleTranslationsUpload}
      paramsLoading={paramsLoading || updateLoading}
      termsAndConditions={tcContent}
    />
  )
}

export default AdminPage
