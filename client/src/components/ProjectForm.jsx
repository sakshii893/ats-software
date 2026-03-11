import React from 'react'
import { Plus, Trash2 } from 'lucide-react'

function ProjectForm({ projects, onChange }) {
  const addProject = () => {
    onChange([...projects, { title: '', description: '', technologies: '' }])
  }

  const removeProject = (index) => {
    if (projects.length > 1) {
      onChange(projects.filter((_, i) => i !== index))
    }
  }

  const updateProject = (index, field, value) => {
    const updatedProjects = projects.map((project, i) => 
      i === index ? { ...project, [field]: value } : project
    )
    onChange(updatedProjects)
  }

  return (
    <div className="space-y-6">
      {projects.map((project, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-gray-900">Project {index + 1}</h4>
            {projects.length > 1 && (
              <button
                type="button"
                onClick={() => removeProject(index)}
                className="text-red-600 hover:bg-red-50 p-2 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="form-label">Project Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., E-commerce Website"
                value={project.title}
                onChange={(e) => updateProject(index, 'title', e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">Description</label>
              <textarea
                className="form-input"
                rows="3"
                placeholder="Describe what you built and its impact..."
                value={project.description}
                onChange={(e) => updateProject(index, 'description', e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">Technologies Used</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., React, Node.js, MongoDB"
                value={project.technologies}
                onChange={(e) => updateProject(index, 'technologies', e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addProject}
        className="flex items-center gap-2 btn-secondary"
      >
        <Plus className="w-4 h-4" />
        Add Another Project
      </button>
    </div>
  )
}

export default ProjectForm