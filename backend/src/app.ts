// src/app.ts
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import Web3 from 'web3';
import config from './config';

export const app = express();
const port = 3012; // 或者你想要使用的端口
const  web3Provider = new Web3.providers.HttpProvider(config.web3.rpc);
console.log(web3Provider)
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


app.use(bodyParser.json());
app.use(cors());

app.post('/scanBlocks', async (req, res) => {
    try {
        const { addresses, startBlock, endBlock } = req.body;

        const web3 = new Web3(web3Provider);
        const transactions: Transaction[] = [];

        for (let i = startBlock; i <= endBlock; i++) {
            const block = await web3.eth.getBlock(i, true);

            if ( !block || !block.transactions || block.transactions.length === 0) {
                continue;
            }

            for (let j = 0; j < addresses.length; j++) {
                const address = addresses[j];

                //@ts-ignore
                const relevantTransactions = (block.transactions as EthereumTransaction[])
                    .filter((tx) => tx.from === address.toLowerCase() || tx.to === address.toLowerCase());

                relevantTransactions.forEach((tx) => {
                    transactions.push({
                        blockNumber: tx.blockNumber.toString(),
                        from: tx.from,
                        to: tx.to,
                        hash: tx.hash,
                        value: web3.utils.fromWei(tx.value, 'ether'),
                    });
                });
            }
        }

        // res.json(transactions);
        res.status(200).json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '内部服务器错误' });

        return;
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});



// app.get('/', (req, res) => {
//     res.send('Hello, TypeScript Backend!');
// });

