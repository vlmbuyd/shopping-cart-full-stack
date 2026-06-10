import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const Skeleton = styled.div<{
  width?: string;
  height?: string;
  borderRadius?: string;
}>`
  width: ${({ width }) => width ?? '100%'};
  height: ${({ height }) => height ?? '16px'};
  border-radius: ${({ borderRadius }) => borderRadius ?? '4px'};
  background-color: #eeeeee;
  background-image: linear-gradient(
    90deg,
    #eeeeee 0px,
    #f5f5f5 40px,
    #eeeeee 80px
  );
  background-size: 200px 100%;
  background-repeat: no-repeat;
  animation: ${shimmer} 1.2s ease-in-out infinite;
`;

export default Skeleton;
