import React from 'react';
import { withAuthorization } from './Session';
import { LOGIN as loginRoute } from '../constants/routes';

const AdminPage = () => (
  <div>
    <h1>Admin Page</h1>
  </div>
);

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition, loginRoute.path)(AdminPage);
