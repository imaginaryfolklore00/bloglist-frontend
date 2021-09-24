import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const getById = async id => {
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (id, newObject) => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.put(`${baseUrl}/${id}`, newObject, config)
  return response.data
}

const delete_db = async id => {
  const config = {
    headers: { Authorization: token }
  }

  const request = await axios.delete(`${baseUrl}/${id}`, config)
  return request.data
}

export default { getAll, getById, create, setToken, update, delete_db }