import {gql} from 'apollo-boost';

const taxiFields = `id
    plate_number
    body_number
    engine_number
    case_number
    acquired_at
    year_model
    status
    notes
    series {
        id
        name
    }
    created_at
    updated_at
    `;

const GET_TAXIS_LIST = gql`
    query getTaxisList($limit: Int!, $offset: Int!, $order_by: [taxis_order_by!], $where: taxis_bool_exp) {
        taxis(limit: $limit, offset: $offset, order_by: $order_by, where: $where) {
            ${taxiFields}
        }
    }`;

const TAXIS_SUBSCRIPTION = gql`
    subscription onTaxisAdded($limit: Int, $offset: Int, $order_by: [taxis_order_by!]) {
        taxis(limit: $limit, offset: $offset, order_by: $order_by){
            ${taxiFields}
        }
    }
`;

const ADD_TAXI = gql`
    mutation addTaxi($taxi: [taxis_insert_input!]!) {
        insert_taxis(objects: $taxi) {
            affected_rows
            returning {
                ${taxiFields}
            }
        }
    }`;

const DELETE_TAXI = gql`
    mutation deleteTaxi($id: Int!) {
        delete_taxis(where: {id: {_eq: $id}}) {
            affected_rows
        }
    }`;

const UPDATE_TAXI = gql`
    mutation updateTaxi($id: Int!, $taxi: taxis_set_input) {
        update_taxis(where: {id: {_eq: $id}}, _set: $taxi) {
            affected_rows
            returning {
                ${taxiFields}
            }
        }
    }`;

const GET_TOTAL_COUNT = gql`
    {
        taxis_aggregate {
            aggregate {
                count
            }
        }
    }
`;

export {GET_TAXIS_LIST, GET_TOTAL_COUNT, DELETE_TAXI, UPDATE_TAXI, ADD_TAXI, TAXIS_SUBSCRIPTION};
