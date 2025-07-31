"use client";

import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

const dummyGallery = [
  {
    id: 1,
    image: "https://source.unsplash.com/random/300x200?sig=1",
    title: "Beach Sunset",
    description: "A beautiful sunset by the sea.",
    active: true,
  },
  {
    id: 2,
    image: "https://source.unsplash.com/random/300x200?sig=2",
    title: "Mountain View",
    description: "Snow-capped mountains in the background.",
    active: false,
  },
  {
    id: 3,
    image: "https://source.unsplash.com/random/300x200?sig=3",
    title: "City Lights",
    description: "City skyline during the night.",
    active: true,
  },
  {
    id: 4,
    image: "https://source.unsplash.com/random/300x200?sig=4",
    title: "Forest Path",
    description: "A peaceful trail through the forest.",
    active: false,
  },
  {
    id: 5,
    image: "https://source.unsplash.com/random/300x200?sig=5",
    title: "Desert Dunes",
    description: "Rolling sand dunes under the sun.",
    active: true,
  },
  {
    id: 6,
    image: "https://source.unsplash.com/random/300x200?sig=6",
    title: "River Stream",
    description: "A gentle stream flowing through rocks.",
    active: false,
  },
];

export default function GalleryAdmin() {
  const [galleryData, setGalleryData] = useState(dummyGallery);
  const [isOpen, setIsOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const handleDelete = (id) => {
    setGalleryData(galleryData.filter((item) => item.id !== id));
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setIsOpen(true);
  };

  const handleToggleStatus = (id) => {
    const updatedGallery = galleryData.map((item) =>
      item.id === id ? { ...item, active: !item.active } : item
    );
    setGalleryData(updatedGallery);
  };

  const handleSaveEdit = () => {
    setGalleryData((prev) =>
      prev.map((item) => (item.id === editItem.id ? editItem : item))
    );
    setIsOpen(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gallery Admin Panel</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {galleryData.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow rounded-lg overflow-hidden"
          >
            <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-medium">
                  Status: {item.active ? "Active" : "Inactive"}
                </span>
                <button
                  onClick={() => handleToggleStatus(item.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                    item.active ? "bg-green-600" : "bg-gray-400"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                      item.active ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
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
                    Edit Image Details
                  </Dialog.Title>
                  <div className="mt-4 space-y-4">
                    <input
                      type="text"
                      className="w-full border px-3 py-2 rounded-md"
                      value={editItem?.title || ""}
                      onChange={(e) =>
                        setEditItem((prev) => ({ ...prev, title: e.target.value }))
                      }
                    />
                    <textarea
                      className="w-full border px-3 py-2 rounded-md"
                      value={editItem?.description || ""}
                      onChange={(e) =>
                        setEditItem((prev) => ({ ...prev, description: e.target.value }))
                      }
                    />
                  </div>
                  <div className="mt-6 flex justify-end gap-2">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Save
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
