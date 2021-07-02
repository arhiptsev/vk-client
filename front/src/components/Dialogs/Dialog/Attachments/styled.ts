import styled from 'styled-components';

export const Container = styled.div``;

export const MessageContainer = styled.div<{ $incoming: boolean }>`
  display: flex;
  justify-content: ${({ $incoming }) =>
    $incoming ? 'flex-end' : 'flex-start'};
  margin: 13px 0;
`;

export const Message = styled.div`
  background-color: #ccc;
  border-radius: 10px;
  padding: 7px;
  width: 80%;
`;
