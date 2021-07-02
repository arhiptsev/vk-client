import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';

export const DownButton = styled(IconButton)``;

export const Container = styled.div`
  display: grid;
  grid-template-columns: 770px 70px;
  height: 100vh;
`;

export const Toolbar = styled.div`
  display: flex;
  flex-direction: column-reverse;
  justify-content: center;
  align-items: center;

  & > * {
    margin: 20px 0;
  }
`;

export const ScrollContainer = styled.div`
  padding: 15px;
  height: 100%;
  overflow: scroll;
  background-color: #ffffff;
`;

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
