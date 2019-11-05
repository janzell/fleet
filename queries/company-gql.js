import {gql} from 'apollo-boost';

const companyFields = `id
    name
    address 
    created_at
    updated_at
    `;

const ALL_COMPANIES = gql`
    query getAllCompanies {
        companies {
            ${companyFields}
        }
    }
`;

const GET_COMPANIES_LIST = gql`
    query getCompanyList($limit: Int!, $offset: Int!, $order_by: [companies_order_by!], $where: companies_bool_exp) {
        companies(limit: $limit,offset: $offset, order_by: $order_by, where: $where) {
            ${companyFields}
        }
    }`;

const COMPANY_SUBSCRIPTION = gql`
    subscription onCompanyAdded($limit: Int, $offset: Int, $order_by: [companies_order_by!]) {
        companies(limit: $limit, offset: $offset, order_by: $order_by){
            ${companyFields}
        }
    }
`;

const ADD_COMPANY = gql`
    mutation addCompany($company: [companies_insert_input!]!) {
        insert_companies(objects: $company) {
            affected_rows
            returning {
                ${companyFields}
            }
        }
    }`;

const DELETE_COMPANY = gql`
    mutation deleteCompany($id: Int!) {
        delete_companies(where: {id: {_eq: $id}}) {
            affected_rows
        }
    }`;

const UPDATE_COMPANY = gql`
    mutation updateCompany($id: Int!, $company: companies_set_input) {
        update_companies(where: {id: {_eq: $id}}, _set: $company) {
            affected_rows
            returning {
                ${companyFields}
            }
        }
    }`;

const GET_TOTAL_COUNT = gql`
    query getTotalCount($where:companies_bool_exp) {
        companies_aggregate(where: $where){
            aggregate {
                count
            }
        }
    }
`;

export {
  GET_COMPANIES_LIST,
  GET_TOTAL_COUNT,
  DELETE_COMPANY,
  UPDATE_COMPANY,
  ADD_COMPANY,
  COMPANY_SUBSCRIPTION,
  ALL_COMPANIES
};
