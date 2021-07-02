import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Dialogs } from '../Dialogs';
import { Dialog } from '../Dialogs/Dialog';

import { Container } from './styled';

export const Main = () => (
  <Container>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Dialogs}></Route>
        <Route path="/dialog/:id" component={Dialog}></Route>
      </Switch>
    </BrowserRouter>
  </Container>
);
