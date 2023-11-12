// Web3Provider.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import Web3 from 'web3';

// 创建一个上下文
export const Web3Context = createContext<{ web3Provider: Web3 | null }>({ web3Provider: null });

export function Web3Provider({ children }: { children: React.ReactNode }) {
    // 在 Web3Provider 中初始化 web3Provider
    const [web3Provider, setWeb3Provider] = useState<Web3 | null>(null);

    useEffect(() => {
        // 创建 Web3 实例，
        const web3 = new Web3('https://rpc.dimai.ai');
        console.log('web3Provider initialized:', web3);
        setWeb3Provider(web3);
    }, []);

    return (
        <Web3Context.Provider value={{ web3Provider }}>
            {children}
        </Web3Context.Provider>
    );
}
