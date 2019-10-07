import {gql} from 'apollo-boost';

const partFields = `id
    name
    code
    quantity,
    description
    created_at
    updated_at
    `;

const GET_PARTS_LIST = gql`
    query getPartsList($limit: Int!, $offset: Int!, $order_by: [parts_order_by!], $where: parts_bool_exp) {
        parts(limit: $limit,offset: $offset, order_by: $order_by, where: $where) {
            ${partFields}
        }
    }`;


const PARTS_SUBSCRIPTION = gql`
    subscription onPartsAdded($limit: Int, $offset: Int, $order_by: [parts_order_by!]) {
        parts(limit: $limit, offset: $offset, order_by: $order_by){
            ${partFields}
        }
    }
`;

const ADD_PART = gql`
    mutation addPart($part: [parts_insert_input!]!) {
        insert_parts(objects: $part) {
            affected_rows
            returning {
                ${partFields}
            }
        }
    }`;

const DELETE_PART = gql`
    mutation deletePart($id: Int!) {
        delete_parts(where: {id: {_eq: $id}}) {
            affected_rows
        }
    }`;

const UPDATE_PART = gql`
    mutation updatePart($id: Int!, $part: parts_set_input) {
        update_parts(where: {id: {_eq: $id}}, _set: $part) {
            affected_rows
            returning {
               ${partFields} 
            }
        }
    }`;

const GET_TOTAL_COUNT = gql`
    {
        parts_aggregate {
            aggregate {
                count
            }
        }
    }
`;

export {GET_PARTS_LIST, DELETE_PART, UPDATE_PART, ADD_PART, PARTS_SUBSCRIPTION, GET_TOTAL_COUNT};
