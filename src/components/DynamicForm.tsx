'use client';

import { useState, useEffect } from 'react';
import { FormComponent, FormData, UserProgress } from '@/types';

interface DynamicFormProps {
  page: number;
  components: FormComponent[];
  initialData?: FormData;
  onSubmit: (data: FormData) => void;
  onSaveProgress: (data: FormData) => void;
  maxPage: number;
}

export default function DynamicForm({
  page,
  components,
  initialData = {},
  onSubmit,
  onSaveProgress,
  maxPage,
}: DynamicFormProps) {
  const [formData, setFormData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  // Auto-save progress when form data changes
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      onSaveProgress(formData);
    }, 1000);

    return () => clearTimeout(saveTimeout);
  }, [formData, onSaveProgress]);

  const validateField = (component: FormComponent, value: any): string => {
    if (component.required && !value) {
      return `${component.label} is required`;
    }

    if (component.validation) {
      if (component.validation.pattern) {
        const regex = new RegExp(component.validation.pattern);
        if (!regex.test(value)) {
          return component.validation.message || 'Invalid format';
        }
      }

      if (component.type === 'text' || component.type === 'textarea') {
        if (component.validation.min && value.length < component.validation.min) {
          return `Minimum ${component.validation.min} characters required`;
        }
        if (component.validation.max && value.length > component.validation.max) {
          return `Maximum ${component.validation.max} characters allowed`;
        }
      }
    }

    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedData = {
      ...formData,
      [name]: value
    };
    setFormData(updatedData);
    
    // Notify parent component about the change
    if (onSaveProgress) {
      onSaveProgress(updatedData);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const currentPageComponents = components.filter(component => component.page === page);
    const hasRequiredFields = currentPageComponents.some(component => component.required);
    
    if (hasRequiredFields) {
      const missingFields = currentPageComponents
        .filter(component => component.required && !formData[component.label])
        .map(component => component.label);
        
      if (missingFields.length > 0) {
        setError(`Please fill in the following required fields: ${missingFields.join(', ')}`);
        return;
      }
    }
    
    // Save progress before submitting
    await onSaveProgress(formData);
    
    // Submit the form
    onSubmit(formData);
  };

  const renderField = (component: FormComponent) => {
    const { type, label, required, placeholder, options } = component;
    const value = formData[label] || '';
    const error = errors[label];

    switch (type) {
      case 'text':
      case 'email':
      case 'password':
        return (
          <div key={label} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
              type={type}
              value={value}
              onChange={handleChange}
              name={label}
              placeholder={placeholder}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#006A71]"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );

      case 'select':
        return (
          <div key={label} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            <select
              value={value}
              onChange={handleChange}
              name={label}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#006A71]"
            >
              <option value="">Select {label}</option>
              {options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );

      case 'textarea':
        return (
          <div key={label} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              value={value}
              onChange={handleChange}
              name={label}
              placeholder={placeholder}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#006A71]"
              rows={4}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}
      
      {page === 1 && components.filter((component) => component.page === page).length === 0 ? (
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Welcome to Our Onboarding Process</h2>
          <div className="p-6 bg-[#006A71]/5 rounded-lg border border-[#006A71]/10 mb-6">
            <p className="mb-4">Thank you for starting your onboarding journey with us. We're excited to have you here!</p>
            <p className="mb-4">This simple process will guide you through a few steps to complete your profile.</p>
            <p className="text-sm text-gray-600">All your progress will be automatically saved as you go.</p>
          </div>
          <div className="flex items-center justify-center space-x-6 mt-6">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#006A71] text-white flex items-center justify-center mb-2">1</div>
              <p className="text-sm">Basic Info</p>
            </div>
            <div className="h-0.5 w-12 bg-gray-300"></div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center mb-2">2</div>
              <p className="text-sm">Personal Details</p>
            </div>
            <div className="h-0.5 w-12 bg-gray-300"></div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center mb-2">3</div>
              <p className="text-sm">Finalize</p>
            </div>
          </div>
        </div>
      ) : (
        components
          .filter((component) => component.page === page)
          .sort((a, b) => a.order - b.order)
          .map(renderField)
      )}
    </div>
  );
} 