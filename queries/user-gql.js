import {gql} from 'apollo-boost';

const userFields = `id
    first_name
    last_name
    email
    created_at
    updated_at
    `;


const GET_USERS_LIST = gql`
    query getUsersList($limit: Int!, $offset: Int!, $order_by: [users_order_by!], $where: users_bool_exp) {
        users(limit: $limit, offset: $offset, order_by: $order_by, where: $where) {
            ${userFields}
        }
    }`;

const USERS_SUBSCRIPTION = gql`
    subscription onUsersAdded($limit: Int, $offset: Int, $order_by: [users_order_by!]) {
        users(limit: $limit, offset: $offset, order_by: $order_by){
            ${userFields}
        }
    }
`;

const ADD_USER = gql`
    mutation addUser($user: [users_insert_input!]!) {
        insert_users(objects: $user) {
            affected_rows
            returning {
                ${userFields}
            }
        }
    }`;

const DELETE_USER = gql`
    mutation deleteUser($id: Int!) {
        delete_users(where: {id: {_eq: $id}}) {
            affected_rows
        }
    }`;


const UPDATE_USER = gql`
    mutation updateUser($id: Int!, $user: users_set_input) {
        update_users(where: {id: {_eq: $id}}, _set: $user) {
            affected_rows
            returning {
                ${userFields}
            }
        }
    }`;

const GET_TOTAL_COUNT = gql`
    {
        users_aggregate {
            aggregate {
                count
            }
        }
    }
`;

export {GET_TOTAL_COUNT, GET_USERS_LIST, DELETE_USER, UPDATE_USER, ADD_USER, USERS_SUBSCRIPTION};
