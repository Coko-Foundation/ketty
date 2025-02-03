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
  const [isFirstRun, setFirstRun] = useState(true)
  const [checkedInline, setCheckedInline] = useState(inlineAnno)
  const [checkedLists, setCheckedLists] = useState(lists)
  const [checkedSingleTools, setCheckedSingleTools] = useState(SingleTools)

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
    savedWaxMenuConfig.find((menuItem, i) => {
      if (menuItem.name === 'Annotations') {
        setCheckedInline(prevState =>
          prevState.map(item =>
            menuItem.exclude.includes(item.value)
              ? { ...item, checked: false }
              : item,
          ),
        )
      }

      if (menuItem.name === 'Lists') {
        setCheckedLists(prevState =>
          prevState.map(item =>
            menuItem.exclude.includes(item.value)
              ? { ...item, checked: false }
              : item,
          ),
        )
      }

      if (!isObject(menuItem)) {
        setCheckedSingleTools(prevState =>
          prevState.map(item =>
            menuItem === item.value && !item.checked
              ? { ...item, checked: false }
              : item,
          ),
        )
      }

      return false
    })
  }, [])

  // create Wax menu config everytime a checkbox changes. (don't run the first time)
  useEffect(() => {
    let firstRunTimeout = () => true

    if (isFirstRun) {
      firstRunTimeout = setTimeout(() => {
        setFirstRun(false)
      }, 400)
      return false
    }

    const excludeInline = []
    const excludeLists = []
    const excludeSingleTools = []

    checkedInline.forEach(inline => {
      if (!inline.checked) {
        excludeInline.push(inline.value)
      }
    })

    checkedLists.forEach(list => {
      if (!list.checked) {
        excludeLists.push(list.value)
      }
    })

    checkedSingleTools.forEach(singleTool => {
      if (!singleTool.checked) {
        excludeSingleTools.push(singleTool.value)
      }
    })

    savedWaxMenuConfig.find((menuItem, i) => {
      if (menuItem.name === 'Annotations') {
        savedWaxMenuConfig[i].exclude = excludeInline
      }

      if (menuItem.name === 'Lists') {
        savedWaxMenuConfig[i].exclude = excludeLists
      }

      // if (!isObject(menuItem)) {
      // }

      // console.log(savedWaxMenuConfig, checkedSingleTools)

      return false
    })

    // save to settings modal
    saveWaxTools(savedWaxMenuConfig)

    return () => clearTimeout(firstRunTimeout)
  }, [checkedInline, checkedLists, checkedSingleTools])

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
