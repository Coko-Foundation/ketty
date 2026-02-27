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
  const [a11yStatement, setA11yStatement] = useState()

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

        if (a11yStatement === undefined) {
          const statement = data.getApplicationParameters?.find(
            p => p.area === 'a11yStatement',
          )?.config

          setA11yStatement(statement)
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

  const pureScienceConfig = getApplicationParameters?.find(
    p => p.area === 'integrations',
  )?.config.pureScience

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

  const allowSignups = getApplicationParameters?.find(
    p => p.area === 'allowSignups',
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

  const updateLuluConfig = values => {
    const config = getApplicationParameters?.find(
      p => p.area === 'integrations',
    ).config

    const newConfig = {
      ...config,
      lulu: {
        ...config.lulu,
        ...values,
      },
    }

    const variables = {
      input: {
        context: 'bookBuilder',
        area: 'integrations',
        config: JSON.stringify(newConfig),
      },
    }

    return updateApplicationParametersMutation({ variables })
  }

  const handleUpdatePsConfig = values => {
    const config = getApplicationParameters?.find(
      p => p.area === 'integrations',
    ).config

    const newConfig = {
      ...config,
      pureScience: {
        ...config.pureScience,
        ...values,
      },
    }

    const variables = {
      input: {
        context: 'bookBuilder',
        area: 'integrations',
        config: JSON.stringify(newConfig),
      },
    }

    return updateApplicationParametersMutation({ variables })
  }

  const toggleAIFeatures = async val => {
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

  const handleUpdateChatGPTApiKey = async val => {
    await toggleAIFeatures(val.aiOn)

    if (val.aiOn) {
      const headers = new Headers()
      headers.append('Authorization', `Bearer ${val.apiKey}`)
      headers.append('Content-Type', 'application/json')
      return new Promise((resolve, reject) => {
        // validate API key before saving
        fetch(`https://api.openai.com/v1/engines`, {
          method: 'GET',
          headers,
          muteHttpExceptions: true,
        }).then(async ({ status }) => {
          if (status === 200) {
            await updateApplicationParametersMutation({
              variables: {
                input: {
                  context: 'bookBuilder',
                  area: 'chatGptApiKey',
                  config: JSON.stringify(val.apiKey),
                },
              },
            })

            resolve()
          } else if (status === 401) {
            reject()
          }
        })
      })
    }

    return new Promise(resolve => {
      resolve()
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

  const handleA11yStatementUpdate = newContent => {
    const variables = {
      input: {
        context: 'bookBuilder',
        area: 'a11yStatement',
        config: JSON.stringify(newContent),
      },
    }

    return updateApplicationParametersMutation({ variables })
  }

  const handleSignupToggleChange = val => {
    const variables = {
      input: {
        context: 'bookBuilder',
        area: 'allowSignups',
        config: `${val}`,
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
      a11yStatement={a11yStatement}
      aiEnabled={aiEnabled}
      aiToggleIntegration={toggleAIFeatures}
      allowSignups={allowSignups}
      chatGptApiKey={chatGptApiKey}
      exportConfigUpdate={toggleExportsConfig}
      exportOptions={exportsConfig}
      languages={languages}
      luluConfig={luluConfig}
      luluToggleConfig={toggleLuluConfig}
      luluUpdateConfig={updateLuluConfig}
      onA11yStatementUpdate={handleA11yStatementUpdate}
      onChatGPTKeyUpdate={handleUpdateChatGPTApiKey}
      onLanguagesUpdate={handleLanguagesUpdate}
      onSignupToggleChange={handleSignupToggleChange}
      onTCUpdate={handleTCUppdate}
      onTranslationsUpload={handleTranslationsUpload}
      onUpdatePsConfig={handleUpdatePsConfig}
      paramsLoading={paramsLoading || updateLoading}
      psConfig={pureScienceConfig}
      termsAndConditions={tcContent}
    />
  )
}

export default AdminPage
