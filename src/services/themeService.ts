import { httpClient } from './httpClient';

export interface ThemeColors {
  [key: string]: string;
}

export interface Theme {
  id: number;
  name: string;
  description?: string;
  lightColors: ThemeColors;
  darkColors?: ThemeColors;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateThemeData {
  name: string;
  description?: string;
  lightColors: ThemeColors;
  darkColors?: ThemeColors;
}

export interface UpdateThemeData {
  name?: string;
  description?: string;
  lightColors?: ThemeColors;
  darkColors?: ThemeColors;
}

class ThemeService {
  async getAllThemes(): Promise<Theme[]> {
    const response = await httpClient.get<Theme[]>('/api/themes');
    return response.data!;
  }

  async getActiveTheme(): Promise<Theme> {
    const response = await httpClient.get<Theme>('/api/themes/active');
    return response.data!;
  }

  async getThemeById(id: number): Promise<Theme> {
    const response = await httpClient.get<Theme>(`/api/themes/${id}`);
    return response.data!;
  }

  async createTheme(data: CreateThemeData): Promise<Theme> {
    const response = await httpClient.post<Theme>('/api/themes', data);
    return response.data!;
  }

  async updateTheme(id: number, data: UpdateThemeData): Promise<Theme> {
    const response = await httpClient.put<Theme>(`/api/themes/${id}`, data);
    return response.data!;
  }

  async setActiveTheme(id: number): Promise<{ message: string; theme: Theme }> {
    const response = await httpClient.request<{ message: string; theme: Theme }>(`/api/themes/${id}/active`, { method: 'PATCH' });
    return response.data!;
  }

  async setDefaultTheme(id: number): Promise<{ message: string; theme: Theme }> {
    const response = await httpClient.request<{ message: string; theme: Theme }>(`/api/themes/${id}/default`, { method: 'PATCH' });
    return response.data!;
  }

  async deleteTheme(id: number): Promise<{ message: string }> {
    const response = await httpClient.delete<{ message: string }>(`/api/themes/${id}`);
    return response.data!;
  }
}

export const themeService = new ThemeService();