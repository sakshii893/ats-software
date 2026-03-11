import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import TemplateCard from '../components/TemplateCard'

function TemplateSelect({ selectedTemplate, setSelectedTemplate }) {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      const templatesData = await api.getTemplates()
      setTemplates(templatesData)
    } catch (error) {
      console.error('Error loading templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template)
    navigate('/form')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-parrot-green"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Choose Your Resume Template
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select from our professionally designed LaTeX templates. Each template is optimized for different industries and career levels.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={selectedTemplate?.id === template.id}
            onSelect={() => handleTemplateSelect(template)}
          />
        ))}
      </div>

      {selectedTemplate && (
        <div className="text-center">
          <button
            onClick={() => navigate('/form')}
            className="btn-primary text-lg px-8 py-3"
          >
            Continue with {selectedTemplate.name} Template
          </button>
        </div>
      )}
    </div>
  )
}

export default TemplateSelect