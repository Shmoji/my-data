import create from 'zustand'

type State = {
  currentData: any
}

export const useDataStore = create<State>((set) => ({
  currentData: null,
  setCurrentData: (newData: any) => {
    set({ currentData: newData })
  },
  clearCurrentData: () => {
    console.log('clearing current data')
    set({ currentData: null })
  }
}))
