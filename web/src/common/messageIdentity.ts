import type { HTMLAttributes } from 'react';

type MessageIdentity = {
  export_id: number;
  from_id: number;
  parent_id: number | null;
};

/** export_id, from_id и parent_id как DOM-атрибуты контейнера сообщения */
export function messageIdentityAttributes(
  identity: MessageIdentity
): HTMLAttributes<HTMLElement> {
  return {
    export_id: identity.export_id,
    from_id: identity.from_id,
    ...(identity.parent_id != null ? { parent_id: identity.parent_id } : {}),
  } as HTMLAttributes<HTMLElement>;
}
