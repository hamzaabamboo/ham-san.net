import { FaGitAlt, FaNodeJs, FaReact } from 'react-icons/fa';
import {
  SiAstro,
  SiDocker,
  SiFigma,
  SiGraphql,
  SiNextdotjs,
  SiPostgresql,
  SiTailwindcss,
  SiTypescript
} from 'react-icons/si';
import { css } from 'styled-system/css';
import { Box, Flex } from 'styled-system/jsx';

const icons = [
  { icon: FaReact, name: 'React' },
  { icon: SiTypescript, name: 'TypeScript' },
  { icon: SiNextdotjs, name: 'Next.js' },
  { icon: SiAstro, name: 'Astro' },
  { icon: SiTailwindcss, name: 'Tailwind' },
  { icon: FaNodeJs, name: 'Node.js' },
  { icon: SiGraphql, name: 'GraphQL' },
  { icon: SiPostgresql, name: 'PostgreSQL' },
  { icon: SiDocker, name: 'Docker' },
  { icon: FaGitAlt, name: 'Git' },
  { icon: SiFigma, name: 'Figma' }
];

export const Marquee = () => {
  return (
    <Box
      position="relative"
      borderY="1px solid"
      borderColor="#524533"
      py="8"
      bg="#2a2a2a"
      overflow="hidden"
    >
      <Box
        className={css({
          animation: 'marquee 40s linear infinite',
          _hover: { animationPlayState: 'paused' }
        })}
        display="flex"
        w="max-content"
      >
        {[...Array(2)].map((_, i) => (
          <Flex key={i} gap="16" px="8">
            {icons.map((Item, idx) => (
              <Flex key={idx} gap="3" flexShrink={0} align="center" color="#c7c6c6">
                <Item.icon size={32} />
                <Box fontSize="xl" fontWeight="bold" whiteSpace="nowrap">
                  {Item.name}
                </Box>
              </Flex>
            ))}
          </Flex>
        ))}
      </Box>

      <Box
        position="absolute"
        top="0"
        left="0"
        w="24"
        h="full"
        bgGradient="to-r"
        gradientFrom="#2a2a2a"
        gradientTo="transparent"
        zIndex="1"
      />
      <Box
        position="absolute"
        top="0"
        right="0"
        w="24"
        h="full"
        bgGradient="to-l"
        gradientFrom="#2a2a2a"
        gradientTo="transparent"
        zIndex="1"
      />
    </Box>
  );
};
