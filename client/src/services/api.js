import axios from 'axios'

const API_BASE_URL = '/api'

export const api = {
  // Get available templates
  getTemplates: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/templates`)
      return response.data
    } catch (error) {
      throw new Error('Failed to fetch templates')
    }
  },

  // Generate resume
  generateResume: async (templateId, resumeData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/generate-resume`, {
        templateId,
        resumeData
      })
      return response.data
    } catch (error) {
      throw new Error('Failed to generate resume')
    }
  }
}