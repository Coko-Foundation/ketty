import React, { createContext, useMemo, useState } from 'react'
// We could use this cntext to simplify solutions for cases like this
export const GlobalContext = createContext()

export const GlobalContextProvider = ({ children }) => {
  const [filesToUpload, setFilesToUpload] = useState([])
  const [fileBeingUploaded, setFileBeingUploaded] = useState('')

  const value = useMemo(
    () => ({
      filesToUpload,
      setFilesToUpload,
      fileBeingUploaded,
      setFileBeingUploaded,
    }),
    [filesToUpload, fileBeingUploaded],
  )

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  )
}
