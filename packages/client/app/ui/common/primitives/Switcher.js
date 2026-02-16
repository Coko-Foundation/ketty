import styled from 'styled-components'

export default styled.div`
  --s1: 1rem;
  display: flex;
  flex-wrap: wrap;
  /* ↓ The default value is the first point on the modular scale */
  gap: var(--gutter, var(--s1));
  /* ↓ The width at which the layout “breaks” */
  --threshold: 50rem;

  > * {
    /* ↓ Switch the layout at the --threshold */
    flex-basis: calc((var(--threshold) - 100%) * 999);
    /* ↓ Allow children to grow */
    flex-grow: 1;
  }

  > :nth-last-child(n + 5),
  > :nth-last-child(n + 5) ~ * {
    /* ↓ Switch to a vertical configuration if
        there are more than 4 child elements */
    flex-basis: 100%;
  }
`
