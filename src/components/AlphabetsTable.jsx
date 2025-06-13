import React from "react";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";

const AlphabetTable = ({ data, handleEditAlphabet, handleDeleteAlphabet }) => {
  console.log(data, "dataaaaa");

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4 border">#</th>
            <th className="py-2 px-4 border">Description</th>
            <th className="py-2 px-4 border">Examples</th>
            <th className="py-2 px-4 border">Image</th>
            <th className="py-2 px-4 border">Related Terms</th>
            <th className="py-2 px-4 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item) => (
            <tr key={item._id} className="hover:bg-gray-100 ">
              <td className="py-2 px-4 border text-center font-bold">
                {item.alphabet}
              </td>
              <td className="py-2 px-4 border">
                {item.description.length > 30
                  ? item.description.substring(0, 30) + "..."
                  : item.description}
              </td>

              <td className="py-2 px-4 border">
                {Array.isArray(item.examples)
                  ? item.examples.join(", ")
                  : item.examples}
              </td>
              <td className="py-2 px-4 border">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.alphabet}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
              </td>
              <td className="py-2 px-4 border">
                {Array.isArray(item.relatedTerms)
                  ? item.relatedTerms.join(", ")
                  : item.relatedTerms}
              </td>
              <td className="py-2 flex cursor-pointer justify-center  items-center  px-4 border">
                <AiOutlineEdit
                  onClick={() => handleEditAlphabet(item)}
                  size={25}
                />
                <AiOutlineDelete size={25}  onClick={() => handleDeleteAlphabet(item._id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AlphabetTable;
