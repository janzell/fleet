import {gql} from 'apollo-boost';

const driverFields = `id
    plate_number 
    color
    notes
    created_at
    updated_at
    `;

const GET_TAXIS_LIST = gql`
    query getTaxisList($limit: Int!, $offset: Int!) {
        taxis(limit: $limit, order_by: {created_at: asc}, offset: $offset) {
            ${driverFields}
        }
    }`;

const TAXIS_SUBSCRIPTION = gql`
    subscription onTaxisAdded($limit: Int, $offset: Int, $order_by: [taxis_order_by!]) {
        taxis(limit: $limit, offset: $offset, order_by: $order_by){
            ${driverFields}
        }
    }
`;

const ADD_TAXI = gql`
    mutation addTaxi($driver: [taxis_insert_input!]!) {
        insert_taxis(objects: $driver) {
            affected_rows
            returning {
                ${driverFields}
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
    mutation updateTaxi($id: Int!, $driver: taxis_set_input) {
        update_taxis(where: {id: {_eq: $id}}, _set: $driver) {
            affected_rows
            returning {
               ${driverFields} 
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
