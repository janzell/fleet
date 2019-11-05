import {gql} from 'apollo-boost';

const taxiFields = `id
    plate_number
    body_number
    engine_number
    case_number
    year_model
    status
    dispatch_status,
    sticker
    acquired_at
    or_number
    or_issued_at
    cr_number
    cr_issued_at
    notes
    series_id
    series {
        id
        name
    }
    garage_id
    garage {
        id
        name
    }
    company_id
    company {
        id
        name
    }
    mv_file_number
    private_number
    temporary_plate_number
    created_at
    updated_at
    `;

const GET_TAXIS_LIST = gql`
    query getTaxisList($limit: Int!, $offset: Int!, $order_by: [taxis_order_by!], $where: taxis_bool_exp) {
        taxis(limit: $limit, offset: $offset, order_by: $order_by, where: $where) {
            ${taxiFields}
        }
    }`;

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
    query getTotalCount($where:taxis_bool_exp) {
        taxis_aggregate(where: $where){
            aggregate {
                count
            }
        }
    }
    
`;

export {GET_TAXIS_LIST, GET_TOTAL_COUNT, DELETE_TAXI, UPDATE_TAXI, ADD_TAXI};
