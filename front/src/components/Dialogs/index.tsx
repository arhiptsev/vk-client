import { useQuery } from '@apollo/client';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { CONVERSATIONS_QUERY } from '../../graphql';
import { Conversation } from '../../graphql/types';

import { Container, TableRowStyled } from './styled';
import { useNavigate  } from 'react-router-dom';

type ConversationResponse = { conversations: Conversation[] };

export const Dialogs = () => {
  const { data, error, loading } =
    useQuery<ConversationResponse>(CONVERSATIONS_QUERY);

  const navigate  = useNavigate();
  const goToDialog = (id: number) => navigate(`/dialog/${id}`);

  if (!data) return null;
  const { conversations } = data;

  return (
    <Container>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Имя</TableCell>
              <TableCell>Количество сообщений</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {conversations.map(({ export_id, Peer, countMessages }) => {
              const { first_name, last_name } = Peer.UserInfo;

              return (
                <TableRowStyled
                  onClick={() => goToDialog(export_id)}
                  key={export_id}
                >
                  <TableCell component="th" scope="row">
                    {export_id}
                  </TableCell>
                  <TableCell>
                    {first_name} {last_name}
                  </TableCell>
                  <TableCell>{countMessages}</TableCell>
                </TableRowStyled>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};
