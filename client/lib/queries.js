import gql from 'graphql-tag'

const GET_CATEGORIES = gql`
  query Categories {
    categories {
      data {
        id,
        attributes {
          category,
          dataset {
            data {
              id,
              attributes {
                title
              }
            }
          }
        }
      }
    }
    dataset {
      data {
        id,
        attributes {
          title
        }
      }
    }
  }
`

const UPDATE_DATA = gql`
  mutation UpdateData($id: ID!, $data: DataInput!){
    updateData(id: $id, data: $data ){
      data {
        id
        attributes {
          title
          data
          chapt {
            data {
              id
              attributes {
                category
              }
            }
          }
        }
      }
    }
  }
`

const CREATE_DATA = gql`
  mutation CreateData($title: String, $data: JSON, $chapt: ID, $publishedAt: DateTime){
    createData(data: {title: $title, data: $data, chapt: $chapt, publishedAt: $publishedAt} ){
      data {
        id
        attributes {
          title
          data
          chapt {
            data {
              id
              attributes {
                category
              }
            }
          }
        }
      }
    }
  }
`

const GET_DATA = gql`
  query GetDataById ($id: ID){
    data(id: $id) {
      data {
        id,
        attributes {
          title,
          data
        }
      }
    }
    categories {
      data {
        id,
        attributes {
          category,
          dataset {
            data {
              id,
              attributes {
                title
              }
            }
          }
        }
      }
    }
  }
`
export { GET_CATEGORIES, GET_DATA, UPDATE_DATA, CREATE_DATA }
