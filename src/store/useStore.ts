import { create } from 'zustand';
import { Unit, ProjectArea } from '../types';
import * as api from '../services/api';

interface Store {
  units: Unit[];
  projects: ProjectArea[];
  monthlyIncomePerCustomer: number;
  initialized: boolean;
  addUnit: (unit: Unit) => Promise<void>;
  updateUnit: (unit: Unit) => Promise<void>;
  addProject: (project: ProjectArea) => Promise<void>;
  updateProject: (project: ProjectArea) => Promise<void>;
  setMonthlyIncomePerCustomer: (amount: number) => Promise<void>;
  initialize: () => Promise<void>;
}

export const useStore = create<Store>((set, get) => ({
  units: [],
  projects: [],
  monthlyIncomePerCustomer: 0,
  initialized: false,

  initialize: async () => {
    if (get().initialized) return;

    try {
      const [units, projects, settings] = await Promise.all([
        api.fetchUnits(),
        api.fetchProjects(),
        api.fetchSettings(),
      ]);

      set({
        units,
        projects,
        monthlyIncomePerCustomer: settings.monthlyIncomePerCustomer,
        initialized: true,
      });
    } catch (error) {
      console.error('Failed to initialize store:', error);
    }
  },

  addUnit: async (unit) => {
    try {
      const savedUnit = await api.saveUnit(unit);
      set((state) => ({ units: [...state.units, savedUnit] }));
    } catch (error) {
      console.error('Failed to add unit:', error);
      throw error;
    }
  },

  updateUnit: async (unit) => {
    try {
      const updatedUnit = await api.updateUnit(unit);
      set((state) => ({
        units: state.units.map((u) => (u.id === unit.id ? updatedUnit : u)),
      }));
    } catch (error) {
      console.error('Failed to update unit:', error);
      throw error;
    }
  },

  addProject: async (project) => {
    try {
      const savedProject = await api.saveProject(project);
      set((state) => ({ projects: [...state.projects, savedProject] }));
    } catch (error) {
      console.error('Failed to add project:', error);
      throw error;
    }
  },

  updateProject: async (project) => {
    try {
      const updatedProject = await api.updateProject(project);
      set((state) => ({
        projects: state.projects.map((p) => (p.id === project.id ? updatedProject : p)),
      }));
    } catch (error) {
      console.error('Failed to update project:', error);
      throw error;
    }
  },

  setMonthlyIncomePerCustomer: async (amount) => {
    try {
      await api.saveSettings({ monthlyIncomePerCustomer: amount });
      set({ monthlyIncomePerCustomer: amount });
    } catch (error) {
      console.error('Failed to save monthly income:', error);
      throw error;
    }
  },
}));