declare module "*.png" {
    const value: any;
    export = value;
}

declare module "*.svg" {
    const content: any;
    export default content;
}

interface Window {
    ethereum: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on?: (event: string, handler: (...args: any[]) => void) => void;
      removeListener?: (event: string, handler: (...args: any[]) => void) => void;
    };
  }
