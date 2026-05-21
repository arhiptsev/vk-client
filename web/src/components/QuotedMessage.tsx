import { Attachments } from './attachments/Attachments';
import type { QuotedMessage as QuotedMessageType } from '../db/types';

const formatSenderName = (sender: QuotedMessageType['Sender']) => {
  if (!sender) return null;
  const name = [sender.first_name, sender.last_name].filter(Boolean).join(' ');
  return name || null;
};

type Props = {
  quoted: QuotedMessageType;
};

export const QuotedMessageView = ({ quoted }: Props) => {
  const senderName = formatSenderName(quoted.Sender);
  const hasText = !!quoted.text?.trim();
  const hasAttachments = quoted.Attachment.length > 0;

  if (!senderName && !hasText && !hasAttachments) {
    return <div className="message-quote message-quote--empty">Сообщение</div>;
  }

  return (
    <div className="message-quote">
      {senderName && <div className="message-quote-author">{senderName}</div>}
      {hasText && <div className="message-quote-text">{quoted.text}</div>}
      {hasAttachments && (
        <div className="message-quote-attachments">
          <Attachments attachments={quoted.Attachment} />
        </div>
      )}
    </div>
  );
};
