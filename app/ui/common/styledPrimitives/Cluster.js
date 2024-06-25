import styled from 'styled-components'

const Cluster = styled.div`
  --justify: space-around;
  /* ↓ Choose your alignment (flex-start is default) */
  align-items: center;
  /* ↓ Set the Flexbox context */
  display: flex;
  /* ↓ Enable wrapping */
  flex-wrap: wrap;
  /* ↓ Set the space/gap */
  gap: var(--cluster-gap, 1rem);
  /* ↓ Choose your justification (flex-start is default) */
  justify-content: var(--justify);
`

export default Cluster
