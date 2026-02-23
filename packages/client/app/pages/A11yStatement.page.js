import React from 'react'
import styled from 'styled-components'
import { th } from '@coko/client'
import { Center } from '../ui'

const Wrapper = styled(Center)`
  font-size: 120%;
  line-height: 1.5;
  padding: 1rem 1rem 5rem;
`

const Title = styled.h1`
  border-bottom: 2px solid ${th('colorPrimary')};
`

const A11Statement = () => {
  return (
    <Wrapper>
      <Title>Accessibility Statement for Ketty</Title>
      <p>
        We are committed to ensuring that Ketty is accessible to everyone,
        regardless of ability or technology. We believe that creating and
        editing books should be an inclusive experience for all writers,
        editors, and readers.
      </p>
      <h2>Our Efforts</h2>
      <p>
        We have designed Ketty with accessibility in mind and strive to conform
        to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. These
        guidelines help make web content more accessible to people with a wide
        range of disabilities, including blindness, low vision, hearing loss,
        mobility impairments, and cognitive limitations.
      </p>
      <p>
        We regularly test our application using automated tools and manual
        reviews with keyboard-only navigation.
      </p>
      <h2>Accessibility Features</h2>
      <ul>
        <li>
          <strong>Keyboard Navigation</strong>: All core editing functions can
          be accessed and used with a keyboard.
        </li>

        <li>
          <strong>Screen Reader Compatibilit</strong>y: We have used semantic
          HTML and ARIA labels to ensure compatibility with screen readers.
        </li>

        <li>
          <strong>Adjustable Text</strong>: Users can resize text up to 200%
          without loss of content or functionality.
        </li>

        <li>
          <strong>Color Contrast</strong>: Text and interactive elements meet
          minimum color contrast requirements.
        </li>

        <li>
          <strong>Focus Indicators</strong>: Visible focus indicators help users
          navigate using keyboards.
        </li>
      </ul>
      <h2>Known Limitations</h2>
      <p>
        While we strive for full accessibility, some areas may need improvement:
      </p>
      <ul>
        <li>
          Third-party libraries: Some embedded tools (e.g., rich text editor
          plugins) may have minor accessibility gaps. We are actively working
          with vendors to address these.
        </li>

        <li>
          Legacy content: User-uploaded content (e.g., imported manuscripts) may
          not always meet accessibility standards, but we provide guidance on
          creating accessible content.
        </li>
      </ul>
      <p>If you encounter any barriers, please let us know.</p>
      <h2>Feedback and Contact</h2>
      <p>
        We welcome your feedback on the accessibility of Ketty. If you have
        specific needs or encounter issues, please contact us:
      </p>
      Email: accessibility@[appname].com Contact form: [Link to contact form]
      Phone: [Optional: phone number with TTY if available] We aim to respond to
      accessibility feedback within [X] business days.
      <h2>Ongoing Commitment</h2>
      <p>
        We are continuously working to improve the accessibility of our app.
        This statement was last updated on [Date] and will be reviewed regularly
        as we enhance our features.
      </p>
    </Wrapper>
  )
}

export default A11Statement
