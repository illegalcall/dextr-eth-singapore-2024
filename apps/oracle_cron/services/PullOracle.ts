import axios, { AxiosInstance } from 'axios'

export class PullOracle {
  client: AxiosInstance
  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL: baseURL,
    })
  }

  async getProof(request: any) {
    try {
      const response = await this.client.post('/get_proof', request)
      return response.data
    } catch (error) {
      throw error
    }
  }
}
