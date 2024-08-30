import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

import { th, grid } from '@coko/client'

import fallback from '../../../static/imageFallback.png'

const Wrapper = styled.div`
  cursor: pointer;
  display: inline-flex;
  flex-direction: column;
  max-width: 85px;
  object-fit: cover;
`

const Marker = styled.div`
  background-color: ${th('colorText')};
  border-radius: 5px;
  height: ${grid(1)};
  margin: 0 auto ${grid(1)};
  transition: visibility 0.1s ease-in, width 0.1s ease-in;
  visibility: ${props => (props.selected ? 'visible' : 'hidden')};
  width: ${props => (props.selected ? grid(8) : 0)};

  /* stylelint-disable-next-line order/properties-alphabetical-order */
  ${props =>
    props.isDot &&
    css`
      border-radius: 50%;
      height: ${grid(2)};
      width: ${props.selected ? grid(2) : 0};
    `}
`

const Name = styled.div`
  align-items: center;
  text-align: center;
  text-transform: capitalize;
  word-wrap: break-word;

  /* > span {
    padding-bottom: ${grid(0.2)};
  } */

  /* stylelint-disable-next-line order/properties-alphabetical-order */
  ${props =>
    props.selected &&
    css`
      font-weight: bold;
      transition: font-weight 0.1s ease-in;

      /* > span {
        border-bottom: 2px solid ${th('colorPrimary')};
        transition: border 0.1s ease-in;
      } */
    `}
`

const TemplateImg = styled.img`
  border-color: transparent;
  border-radius: ${th('borderRadius')};
  border-style: solid;
  border-width: 3px;
  cursor: pointer;
  height: 100px;
  opacity: ${props => (props.selected ? 1 : 0.5)};
  transition: border 0.1s ease-in, opacity 0.1s ease-in;
  width: 82px;

  &:hover {
    border-color: ${th('colorBorder')};
    opacity: 1;
  }

  /* stylelint-disable-next-line order/properties-alphabetical-order */
  ${props =>
    props.selected &&
    css`
      border-color: ${th('colorText')};

      &:hover {
        border-color: ${th('colorPrimary')};
      }
    `}
`

const Template = props => {
  const { className, id, imageUrl, isSelected, name, onClick } = props

  const handleClick = () => onClick(id)

  return (
    <Wrapper className={className} key={id} onClick={handleClick}>
      <Marker
        // isDot
        selected={isSelected}
      />

      <TemplateImg
        alt={name}
        selected={isSelected}
        src={imageUrl || fallback}
      />

      <Name selected={isSelected}>
        <span data-test="preview-templateName">{name}</span>
      </Name>
    </Wrapper>
  )
}

Template.propTypes = {
  id: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  isSelected: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}

Template.defaultProps = {
  imageUrl: null,
}

export default Template
