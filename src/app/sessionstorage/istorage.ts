// IStorage istorage interface
export interface IStorage {        
    length: number

    getItem(key: string): any
    setItem(key: string, data: any, config?: any): void
    removeItem(key: string): void
    clear(): void
    hasProperty(key: string): boolean
    key(index: number): string
}