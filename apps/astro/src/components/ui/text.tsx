import { styled } from 'styled-system/jsx';

type StyledTextProps = React.ComponentProps<typeof styled.p>;

export type TextProps = StyledTextProps & {
  size?: StyledTextProps['fontSize'];
};

export const Text = ({ size, fontSize, ...rest }: TextProps) => {
  return <styled.p fontSize={fontSize ?? size} {...rest} />;
};
