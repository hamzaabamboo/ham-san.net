import { Box } from 'styled-system/jsx';

type Props = {
  children: string;
  inverted?: boolean;
};

export const SpecLabel = ({ children, inverted }: Props) => (
  <Box
    className={inverted ? 'spec-label spec-label-inverted' : 'spec-label'}
    zIndex="10"
    position="absolute"
    top="-1px"
    left="-1px"
    border="1px solid"
    py="0.5"
    px="1.5"
    color="#ffb000"
    fontFamily="JetBrains Mono, monospace"
    fontSize="10px"
    textTransform="uppercase"
  >
    {children}
  </Box>
);

export default SpecLabel;
