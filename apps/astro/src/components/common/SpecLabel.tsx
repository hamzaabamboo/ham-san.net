import { Box } from 'styled-system/jsx'

type Props = {
  children: string
  inverted?: boolean
}

export const SpecLabel = ({ children, inverted }: Props) => (
  <Box
    position="absolute"
    top="-1px"
    left="-1px"
    px="1.5"
    py="0.5"
    bg={inverted ? '#432c00' : '#353534'}
    border="1px solid"
    borderColor={inverted ? '#432c00' : '#524533'}
    fontFamily="JetBrains Mono, monospace"
    fontSize="10px"
    textTransform="uppercase"
    color="#ffb000"
    zIndex="10"
  >
    {children}
  </Box>
)

export default SpecLabel

