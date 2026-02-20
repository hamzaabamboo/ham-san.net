import { styled } from 'styled-system/jsx';

type StyledHeadingProps = React.ComponentProps<typeof styled.h2>;

export type HeadingProps = StyledHeadingProps & {
  size?: StyledHeadingProps['fontSize'];
};

export const Heading = ({ size, fontSize, ...rest }: HeadingProps) => {
  return <styled.h2 fontSize={fontSize ?? size} {...rest} />;
};
