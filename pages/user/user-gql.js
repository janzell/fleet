import {gql} from 'apollo-boost';

const driverFields = `id
    first_name
    last_name
    license_number
    address
    created_at
    updated_at
    `;

const GET_DRIVERS_LIST = gql`
    query getDriversList($limit: Int!, $offset: Int!) {
        drivers(limit: $limit, order_by: {created_at: asc}, offset: $offset) {
            ${driverFields}
        }
    }`;

const DRIVERS_SUBSCRIPTION = gql`
    subscription onDriversAdded($limit: Int, $offset: Int, $order_by: [drivers_order_by!]) {
        drivers(limit: $limit, offset: $offset, order_by: $order_by){
            ${driverFields}
        }
    }
`;

const ADD_DRIVER = gql`
    mutation addDriver($driver: [drivers_insert_input!]!) {
        insert_drivers(objects: $driver) {
            affected_rows
            returning {
                ${driverFields}
            }
        }
    }`;

const DELETE_DRIVER = gql`
    mutation deleteDriver($id: Int!) {
        delete_drivers(where: {id: {_eq: $id}}) {
            affected_rows
        }
    }`;

const UPDATE_DRIVER = gql`
    mutation updateDriver($id: Int!, $driver: drivers_set_input) {
        update_drivers(where: {id: {_eq: $id}}, _set: $driver) {
            affected_rows
            returning {
               ${driverFields} 
            }
        }
    }`;

export {GET_DRIVERS_LIST, DELETE_DRIVER, UPDATE_DRIVER, ADD_DRIVER, DRIVERS_SUBSCRIPTION};
