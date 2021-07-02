import styled from 'styled-components';

export const PhotoContainer = styled.div`
  max-width: 200px;
  display: flex;

  & > * :not(:first-child) {
    margin-left: 10px;
  }
`;

export const PhotoImg = styled.img`
  max-width: 200px;
`;
