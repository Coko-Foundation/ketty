/* eslint-disable react/prop-types */
import React from 'react'
import { Divider } from 'antd'
import ProfileRow from './ProfileRow'
import ExportOptionsSection from './ExportOptionsSection'
import Footer from './Footer'
import LuluIntegration from './LuluIntegration'
import FlaxIntegration from './FlaxIntegration'

const SavedProfilesTab = props => {
  const {
    canModify,
    handleProfileChange,
    renameProfile,
    profiles,
    selectedProfileSelectOption,
    optionsDisabled,
    isbns,
    selectedProfile,
    handleOptionsChange,
    currentOptions,
    templates,
    createProfile,
    isDownloadButtonDisabled,
    loadingPreview,
    hasChanges,
    onClickDownload,
    updateProfileOptions,
    onClickDelete,
    exportsConfig,
    onPublish,
    // lulu integration
    luluConfig,
    canUploadToProvider,
    isUserConnectedToLulu,
    isProfileSyncedWithLulu,
    projectId,
    projectUrl,
    lastSynced,
    onClickConnectToLulu,
    sendToLulu,
  } = props

  const profileSelected = selectedProfile && selectedProfile !== 'new-export'

  return (
    <>
      <ProfileRow
        canModifyProfiles={canModify}
        onProfileChange={handleProfileChange}
        profiles={profiles.map(p => ({ label: p.label, value: p.value }))}
        selectedProfile={profileSelected ? selectedProfileSelectOption : {}}
      />
      {profileSelected && (
        <>
          <ExportOptionsSection
            canModifyProfiles={canModify}
            disabled={optionsDisabled}
            exportsConfig={exportsConfig}
            includeEpub={currentOptions.includeEpub}
            includePdf={currentOptions.includePdf}
            isbns={isbns}
            newProfile={!selectedProfile}
            onChange={handleOptionsChange}
            onProfileRename={renameProfile}
            selectedContent={currentOptions.content}
            selectedFormat={currentOptions.format}
            selectedIsbn={currentOptions.isbn}
            selectedProfile={selectedProfileSelectOption}
            selectedSize={currentOptions.size}
            selectedTemplate={currentOptions.template}
            templates={templates}
          />
          <Divider />
          {luluConfig &&
          (currentOptions.format === 'pdf' ||
            currentOptions.format === 'epub') ? (
            <LuluIntegration
              canUploadToProvider={canUploadToProvider}
              isConnected={isUserConnectedToLulu}
              isInLulu={!!projectId}
              isSynced={isProfileSyncedWithLulu}
              lastSynced={lastSynced}
              luluConfig={luluConfig}
              onClickConnect={onClickConnectToLulu}
              onClickSendToLulu={sendToLulu}
              projectId={projectId}
              projectUrl={projectUrl}
            />
          ) : null}
          {currentOptions.format === 'web' ? (
            <FlaxIntegration
              includeEpub={currentOptions.includeEpub}
              includePdf={currentOptions.includePdf}
              onPublish={onPublish}
              profiles={profiles}
              type="primary"
            >
              Publish Online
            </FlaxIntegration>
          ) : null}

          <Footer
            canModify={canModify}
            createProfile={createProfile}
            isDownloadButtonDisabled={isDownloadButtonDisabled}
            isNewProfileSelected={false}
            isSaveDisabled={
              !canModify ||
              loadingPreview ||
              (!!selectedProfileSelectOption && !hasChanges)
            }
            loadingPreview={loadingPreview}
            onClickDelete={onClickDelete}
            onClickDownload={onClickDownload}
            selectedFormat={currentOptions.format}
            updateProfile={updateProfileOptions}
          />
        </>
      )}
    </>
  )
}

export default SavedProfilesTab
