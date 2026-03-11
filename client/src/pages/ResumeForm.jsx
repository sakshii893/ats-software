import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import SkillInput from '../components/SkillInput'
import ProjectForm from '../components/ProjectForm'
import CustomSection from '../components/CustomSection'

function ResumeForm({ selectedTemplate, resumeData, setResumeData, setGeneratedResume }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState(resumeData || {
    name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    education: {
      college: '',
      degree: '',
      cgpa: ''
    },
    skills: [],
    projects: [{ title: '', description: '', technologies: '' }],
    achievements: [''],
    customSections: []
  })

  useEffect(() => {
    if (!selectedTemplate) {
      navigate('/')
    }
  }, [selectedTemplate, navigate])

  if (!selectedTemplate) {
    return null
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleEducationChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      education: {
        ...prev.education,
        [field]: value
      }
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await api.generateResume(selectedTemplate.id, formData)
      setResumeData(formData)
      setGeneratedResume(result)
      navigate('/preview')
    } catch (error) {
      console.error('Error generating resume:', error)
      alert('Failed to generate resume. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Build Your Resume
        </h2>
        <p className="text-gray-600">
          Using template: <span className="font-medium text-parrot-green">{selectedTemplate.name}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Email *</label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Phone</label>
              <input
                type="tel"
                className="form-input"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-input"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">LinkedIn</label>
              <input
                type="url"
                className="form-input"
                value={formData.linkedin}
                onChange={(e) => handleInputChange('linkedin', e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">GitHub</label>
              <input
                type="url"
                className="form-input"
                value={formData.github}
                onChange={(e) => handleInputChange('github', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Education</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="form-label">College/University</label>
              <input
                type="text"
                className="form-input"
                value={formData.education.college}
                onChange={(e) => handleEducationChange('college', e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Degree</label>
              <input
                type="text"
                className="form-input"
                value={formData.education.degree}
                onChange={(e) => handleEducationChange('degree', e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">CGPA/Grade</label>
              <input
                type="text"
                className="form-input"
                value={formData.education.cgpa}
                onChange={(e) => handleEducationChange('cgpa', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Skills</h3>
          <SkillInput
            skills={formData.skills}
            onChange={(skills) => handleInputChange('skills', skills)}
          />
        </div>

        {/* Projects */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Projects</h3>
          <ProjectForm
            projects={formData.projects}
            onChange={(projects) => handleInputChange('projects', projects)}
          />
        </div>

        {/* Achievements */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Achievements</h3>
          <div className="space-y-4">
            {formData.achievements.map((achievement, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  className="form-input flex-1"
                  placeholder="Enter achievement"
                  value={achievement}
                  onChange={(e) => {
                    const newAchievements = [...formData.achievements]
                    newAchievements[index] = e.target.value
                    handleInputChange('achievements', newAchievements)
                  }}
                />
                {formData.achievements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newAchievements = formData.achievements.filter((_, i) => i !== index)
                      handleInputChange('achievements', newAchievements)
                    }}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleInputChange('achievements', [...formData.achievements, ''])}
              className="btn-secondary"
            >
              Add Achievement
            </button>
          </div>
        </div>

        {/* Custom Sections */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Custom Sections</h3>
          <CustomSection
            sections={formData.customSections}
            onChange={(sections) => handleInputChange('customSections', sections)}
          />
        </div>

        {/* Submit */}
        <div className="flex justify-center space-x-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn-secondary"
          >
            Back to Templates
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Generating...' : 'Generate Resume'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ResumeForm