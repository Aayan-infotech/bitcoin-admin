import React from 'react';
import { BsCheck } from 'react-icons/bs';
import { MdOutlineCancel } from 'react-icons/md';
import { useStateContext } from '../contexts/ContextProvider';
import { themeColors } from '../data/dummy';

const ThemeSettings = () => {
  const { setColor, setMode, currentMode, currentColor, setThemeSettings } = useStateContext();

  return (
    <div className="bg-black bg-opacity-50 fixed inset-0 z-20 flex justify-end">
      <div className="h-screen dark:text-gray-200 bg-white dark:bg-gray-800 w-80 p-4">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <p className="font-semibold text-lg">Settings</p>
          <button
            type="button"
            onClick={() => setThemeSettings(false)}
            className="text-gray-500 hover:bg-gray-200 p-2 rounded-full"
          >
            <MdOutlineCancel size={24} />
          </button>
        </div>

        {/* Theme Option */}
        <div className="py-4 border-b">
          <p className="font-semibold text-xl">Theme Option</p>
          <div className="mt-4 space-y-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="theme"
                value="Light"
                className="cursor-pointer"
                onChange={setMode}
                checked={currentMode === 'Light'}
              />
              <span className="ml-2 text-md">Light</span>
            </label>

            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="theme"
                value="Dark"
                className="cursor-pointer"
                onChange={setMode}
                checked={currentMode === 'Dark'}
              />
              <span className="ml-2 text-md">Dark</span>
            </label>
          </div>
        </div>

        {/* Theme Colors */}
        <div className="py-4">
          <p className="font-semibold text-xl">Theme Colors</p>
          <div className="flex gap-3 mt-3">
            {themeColors.map((item) => (
              <div key={item.name} className="relative group">
                <button
                  type="button"
                  className="h-10 w-10 rounded-full"
                  style={{ backgroundColor: item.color }}
                  onClick={() => setColor(item.color)}
                >
                  {item.color === currentColor && <BsCheck className="text-white text-2xl mx-auto" />}
                </button>
                {/* Tooltip using Tailwind */}
                <span className="absolute bottom-12 left-1/2 transform -translate-x-1/2 scale-0 group-hover:scale-100 bg-gray-700 text-white text-xs rounded px-2 py-1 transition">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;
