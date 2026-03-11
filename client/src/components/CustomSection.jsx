import React from 'react'
import { Plus, Trash2 } from 'lucide-react'

function CustomSection({ sections, onChange }) {
  const addSection = () => {
    onChange([...sections, { heading: '', subheading: '', content: '' }])
  }

  const removeSection = (index) => {
    onChange(sections.filter((_, i) => i !== index))
  }

  const updateSection = (index, field, value) => {
    const updatedSections = sections.map((section, i) => 
      i === index ? { ...section, [field]: value } : section
    )
    onChange(updatedSections)
  }

  return (
    <div className="space-y-6">
      {sections.map((section, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-gray-900">Custom Section {index + 1}</h4>
            <button
              type="button"
              onClick={() => removeSection(index)}
              className="text-red-600 hover:bg-red-50 p-2 rounded-lg"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="form-label">Section Heading</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Certifications, Languages, Volunteer Work"
                value={section.heading}
                onChange={(e) => updateSection(index, 'heading', e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">Subheading (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Professional Development"
                value={section.subheading}
                onChange={(e) => updateSection(index, 'subheading', e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">Content</label>
              <textarea
                className="form-input"
                rows="4"
                placeholder="Enter the content for this section..."
                value={section.content}
                onChange={(e) => updateSection(index, 'content', e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addSection}
        className="flex items-center gap-2 btn-secondary"
      >
        <Plus className="w-4 h-4" />
        Add Custom Section
      </button>

      {sections.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">
          Add custom sections like certifications, languages, or volunteer work
        </p>
      )}
    </div>
  )
}

export default CustomSection