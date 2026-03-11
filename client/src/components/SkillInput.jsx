import React, { useState } from 'react'
import { X } from 'lucide-react'

function SkillInput({ skills, onChange }) {
  const [inputValue, setInputValue] = useState('')

  const addSkill = () => {
    if (inputValue.trim() && !skills.includes(inputValue.trim())) {
      onChange([...skills, inputValue.trim()])
      setInputValue('')
    }
  }

  const removeSkill = (skillToRemove) => {
    onChange(skills.filter(skill => skill !== skillToRemove))
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSkill()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          className="form-input flex-1"
          placeholder="Enter a skill (e.g., JavaScript, React, Python)"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          type="button"
          onClick={addSkill}
          className="btn-primary"
        >
          Add
        </button>
      </div>

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 bg-parrot-green text-white px-3 py-1 rounded-full text-sm"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="hover:bg-green-600 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <p className="text-sm text-gray-500">
        Press Enter or click Add to add skills. Click the X to remove them.
      </p>
    </div>
  )
}

export default SkillInput