"use client"

import deleteService from "@/app/actions/service/deleteService"
import getServices from "@/app/actions/service/getServices"
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"

type ServiceData = {
  id: string
  name: string
  description: string | null
  clientDuration: number
  price: number
  totalDuration: number
}

export default function ServiceList() {
  const [services, setServices] = useState<ServiceData[]>([])
  const [confirmationModal, setConfirmationModal] = useState<boolean>(false)
  const [deleteId, setDeleteId] = useState<string>("")
  const [success, setSuccess] = useState<boolean>(false)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getServices()
        if (response.error) {
          console.error(response.error)
        } else if (response.services) {
          setServices(response.services)
        }
      } catch (error) {
        console.error(error)
      }
    }
    fetchServices()
  }, [])

  function handleDelete(id: string) {
    setConfirmationModal(true)
    setDeleteId(id)
  }

  function closeModal() {
    setConfirmationModal(false)
    setDeleteId("")
  }

  function confirmDelete() {
    const callDeleteService = async (id: string) => {
      try {
        const response = await deleteService(id)
        if (response.error) {
          console.error(response.error)
        } else {
          console.log(response.message)
          setSuccess(true)
        }
      } catch (error) {
        console.error(error)
      }
    }
    callDeleteService(deleteId)
  }

  useEffect(() => {
    if (success) {
      redirect("/admin/services")
    }
  }, [success])

  const serviceCards = services.map((object) => {
    return (
      <div
        key={object.id}
        className="flex flex-col p-4 border rounded-md bg-gray-100 dark:bg-gray-800"
      >
        <div className="flex">
          <p className="font-medium">{object.name}</p>
          <p className="ml-auto">${object.price}</p>
        </div>
        <p className="text-gray-500 dark:text-gray-200">
          {object.clientDuration} Minutes
        </p>
        <p className="mt-4">{object.description}</p>
        <div className="mt-4 ml-auto">
          <Link
            href={`/admin/services/${object.id}`}
            className="bg-white dark:bg-gray-900 rounded-md px-4 py-2 border border-gray-300 hover:bg-gray-200"
          >
            Edit
          </Link>
          <button
            type="button"
            className="bg-red-500 text-white rounded-md px-4 py-2 ml-2 hover:opacity-80"
            onClick={() => handleDelete(object.id)}
          >
            Delete
          </button>
        </div>
      </div>
    )
  })

  return (
    <div>
      {confirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md">
            <p>Are you sure you want to delete this service?</p>
            <div className="flex gap-4 mt-4 justify-end">
              <button
                type="button"
                className="bg-gray-300 text-black rounded-md px-4 py-2"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="bg-red-500 text-white rounded-md px-4 py-2"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center">
        <h1 className="py-4 font-bold text-lg">Service List</h1>
        <Link
          href="/admin"
          className="back-button bg-white dark:bg-inherit ml-auto"
        >
          <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
          Go Back
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {serviceCards}
      </div>
    </div>
  )
}
