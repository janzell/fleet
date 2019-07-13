import { gql } from 'apollo-boost';

const userFields = `id
    first_name
    last_name`;

const getUsersList = gql`
  query getUsersList($limit: Int!, $offset: Int!) {
   user(limit: $limit, order_by: {created_at: asc}, offset: $offset) {
    ${userFields}
  }
}`;

export {getUsersList};
