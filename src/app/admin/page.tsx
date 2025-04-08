'use client'

import { useState, useEffect, Fragment } from 'react'
import { Dialog, Transition, Listbox, Switch } from '@headlessui/react'
import { FormComponent } from '@/types'
import Link from 'next/link'

const componentTypes = [
  { id: 'text', name: 'Text Input' },
  { id: 'textarea', name: 'Text Area' },
  { id: 'date', name: 'Date Input' },
  { id: 'select', name: 'Select' },
] as const

const pages = [
  { id: 2, name: 'Page 2' },
  { id: 3, name: 'Page 3' },
] as const

export default function AdminPage() {
  const [components, setComponents] = useState<FormComponent[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingComponent, setDeletingComponent] = useState<FormComponent | null>(null)
  const [editingComponent, setEditingComponent] = useState<FormComponent | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(2)
  const [error, setError] = useState<string>('')
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchComponents = async () => {
    try {
      const response = await fetch('/api/form-components')
      if (!response.ok) {
        throw new Error('Failed to fetch components')
      }
      const data = await response.json()
      const componentsArray = Array.isArray(data) ? data : []
      setComponents(componentsArray)
    } catch (error) {
      console.error('Failed to fetch components:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch components')
      setComponents([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComponents()
  }, [])

  const handleEdit = (component: FormComponent) => {
    setEditingComponent(component)
    setShowModal(true)
  }

  const handleDeleteClick = (component: FormComponent) => {
    setDeletingComponent(component)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingComponent?._id) return

    try {
      setIsDeleting(true)
      const response = await fetch(`/api/form-components?id=${deletingComponent._id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete component')
      }

      await fetchComponents()
      setShowDeleteModal(false)
      setDeletingComponent(null)
    } catch (error) {
      console.error('Failed to delete component:', error)
      setError(error instanceof Error ? error.message : 'Failed to delete component')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingComponent) return

    if (!editingComponent.page || ![2, 3].includes(editingComponent.page)) {
      setEditingComponent(prev => ({ ...prev!, page: 2 }))
    }

    try {
      const { _id, ...componentData } = editingComponent
      
      const response = await fetch('/api/form-components' + (editingComponent._id ? `/${editingComponent._id}` : ''), {
        method: editingComponent._id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(componentData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save component')
      }

      await fetchComponents()
      setShowModal(false)
      setEditingComponent(null)
    } catch (error) {
      console.error('Failed to save component:', error)
      setError(error instanceof Error ? error.message : 'Failed to save component')
    }
  }

  const handleMove = async (componentId: string, targetPage: number) => {
    try {
      const response = await fetch(`/api/form-components/${componentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          page: targetPage,
          order: components.filter(c => c.page === targetPage).length + 1
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to move component')
      }

      await fetchComponents()
    } catch (error) {
      console.error('Failed to move component:', error)
      setError(error instanceof Error ? error.message : 'Failed to move component')
    }
  }

  const createNewComponent = (targetPage: number = 2) => {
    const validPage = [2, 3].includes(targetPage) ? targetPage : 2
    const order = components.filter(c => c.page === validPage).length + 1
    
    setEditingComponent({
      type: 'text',
      label: '',
      required: true,
      page: validPage,
      placeholder: '',
      order
    })
    setShowModal(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#006A71]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="flex justify-between items-center mb-8 border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Form Components Management</h1>
            <p className="text-gray-600 mt-2">Manage components for your onboarding forms</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => createNewComponent(2)}
              className="px-4 py-2 bg-[#006A71] text-white rounded-lg hover:bg-[#005a60] transition-colors"
            >
              Add New Component
            </button>
            <Link
              href="/"
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="space-y-4">
              {components.filter(comp => comp.page === 2).length > 0 ? (
                components
                  .filter(comp => comp.page === 2)
                  .map(component => (
                    <div
                      key={component._id}
                      className="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
                    >
                      <div>
                        <h3 className="font-medium">{component.label}</h3>
                        <p className="text-sm text-gray-500">{component.type}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(component)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteClick(component)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          🗑️
                        </button>
                        <button
                          onClick={() => handleMove(component._id!, 3)}
                          className="px-3 py-1 bg-[#006A71] text-white text-sm rounded hover:bg-[#005a60] transition-colors"
                        >
                          Move to Page 3
                        </button>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <p className="text-gray-500 mb-2">No components added to Page 2 yet</p>
                  <button
                    onClick={() => createNewComponent(2)}
                    className="text-sm text-[#006A71] hover:underline"
                  >
                    + Add your first component
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Final Details</h2>
            <div className="space-y-4">
              {components.filter(comp => comp.page === 3).length > 0 ? (
                components
                  .filter(comp => comp.page === 3)
                  .map(component => (
                    <div
                      key={component._id}
                      className="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
                    >
                      <div>
                        <h3 className="font-medium">{component.label}</h3>
                        <p className="text-sm text-gray-500">{component.type}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(component)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteClick(component)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          🗑️
                        </button>
                        <button
                          onClick={() => handleMove(component._id!, 2)}
                          className="px-3 py-1 bg-[#006A71] text-white text-sm rounded hover:bg-[#005a60] transition-colors"
                        >
                          Move to Page 2
                        </button>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <p className="text-gray-500 mb-2">No components added to Page 3 yet</p>
                  <button
                    onClick={() => createNewComponent(3)}
                    className="text-sm text-[#006A71] hover:underline"
                  >
                    + Add your first component
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <Transition appear show={showDeleteModal} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => !isDeleting && setShowDeleteModal(false)}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Delete Component
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete the component "{deletingComponent?.label}"? This action cannot be undone.
                      </p>
                    </div>

                    {error && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-800">{error}</p>
                      </div>
                    )}

                    <div className="mt-4 flex justify-end space-x-3">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 disabled:opacity-50"
                        onClick={() => setShowDeleteModal(false)}
                        disabled={isDeleting}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:opacity-50"
                        onClick={handleDeleteConfirm}
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Deleting...
                          </>
                        ) : (
                          'Delete'
                        )}
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>

        <Transition appear show={showModal} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50"
            onClose={() => setShowModal(false)}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-semibold leading-6 text-gray-900 mb-4"
                    >
                      {editingComponent?._id ? 'Edit Component' : 'Add New Component'}
                    </Dialog.Title>

                    {editingComponent && (
                      <form onSubmit={handleSave} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type
                          </label>
                          <Listbox
                            value={componentTypes.find(t => t.id === editingComponent.type)}
                            onChange={(newType) => setEditingComponent({
                              ...editingComponent,
                              type: newType.id as FormComponent['type']
                            })}
                          >
                            <div className="relative mt-1">
                              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border focus:outline-none focus-visible:border-[#006A71] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-[#006A71]">
                                <span className="block truncate">
                                  {componentTypes.find(t => t.id === editingComponent.type)?.name}
                                </span>
                              </Listbox.Button>
                              <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                  {componentTypes.map((type) => (
                                    <Listbox.Option
                                      key={type.id}
                                      className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                          active ? 'bg-[#006A71] text-white' : 'text-gray-900'
                                        }`
                                      }
                                      value={type}
                                    >
                                      {({ selected }) => (
                                        <>
                                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                            {type.name}
                                          </span>
                                          {selected && (
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#006A71]">
                                              ✓
                                            </span>
                                          )}
                                        </>
                                      )}
                                    </Listbox.Option>
                                  ))}
                                </Listbox.Options>
                              </Transition>
                            </div>
                          </Listbox>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Page
                          </label>
                          <Listbox
                            value={pages.find(p => p.id === editingComponent.page) || pages[0]}
                            onChange={(newPage) => setEditingComponent({
                              ...editingComponent,
                              page: newPage.id
                            })}
                          >
                            <div className="relative mt-1">
                              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border focus:outline-none focus-visible:border-[#006A71] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-[#006A71]">
                                <span className="block truncate">
                                  {pages.find(p => p.id === editingComponent.page)?.name || pages[0].name}
                                </span>
                              </Listbox.Button>
                              <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                  {pages.map((page) => (
                                    <Listbox.Option
                                      key={page.id}
                                      className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                          active ? 'bg-[#006A71] text-white' : 'text-gray-900'
                                        }`
                                      }
                                      value={page}
                                    >
                                      {({ selected }) => (
                                        <>
                                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                            {page.name}
                                          </span>
                                          {selected && (
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#006A71]">
                                              ✓
                                            </span>
                                          )}
                                        </>
                                      )}
                                    </Listbox.Option>
                                  ))}
                                </Listbox.Options>
                              </Transition>
                            </div>
                          </Listbox>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Label
                          </label>
                          <input
                            type="text"
                            value={editingComponent.label}
                            onChange={(e) => setEditingComponent({
                              ...editingComponent,
                              label: e.target.value
                            })}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A71]"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Placeholder
                          </label>
                          <input
                            type="text"
                            value={editingComponent.placeholder}
                            onChange={(e) => setEditingComponent({
                              ...editingComponent,
                              placeholder: e.target.value
                            })}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A71]"
                          />
                        </div>

                        <Switch.Group>
                          <div className="flex items-center">
                            <Switch
                              checked={editingComponent.required}
                              onChange={(checked) => setEditingComponent({
                                ...editingComponent,
                                required: checked
                              })}
                              className={`${
                                editingComponent.required ? 'bg-[#006A71]' : 'bg-gray-200'
                              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#006A71] focus:ring-offset-2`}
                            >
                              <span
                                className={`${
                                  editingComponent.required ? 'translate-x-6' : 'translate-x-1'
                                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                              />
                            </Switch>
                            <Switch.Label className="ml-2 text-sm text-gray-700">Required</Switch.Label>
                          </div>
                        </Switch.Group>

                        <div className="flex justify-end space-x-4 mt-6">
                          <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-[#006A71] text-white rounded-lg hover:bg-[#005a60] transition-colors"
                          >
                            Save
                          </button>
                        </div>
                      </form>
                    )}
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  )
} 