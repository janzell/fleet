import { gql } from 'apollo-boost';

const userFields = `id
    email
    first_name
    last_name`;

const GET_USER_LIST = gql`
  query getUsersList($limit: Int!, $offset: Int!) {
   users(limit: $limit, order_by: {created_at: asc}, offset: $offset) {
    ${userFields}
  }
}`;

export {GET_USER_LIST};
