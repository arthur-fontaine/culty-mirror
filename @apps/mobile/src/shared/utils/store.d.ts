export interface Store {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string | undefined) => Promise<void>;
}