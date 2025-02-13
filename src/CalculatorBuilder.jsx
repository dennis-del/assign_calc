import React, { useState, useEffect } from 'react';
import useStore from './store';

const predefinedComponents = [
  { id: '0', label: '0' },
  { id: '1', label: '1' },
  { id: '2', label: '2' },
  { id: '3', label: '3' },
  { id: '4', label: '4' },
  { id: '5', label: '5' },
  { id: '6', label: '6' },
  { id: '7', label: '7' },
  { id: '8', label: '8' },
  { id: '9', label: '9' },
  { id: '+', label: '+' },
  { id: '-', label: '-' },
  { id: '*', label: '*' },
  { id: '/', label: '/' },
];

const CalculatorBuilder = () => {
  const { 
    components, 
    addComponent, 
    removeComponent, 
    darkMode, 
    toggleDarkMode, 
    undo, 
    clearComponents,
    reorderComponents
  } = useStore();
  
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState('');

  useEffect(() => {
    if (components.length > 0) {
      const expression = components.map(comp => comp.label).join('');
      setInputValue(expression);
    } else {
      setInputValue('');
      setResult('');
    }
  }, [components]);

  const handleDrop = (event) => {
    event.preventDefault();
    const componentData = event.dataTransfer.getData('text/plain');
    if (componentData) {
      const component = JSON.parse(componentData);
      addComponent(component);
    }
  };

  const handleDragStart = (event, index) => {
    event.dataTransfer.setData('dragIndex', index.toString());
  };
  
  
  
  const handleDropReorder = (event, newIndex) => {
    event.preventDefault();
    const dragIndex = parseInt(event.dataTransfer.getData('dragIndex'), 10);
if (!isNaN(dragIndex) && dragIndex !== newIndex) {
  reorderComponents(dragIndex, newIndex);
}

  };
  
  const handleDragOver = (event) => {
    event.preventDefault();
  };
  
  

  const handleClear = () => {
    clearComponents();
    setInputValue('');
    setResult('');
  };

  const handleCalculate = () => {
    try {
      const sanitizedInput = inputValue.replace(/[^0-9+\-*/().]/g, '');
      if (!/^\d+([\+\-\*/]\d+)*$/.test(sanitizedInput)) {
        throw new Error('Invalid expression');
      }
      setResult(eval(sanitizedInput).toString()); // Use eval cautiously
    } catch (error) {
      setResult('Error');
    }
  };
  

  const handleComponentClick = (component) => {
    addComponent(component);
  };

  return (
    <div className={`flex flex-col items-center p-4 min-h-screen ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <h1 className="text-2xl text-center my-4">Calculator Builder</h1>
      
      <div 
  className="border-2 border-dashed p-4 mb-4 w-full max-w-md min-h-[100px]" 
  onDragOver={handleDragOver}
>
  <div className="grid grid-cols-4 gap-2">
    {components.map((component, index) => (
      <div 
        key={`${component.id}-${index}`} 
        className="border p-2 flex justify-center items-center cursor-move"
        draggable
        onDragStart={(e) => handleDragStart(e, index)}
        onDrop={(e) => handleDropReorder(e, index)}
        onDragOver={(e) => e.preventDefault()} // Ensure smooth dragging
      >
        {component.label}
        <button 
          onClick={() => removeComponent(index)} 
          className="ml-2 text-red-500 hover:text-red-700"
        >
          ×
        </button>
      </div>
    ))}
  </div>
</div>



      <div className="grid grid-cols-4 gap-2 w-full max-w-md">
        {predefinedComponents.map((component) => (
          <div
            key={component.id}
            className="border p-2 flex justify-center items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
            draggable
            onDragStart={(e) => handleDragStart(e, component)}
            onClick={() => handleComponentClick(component)}
          >
            {component.label}
          </div>
        ))}
      </div>

      <div className="w-full max-w-md mt-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className={`border p-2 w-full rounded ${
            darkMode 
              ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600 focus:border-blue-500' 
              : 'bg-white text-black placeholder-gray-500 border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Enter calculation"
        />
      </div>

      <button 
        onClick={handleCalculate} 
        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded mt-4"
      >
        Calculate
      </button>

      <div className="mt-4 text-lg">Result: {result}</div>

      <div className="flex gap-2 mt-4">
        <button 
          onClick={undo} 
          className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded"
        >
          Undo
        </button>      
        <button 
          onClick={handleClear} 
          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
        >
          Clear
        </button>
      </div>

      <button 
        onClick={toggleDarkMode} 
        className="mt-4 p-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        Toggle Dark Mode
      </button>
    </div>
  );
};

export default CalculatorBuilder;