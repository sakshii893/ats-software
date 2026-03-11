import React from 'react'
import { Star } from 'lucide-react'

function TemplateCard({ template, isSelected, onSelect }) {
  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      )
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400 opacity-50" />
      )
    }

    const remainingStars = 5 - Math.ceil(rating)
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      )
    }

    return stars
  }

  return (
    <div 
      className={`card cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'ring-2 ring-parrot-green border-parrot-green shadow-lg' 
          : 'hover:shadow-lg'
      }`}
      onClick={onSelect}
    >
      {/* Template Preview */}
      <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-400 mb-2">
            {template.name.charAt(0)}
          </div>
          <div className="text-gray-500 text-sm">
            {template.name} Template
          </div>
        </div>
      </div>

      {/* Template Info */}
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {template.name}
          </h3>
          <p className="text-sm text-gray-600">
            {template.description}
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {renderStars(template.rating)}
          </div>
          <span className="text-sm text-gray-600">
            {template.rating}
          </span>
        </div>

        {/* Select Button */}
        <button
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
            isSelected
              ? 'bg-parrot-green text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {isSelected ? 'Selected' : 'Select Template'}
        </button>
      </div>
    </div>
  )
}

export default TemplateCard