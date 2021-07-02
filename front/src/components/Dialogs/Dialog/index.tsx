import React from 'react';
import MailIcon from '@material-ui/icons/Mail';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import Badge from '@material-ui/core/Badge';

import { MESSAGES_QUERY } from '@graphql';
import { Message as MessageType } from '@graphql/types';
import { useParams } from 'react-router';

import { Attachments } from './Attachments';
import { useScrollLoading } from './hooks';

import {
  Container,
  ScrollContainer,
  Message,
  DownButton,
  MessageContainer,
  Toolbar,
} from './styled';
import { useRef } from 'react';

export const Dialog = () => {
  const { id: conversation_id } = useParams<{ id: string }>();

  const {
    scrollHandler,
    items: messages,
    loading,
  } = useScrollLoading<MessageType>(
    MESSAGES_QUERY,
    (res) => res.messages,
    (skip) => ({ conversation_id: Number(conversation_id), skip })
  );

  const scroll = useRef<HTMLDivElement>(null);

  if (loading && !messages.length) return <div>Loading</div>;

  return (
    <Container>
      <ScrollContainer ref={scroll} onScroll={scrollHandler}>
        {messages.map(({ export_id, out, text, Attachment }) => (
          <MessageContainer key={export_id} $incoming={!out}>
            <Message>
              {text}
              {Attachment && <Attachments attachments={Attachment} />}
            </Message>
          </MessageContainer>
        ))}
      </ScrollContainer>
      <Toolbar>
        <Badge color="primary" badgeContent={messages.length} max={1000000}>
          <MailIcon />
        </Badge>
        <DownButton
          size="medium"
          onClick={() => {
            scroll.current?.scrollTo(0, scroll.current.scrollHeight);
          }}
        >
          <ArrowDownwardIcon fontSize="inherit" />
        </DownButton>
      </Toolbar>
    </Container>
  );
};
