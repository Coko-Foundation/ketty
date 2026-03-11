import React from 'react'
import PropTypes from 'prop-types'
import { Divider } from '../common'
import AllowSignups from './AllowSignups'
import TermsAndConditions from './TermsAndConditions'
import A11StatementEditor from './A11yStatementEditor'

const GeneralSettings = props => {
  const {
    onSignupToggleChange,
    allowSignups,
    paramsLoading,
    termsAndConditions,
    onTCUpdate,
    a11yStatement,
    onA11yStatementUpdate,
  } = props

  return (
    <>
      <AllowSignups
        allowSignups={allowSignups}
        onSignupToggleChange={onSignupToggleChange}
        paramsLoading={paramsLoading}
      />
      <Divider />
      <TermsAndConditions
        onTCUpdate={onTCUpdate}
        termsAndConditions={termsAndConditions}
      />
      <Divider />
      <A11StatementEditor
        a11yStatement={a11yStatement}
        onA11yStatementUpdate={onA11yStatementUpdate}
      />
    </>
  )
}

GeneralSettings.propTypes = {
  onSignupToggleChange: PropTypes.func,
  allowSignups: PropTypes.bool,
  paramsLoading: PropTypes.bool,
  termsAndConditions: PropTypes.string,
  onTCUpdate: PropTypes.func,
  a11yStatement: PropTypes.string,
  onA11yStatementUpdate: PropTypes.func,
}
GeneralSettings.defaultProps = {
  onSignupToggleChange: null,
  allowSignups: false,
  paramsLoading: false,
  termsAndConditions: '',
  onTCUpdate: null,
  a11yStatement: '',
  onA11yStatementUpdate: null,
}

export default GeneralSettings
