import { isSelfMessage } from '../common/messageSide';
import { messageIdentityAttributes } from '../common/messageIdentity';
import type { QuotedMessage as QuotedMessageType } from '../db/types';
import { Attachments } from './attachments/Attachments';

const formatSenderName = (sender: QuotedMessageType['Sender']) => {
  if (!sender) return null;
  const name = [sender.first_name, sender.last_name].filter(Boolean).join(' ');
  return name || null;
};

type Props = {
  quoted: QuotedMessageType;
  selfFromId: number | null;
  alignBySender: boolean;
  highlightExportId?: number | null;
};

export const QuotedMessageView = ({
  quoted,
  selfFromId,
  alignBySender,
  highlightExportId,
}: Props) => {
  const senderName = formatSenderName(quoted.Sender);
  const hasText = !!quoted.text?.trim();
  const hasAttachments = quoted.Attachment.length > 0;
  const isEmpty =
    quoted.QuotedMessages.length === 0 && !senderName && !hasText && !hasAttachments;

  const identityProps = messageIdentityAttributes(quoted);
  const highlighted = highlightExportId === quoted.export_id;

  const nested = quoted.QuotedMessages.map((child) => (
    <QuotedMessageView
      key={child.export_id}
      quoted={child}
      selfFromId={selfFromId}
      alignBySender={alignBySender}
      highlightExportId={highlightExportId}
    />
  ));

  const body = (
    <>
      {nested}
      {senderName && <div className="message-quote-author">{senderName}</div>}
      {hasText && <div className="message-quote-text">{quoted.text}</div>}
      {hasAttachments && (
        <div className="message-quote-attachments">
          <Attachments attachments={quoted.Attachment} />
        </div>
      )}
    </>
  );

  if (!alignBySender) {
    const quoteClass = [
      'message-quote',
      highlighted ? 'message-quote--highlight' : '',
      isEmpty ? 'message-quote--empty' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={quoteClass} {...identityProps}>
        {isEmpty ? 'Сообщение' : body}
      </div>
    );
  }

  const isSelf =
    selfFromId != null ? isSelfMessage(quoted.from_id, selfFromId) : !!quoted.out;
  const quoteClass = [
    'message-quote',
    isSelf ? 'message-quote--self' : 'message-quote--peer',
    highlighted ? 'message-quote--highlight' : '',
    isEmpty ? 'message-quote--empty' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={`message-quote-row${isSelf ? ' message-quote-row--self' : ' message-quote-row--peer'}`}
    >
      <div className={quoteClass} {...identityProps}>
        {isEmpty ? 'Сообщение' : body}
      </div>
    </div>
  );
};
