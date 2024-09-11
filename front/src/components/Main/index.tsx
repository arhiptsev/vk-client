import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Dialogs } from '../Dialogs';
import { Dialog } from '../Dialogs/Dialog';

import { Container } from './styled';

export const Main = () => (
  <Container>
    <BrowserRouter>
      <Routes>
        <Route  path="/" Component={Dialogs}></Route>
        <Route path="/dialog/:id" Component={Dialog}></Route>
      </Routes>
    </BrowserRouter>
  </Container>
);
