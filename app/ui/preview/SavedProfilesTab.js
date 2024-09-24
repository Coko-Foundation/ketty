/* eslint-disable react/prop-types */
import React from 'react'
import { Divider } from 'antd'
import ProfileRow from './ProfileRow'
import ExportOptionsSection from './ExportOptionsSection'
import Footer from './Footer'
import LuluIntegration from './LuluIntegration'
import FlaxIntegration from './FlaxIntegration'
import { Ribbon } from '../common'

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
    // end lulu integration
    publishing,
    webPublishInfo,
    onUnpublish,
  } = props

  const profileSelected = selectedProfile && selectedProfile !== 'new-export'

  return (
    <>
      <div>
        <ProfileRow
          canModifyProfiles={canModify}
          loadingPreview={loadingPreview}
          onProfileChange={handleProfileChange}
          profiles={profiles.map(p => ({ label: p.label, value: p.value }))}
          selectedProfile={profileSelected ? selectedProfileSelectOption : {}}
        />
        {profileSelected && canModify && hasChanges && (
          <Ribbon hide={!hasChanges || !canModify}>
            You have unsaved changes
          </Ribbon>
        )}
      </div>
      {profileSelected && (
        <>
          <ExportOptionsSection
            canModifyProfiles={canModify}
            disabled={optionsDisabled}
            epubProfileId={currentOptions.epubProfileId}
            exportsConfig={exportsConfig}
            includeEpub={currentOptions.includeEpub}
            includePdf={currentOptions.includePdf}
            isbns={isbns}
            newProfile={!selectedProfile}
            onChange={handleOptionsChange}
            onProfileRename={renameProfile}
            pdfProfileId={currentOptions.pdfProfileId}
            previewLoading={loadingPreview}
            profiles={currentOptions.format === 'web' ? profiles : null}
            selectedContent={currentOptions.content}
            selectedFormat={currentOptions.format}
            selectedIsbn={currentOptions.isbn}
            selectedProfile={selectedProfileSelectOption}
            selectedSize={currentOptions.size}
            selectedTemplate={currentOptions.template}
            templates={templates}
          />
          <Divider />
          {!!luluConfig &&
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
              epubProfile={currentOptions.epubProfileId}
              includeEpub={currentOptions.includeEpub}
              includePdf={currentOptions.includePdf}
              onPublish={onPublish}
              onUnpublish={onUnpublish}
              pdfProfile={currentOptions.pdfProfileId}
              previewLoading={loadingPreview}
              profiles={profiles}
              publishing={publishing}
              selectedTemplate={templates.find(
                template => template.id === currentOptions.template,
              )}
              webPublishInfo={webPublishInfo}
            />
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
