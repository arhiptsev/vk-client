import React from 'react';

import { PhotoContainer, PhotoImg } from './styled';

import { Photo as PhotoType } from '@graphql/types';
import { PHOTO_URL } from '../../../../../common/constants';

export const Photo = ({
  export_id,
  album_id,
  date,
  id,
  owner_id,
  has_tags,
  lat,
  long,
  access_key,
  text,
  user_id,
  post_id,
  attachment_export_id,
  photo_256,
  place,
  type,
  PhotoSize,
}: PhotoType) => {
  // console.log('photo');
  const file = PhotoSize?.find((i) => i.file);
  console.log(type);
  return (
    <PhotoContainer>
      {file?.file ? (
        <PhotoImg src={PHOTO_URL + file.file} />
      ) : (
        'Нет данных о файле фото'
      )}
    </PhotoContainer>
  );
};
