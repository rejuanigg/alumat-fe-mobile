import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { colors } from '../theme/tokens';

export type IconName =
  | 'back'
  | 'eye'
  | 'eyeOff'
  | 'check'
  | 'search'
  | 'edit'
  | 'trash'
  | 'home'
  | 'box'
  | 'user'
  | 'plus'
  | 'image'
  | 'chevronDown'
  | 'chevronRight'
  | 'grid';

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export function Icon({ name, size = 24, color = colors.ink, strokeWidth = 2 }: Props) {
  const common = {
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {renderShape(name, common)}
    </Svg>
  );
}

type Common = {
  stroke: string;
  strokeWidth: number;
  strokeLinecap: 'round';
  strokeLinejoin: 'round';
  fill: string;
};

function renderShape(name: IconName, c: Common) {
  switch (name) {
    case 'back':
      return <Path d="M15 5l-7 7 7 7" {...c} />;
    case 'eye':
      return (
        <>
          <Path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" {...c} />
          <Circle cx={12} cy={12} r={3} {...c} />
        </>
      );
    case 'eyeOff':
      return (
        <>
          <Path d="M10.6 5.1A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-2.6 3.4M6.6 6.6C3.7 8.4 2 12 2 12s3.6 7 10 7a9.7 9.7 0 0 0 5.4-1.6" {...c} />
          <Path d="M9.9 9.9a3 3 0 0 0 4.2 4.2M3 3l18 18" {...c} />
        </>
      );
    case 'check':
      return <Path d="M5 12.5l4.5 4.5L19 7.5" {...c} />;
    case 'search':
      return (
        <>
          <Circle cx={11} cy={11} r={6.5} {...c} />
          <Path d="M20 20l-4.2-4.2" {...c} />
        </>
      );
    case 'edit':
      return <Path d="M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4" {...c} />;
    case 'trash':
      return <Path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13M10 11v5.5M14 11v5.5" {...c} />;
    case 'home':
      return <Path d="M3.5 10.5L12 4l8.5 6.5V20h-5.5v-6h-6v6H3.5z" {...c} />;
    case 'box':
      return (
        <>
          <Rect x={4} y={4} width={7} height={7} rx={1} {...c} />
          <Rect x={13} y={4} width={7} height={7} rx={1} {...c} />
          <Rect x={4} y={13} width={7} height={7} rx={1} {...c} />
          <Rect x={13} y={13} width={7} height={7} rx={1} {...c} />
        </>
      );
    case 'grid':
      return (
        <>
          <Rect x={4} y={4} width={16} height={16} rx={1.5} {...c} />
          <Path d="M12 4v16M4 12h16" {...c} />
        </>
      );
    case 'user':
      return (
        <>
          <Circle cx={12} cy={8} r={4} {...c} />
          <Path d="M4 20.5c1.4-3.7 4.4-5.5 8-5.5s6.6 1.8 8 5.5" {...c} />
        </>
      );
    case 'plus':
      return <Path d="M12 5v14M5 12h14" {...c} />;
    case 'image':
      return (
        <>
          <Rect x={3.5} y={4.5} width={17} height={15} rx={1.5} {...c} />
          <Circle cx={9} cy={10} r={1.8} {...c} />
          <Path d="M20.5 16l-5-5-9 8.5" {...c} />
        </>
      );
    case 'chevronDown':
      return <Path d="M6 9l6 6 6-6" {...c} />;
    case 'chevronRight':
      return <Path d="M9 6l6 6-6 6" {...c} />;
  }
}
