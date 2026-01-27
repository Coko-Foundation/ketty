import React from 'react'
import PropTypes from 'prop-types'

const SinglePage = ({ ariaLabel }) => (
  <span
    aria-label={ariaLabel}
    className="anticon anticon-single-page"
    role="img"
  >
    <svg
      height="1em"
      id="Layer_1"
      version="1.1"
      viewBox="0 0 3873 3873"
      width="1em"
    >
      <g id="Layer_1_00000062156367189633152660000005062996654787094945_">
        <g>
          <polygon
            fill="transparent"
            points="2511.9,341.6 2511.9,907.6 3077.9,907.6"
            stroke="currentColor"
            strokeWidth="200"
          />
          <path
            d="M743.1,285.8v3314.1h2391.5v-2612h-662.8c-22,0-40.1-18.1-40.1-40.1v-662
			L743.1,285.8L743.1,285.8z M1189.4,1495.7h1497.2c22,0,40.1,18.1,40.1,40.1s-18.1,40.1-40.1,40.1H1189.4
			c-22,0-40.1-18.1-40.1-40.1C1150.1,1513,1167.4,1495.7,1189.4,1495.7L1189.4,1495.7z M1189.4,2253.7h1497.2
			c22,0,40.1,18.1,40.1,40.1s-18.1,40.1-40.1,40.1H1189.4c-22,0-40.1-18.1-40.1-40.1C1150.1,2271,1167.4,2253.7,1189.4,2253.7
			L1189.4,2253.7z M1189.4,3011.8h1497.2c22,0,40.1,18.1,40.1,40.1s-18.1,40.1-40.1,40.1H1189.4c-22,0-40.1-18.1-40.1-40.1
			C1150.1,3029.9,1167.4,3011.8,1189.4,3011.8z"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="200"
          />
        </g>
      </g>
    </svg>
  </span>
)

SinglePage.propTypes = {
  ariaLabel: PropTypes.string,
}

SinglePage.defaultProps = {
  ariaLabel: 'Single page',
}

export default SinglePage
