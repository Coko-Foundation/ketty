import React from 'react'
import { useQuery, useMutation } from '@apollo/client'
import {
  GET_TEMPLATES,
  ADD_TEMPLATE,
  REFRESH_TEMPLATE,
  DISABLE_TEMPLATE,
  ENABLE_TEMPLATE,
  REMOVE_TEMPLATE,
  GET_PDF_DIMENSIONS,
  APPLICATION_PARAMETERS,
  UPDATE_APPLICATION_PARAMETERS,
} from '../graphql'
import { TemplateMananger } from '../ui'

const constructSizeOptions = (availableDimensions = [], labels = []) => {
  const dimensions = availableDimensions.map(dimension => {
    if (
      labels.findIndex(defaultOption => defaultOption.value === dimension) > -1
    ) {
      return labels.find(defaultOption => defaultOption.value === dimension)
    }

    return { value: dimension, label: dimension }
  })

  return dimensions
}

const TemplateManangerPage = () => {
  const { data: { getTemplates } = {}, loading } = useQuery(GET_TEMPLATES)

  const [addTemplate, { loading: addingTemplate }] = useMutation(ADD_TEMPLATE, {
    refetchQueries: [GET_TEMPLATES],
  })

  const [refreshTemplate, { loading: refreshingTemplate }] = useMutation(
    REFRESH_TEMPLATE,
    {
      refetchQueries: [GET_TEMPLATES],
    },
  )

  const [disableTemplate, { loading: disableLoading }] = useMutation(
    DISABLE_TEMPLATE,
    {
      refetchQueries: [GET_TEMPLATES],
    },
  )

  const [enableTemplate] = useMutation(ENABLE_TEMPLATE, {
    refetchQueries: [GET_TEMPLATES],
  })

  const [removeTemplate] = useMutation(REMOVE_TEMPLATE, {
    refetchQueries: [GET_TEMPLATES],
  })

  const { data: { getAvailablePdfDimensions } = {} } =
    useQuery(GET_PDF_DIMENSIONS)

  const { data: { getApplicationParameters } = {} } = useQuery(
    APPLICATION_PARAMETERS,
  )

  const [updateApplicationParametersMutation] = useMutation(
    UPDATE_APPLICATION_PARAMETERS,
    {
      refetchQueries: [APPLICATION_PARAMETERS],
    },
  )

  const pdfDimensionsLabel = getApplicationParameters?.find(
    p => p.area === 'pdfDimensionsLabel',
  )?.config

  const dimensionsWithLabels = constructSizeOptions(
    getAvailablePdfDimensions,
    pdfDimensionsLabel,
  )

  const handleLabelsUpdate = labels => {
    const variables = {
      input: {
        context: 'bookBuilder',
        area: 'pdfDimensionsLabel',
        config: JSON.stringify(labels),
      },
    }

    return updateApplicationParametersMutation({ variables })
  }

  return (
    <TemplateMananger
      addingTemplate={addingTemplate}
      addTemplate={addTemplate}
      availableDimensions={dimensionsWithLabels}
      disableLoading={disableLoading}
      disableTemplate={disableTemplate}
      enableTemplate={enableTemplate}
      loading={loading}
      onLabelsUpdate={handleLabelsUpdate}
      refreshingTemplate={refreshingTemplate}
      refreshTemplate={refreshTemplate}
      removeTemplate={removeTemplate}
      templatesData={getTemplates}
    />
  )
}

export default TemplateManangerPage
