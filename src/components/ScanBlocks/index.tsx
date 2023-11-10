// components/ScanBlocks.tsx
import React, {useState, useEffect, useCallback} from 'react';
import Web3, {HttpProvider} from 'web3';
import DownloadButton from '@/components/DownloadButton'; // 导入 DownloadButton 组件

// 定义以太坊交易对象类型
interface Transaction {
    blockNumber: string; // 区块号
    from: string; // 发送方地址
    to: string; // 接收方地址
    hash: string; // 交易哈希
    value: string; // 交易价值
}

interface EthereumTransaction {
    blockHash: string;
    blockNumber: string;
    chainId: string;
    from: string;
    gas: string;
    gasPrice: string;
    hash: string;
    input: string;
    nonce: string;
    r: string;
    s: string;
    to: string;
    transactionIndex: string;
    type: string;
    v: string;
    value: string;
}

export function ScanBlocks({ web3Provider }: { web3Provider: Web3 }) {
    const [addresses, setAddresses] = useState<string[]>([]);
    const [startBlock, setStartBlock] = useState(0);
    const [endBlock, setEndBlock] = useState(0);
    const [transactionData, setTransactionData] = useState<Transaction[]>([]);
    const [clicked, setClicked] = useState(false);
    const [tableHeaders, setTableHeaders] = useState<string[]>([]);

    const fetchData = useCallback( async () => {
        const web3 = new Web3(web3Provider);
        // console.log('web3Provider:', web3Provider);
        const transactions: Transaction[] = [];

        for (let i = startBlock; i <= endBlock; i++) {
            const block = await web3.eth.getBlock(i, true);
            // console.log(block.transactions);

            if (block.transactions.length === 0) {
                continue;
            }

            for (let j = 0; j < addresses.length; j++) {
                const address = addresses[j];
                console.log("filtered address:",address);

                //@ts-ignore
                const relevantTransactions = (block.transactions as EthereumTransaction[])
                    .filter((tx) => {
                        //@ts-ignore
                        return tx.from === address.toLowerCase() || (tx.to === address.toLowerCase());
                    });


                relevantTransactions.forEach((tx) => {
                    transactions.push({
                        blockNumber: tx.blockNumber.toString(),
                        from: tx.from,
                        to: tx.to, // 可能为 null，使用 null 作为备选值
                        hash: tx.hash,
                        value: web3.utils.fromWei(tx.value, 'ether'),
                    });
                });
            }
        }

        setTransactionData(transactions);

        setClicked(false);
    }, [addresses, endBlock, startBlock, web3Provider]);

    useEffect(() => {
        if (clicked) {
            const headers = ["Block Number", "From", "To", "Tx Hash", "Value"];
            setTableHeaders(headers as string[]);

            fetchData().then();
        }
    }, [clicked, fetchData]);

    const handleRequestClick = async () => {
        setTransactionData([]);
        setClicked(true);
        await fetchData(); // 使用 await 确保 fetchData 执行完成
    };

    return (
        <div className="flex flex-col max-w-6xl w-full p-2 text-sm">
            <div className="p-1 text-center border border-blue-300 mb-4 lg:rounded-full">
                <p style={{ margin: '15px 0' }}>
                    查询地址：
                    <input
                        type="text"
                        id="getAddr"
                        className="getAddr"
                        placeholder="Enter EVM addresses"
                        value={addresses.join(',')}
                        onChange={(e) => setAddresses(e.target.value.split(','))}
                        style={{
                            width: '45%',
                            height: '30px', // 设置输入框的固定高度
                            overflow: 'hidden', // 隐藏溢出的内容
                            resize: 'both', // 允许垂直和水平缩放
                            textAlign: 'center'
                        }}
                    />
                </p>
                <p style={{ margin: '15px 0' }}>
                    起始区块：
                    <input
                        type="number"
                        placeholder="Start Block"
                        value={startBlock}
                        onChange={(e) => setStartBlock(parseInt(e.target.value))}
                        style={{
                            width: '45%',
                            height: '30px', // 设置输入框的固定高度
                            overflow: 'hidden', // 隐藏溢出的内容
                            resize: 'both', // 允许垂直和水平缩放
                            textAlign: 'center'
                        }}
                    />
                </p>

                <p style={{ margin: '15px 0' }}>
                    结束区块：
                    <input
                        type="number"
                        placeholder="End Block"
                        value={endBlock}
                        onChange={(e) => setEndBlock(parseInt(e.target.value))}
                        style={{
                            width: '45%',
                            height: '30px', // 设置输入框的固定高度
                            overflow: 'hidden', // 隐藏溢出的内容
                            resize: 'both', // 允许垂直和水平缩放
                            textAlign: 'center'
                        }}
                    />
                </p>
                <p style={{ margin: '20px 0' }} className={"text-center font-bold"}>
                    {!clicked ? (
                        <button
                            onClick={handleRequestClick}
                            className="bg-blue-500 text-white hover:bg-blue-700 px-4 py-2 lg:rounded-xl"
                        >
                            Scan Tx
                        </button>
                    ) : (
                        <button className="text-red-500 text-sm hover:bg-blue-700">Data loading</button>
                    )}
                </p>
            </div>
            <div className="w-full overflow-x-auto">
                <table className="w-full border-collapse border border-gray-500">
                    <thead className="bg-blue-200 text-xs">
                    <tr>
                        <th className="border border-blue-500 p-2">Block Number</th>
                        <th className="border border-blue-500 p-2">From</th>
                        <th className="border border-blue-500 p-2">To</th>
                        <th className="border border-blue-500 p-2">Tx Hash</th>
                        <th className="border border-blue-500 p-2">Value</th>
                        {/*<th className="border border-blue-500 p-2">Input</th>*/}
                    </tr>
                    </thead>
                    <tbody className="text-xs">
                    {transactionData.map((transaction, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : '' }>
                            <td className="border border-gray-300 p-1">{transaction.blockNumber}</td>
                            <td className="text-5 border border-gray-300 p-1">{transaction.from}</td>
                            <td className="text-10 border border-gray-300 p-1">{transaction.to}</td>
                            <td className="text-10 border border-gray-300 p-1 text-blue-600 hover:underline">
                                <a href={`https://qng.qitmeer.io/tx/${transaction.hash}`} target="_blank" rel="noopener noreferrer">
                                    {transaction.hash}
                                </a>
                            </td>
                            <td className="border border-gray-300 p-1">{transaction.value}</td>
                            {/*<td className="border border-gray-300 p-2">{transaction.input}</td>*/}
                        </tr>
                    ))}
                    </tbody>
                </table>

            </div>
            <DownloadButton data={transactionData} headers={tableHeaders} filename="transactionData" />
        </div>
    );
}
