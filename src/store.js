import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      components: [],
      previousState: null,

      addComponent: (component) => {
        const newComponents = [...get().components, component];
        set({ previousState: get().components, components: newComponents });
      },

      removeComponent: (index) => {
        const newComponents = [...get().components];
        newComponents.splice(index, 1);
        set({ previousState: get().components, components: newComponents });
      },

      reorderComponents: (fromIndex, toIndex) => {
        const updatedComponents = [...get().components];
        const [movedComponent] = updatedComponents.splice(fromIndex, 1);
        updatedComponents.splice(toIndex, 0, movedComponent);
        set({ previousState: get().components, components: updatedComponents });
      },

      clearComponents: () => {
        set({ previousState: get().components, components: [] });
      },

      undo: () => {
        set({ components: get().previousState || [], previousState: null });
      },

      darkMode: false,
      toggleDarkMode: () => {
        set({ darkMode: !get().darkMode });
      },
    }),
    {
      name: 'calculator-builder',
      getStorage: () => localStorage,
    }
  )
);

export default useStore;
