import { useEffect, useRef } from 'react'

/* eslint-disable import/prefer-default-export */
export const usePrevious = value => {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

export const getInitials = fullname => {
  const deconstructName = fullname.split(' ')
  return `${deconstructName[0][0].toUpperCase()}${
    deconstructName[1][0] && deconstructName[1][0].toUpperCase()
  }`
}

// apply alpha channel to a hex color
export const withAlpha = (hexColor, alpha) => {
  let hex = hexColor.replace('#', '')

  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  }

  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export const themeInitializer = () => {
  const selected = localStorage.getItem('ketty-theme')

  if (selected) {
    return selected
  }

  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'

  localStorage.setItem('ketty-theme', systemTheme)

  return systemTheme
}
