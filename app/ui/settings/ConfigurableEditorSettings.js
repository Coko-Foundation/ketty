/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import isObject from 'lodash/isObject'
import { Checkbox } from '../common'

const Wrapper = styled.div`
  display: flex;
  flex-flow: column;
  padding-top: 15px;
`

const ToolGroup = styled.div`
  display: flex;
  flex-flow: ${props => (props.vertical ? 'column' : 'row')};
  padding-bottom: 15px;
`

const ToolName = styled.span`
  font-weight: 600;
  margin-right: 10px;
`

const Tool = styled.div`
  display: flex;
  flex-flow: row;
  flex-wrap: wrap;
  justify-content: flex-start;
`

const inlineAnno = [
  { label: 'Strong', value: 'Strong', checked: true },
  { label: 'Emphasis', value: 'Emphasis', checked: true },
  { label: 'Code', value: 'Code', checked: true },
  { label: 'Link', value: 'LinkTool', checked: true },
  { label: 'Underline', value: 'Underline', checked: true },
  { label: 'Subscript', value: 'Subscript', checked: false },
  { label: 'Superscript', value: 'Superscript', checked: false },
  { label: 'SmallCaps', value: 'SmallCaps', checked: false },
  { label: 'Strike Through', value: 'StrikeThrough', checked: false },
]

const lists = [
  { label: 'Ordered Lists', value: 'OrderedList', checked: true },
  { label: 'Unordered Lists', value: 'BulletList', checked: true },
  { label: 'BlockQuote', value: 'BlockQuote', checked: true },
  { label: 'Lift Block', value: 'Lift', checked: true },
  { label: 'Join with Above Block', value: 'JoinUp', checked: false },
]

const SingleTools = [
  { label: 'Images', value: 'Images', checked: true },
  { label: 'Special Characters', value: 'SpecialCharacters', checked: true },
  { label: 'Find And Replace', value: 'FindAndReplaceTool', checked: true },
]

const ConfigurableEditorSettings = ({ savedWaxMenuConfig, saveWaxTools }) => {
  const [checkedInline, setCheckedInline] = useState(inlineAnno)
  const [checkedLists, setCheckedLists] = useState(lists)
  const [checkedSingleTools, setCheckedSingleTools] = useState(SingleTools)
  const [waxMenuConfig, setWaxMenuConfig] = useState(savedWaxMenuConfig)

  const onChangeInline = e => {
    setCheckedInline(
      checkedInline.map(item => {
        return item.value === e.target.value
          ? { ...item, checked: !item.checked }
          : item
      }),
    )
  }

  const onChangeLists = e => {
    setCheckedLists(
      checkedLists.map(item => {
        return item.value === e.target.value
          ? { ...item, checked: !item.checked }
          : item
      }),
    )
  }

  const onChangeSingleTool = e => {
    setCheckedSingleTools(
      checkedSingleTools.map(item => {
        return item.value === e.target.value
          ? { ...item, checked: !item.checked }
          : item
      }),
    )
  }

  // create checkbox selection from saved menu
  useEffect(() => {
    waxMenuConfig.find((menuItem, i) => {
      if (menuItem.name === 'Annotations') {
        setCheckedInline(prevState =>
          prevState.map(item =>
            menuItem.exclude.includes(item.value)
              ? { ...item, checked: false }
              : { ...item, checked: true },
          ),
        )
      }

      if (menuItem.name === 'Lists') {
        setCheckedLists(prevState =>
          prevState.map(item =>
            menuItem.exclude.includes(item.value)
              ? { ...item, checked: false }
              : { ...item, checked: true },
          ),
        )
      }

      if (!isObject(menuItem)) {
        setCheckedSingleTools(prevTools =>
          prevTools.map(tool => ({
            ...tool,
            checked: waxMenuConfig.includes(tool.value),
          })),
        )
      }

      return false
    })
  }, [])

  // create Wax menu config everytime a checkbox changes.
  useEffect(() => {
    const excludeSingleTools = checkedSingleTools
      .filter(singleItem => !singleItem.checked)
      .map(singleItem => singleItem.value)

    setWaxMenuConfig(prevConfig =>
      prevConfig.map(menuItem => {
        if (typeof menuItem === 'object' && menuItem.name === 'Annotations') {
          return {
            ...menuItem,
            exclude: checkedInline
              .filter(inlineItem => !inlineItem.checked)
              .map(inlineItem => inlineItem.value),
          }
        }

        if (typeof menuItem === 'object' && menuItem.name === 'Lists') {
          return {
            ...menuItem,
            exclude: checkedLists
              .filter(listItem => !listItem.checked)
              .map(listItem => listItem.value),
          }
        }

        if (!isObject(menuItem)) {
          setWaxMenuConfig(prevWaxConfig => {
            const filteredConfig = prevWaxConfig.filter(
              singleMenuItem => !excludeSingleTools.includes(singleMenuItem),
            )

            const newItems = checkedSingleTools
              .filter(
                tool => tool.checked && !filteredConfig.includes(tool.value),
              )
              .map(tool => tool.value)

            return [...filteredConfig, ...newItems]
          })
        }

        return menuItem
      }),
    )
  }, [checkedInline, checkedLists, checkedSingleTools])

  // save to settings modal
  saveWaxTools(waxMenuConfig)

  return (
    <Wrapper>
      <ToolGroup vertical>
        <ToolName>Inline Annotations</ToolName>
        <Tool>
          {checkedInline.map(anno => {
            return (
              <Checkbox
                checked={anno.checked}
                onChange={onChangeInline}
                value={anno.value}
              >
                {anno.label}
              </Checkbox>
            )
          })}
        </Tool>
      </ToolGroup>
      <ToolGroup vertical>
        <ToolName>Lists &amp; BlockQuote</ToolName>
        <Tool>
          {checkedLists.map(listTool => {
            return (
              <Checkbox
                checked={listTool.checked}
                onChange={onChangeLists}
                value={listTool.value}
              >
                {listTool.label}
              </Checkbox>
            )
          })}
        </Tool>
      </ToolGroup>

      {checkedSingleTools.map(singleTool => {
        return (
          <ToolGroup>
            <ToolName>{singleTool.label}</ToolName>
            <Tool>
              <Checkbox
                checked={singleTool.checked}
                onChange={onChangeSingleTool}
                value={singleTool.value}
              />
            </Tool>
          </ToolGroup>
        )
      })}
    </Wrapper>
  )
}

ConfigurableEditorSettings.propTypes = {
  savedWaxMenuConfig: PropTypes.arrayOf(PropTypes.string).isRequired,
  saveWaxTools: PropTypes.func.isRequired,
}

export default ConfigurableEditorSettings
