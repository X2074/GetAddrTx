// DownloadButton.tsx

import React from 'react';

function DownloadButton({ data, headers, filename }: {
    data: Array<{
        blockNumber: string,
        from: string,
        to: string,
        hash: string,
        value: string,
        input: string
    }>;
    headers: string[];
    filename: string
}) {
    const downloadCSV = () => {
        if (data.length === 0) {
            // 如果数据为空，不执行下载操作
            alert('No data to download');
            return;
        }

        // 转换 JSON 实体数组为包含相同属性的对象数组
        const formattedData = data.map((entity) => {
            return {
                'Block Number': entity.blockNumber,
                'From': entity.from,
                'To': entity.to,
                'Tx Hash': entity.hash,
                'Value': entity.value,
            };
        });

        // 创建CSV文件内容
        const mimeType = "data:text/csv;charset=utf-8";
        const csvContent = headers.join(",") + "\n" +
            formattedData.map((row) => headers.map((header) => row[header as keyof typeof row]).join(",")).join("\n");

        // 创建一个Blob对象
        const blob = new Blob([csvContent], { type: mimeType });
        // alert(csvContent);

        // 创建一个下载链接
        const url = URL.createObjectURL(blob);

        // 创建一个虚拟的下载链接并单击它来触发下载
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.csv`;
        a.click();
    };

    return (
        <div className="flex justify-end pt-5">
            <button
                onClick={downloadCSV}
                className="bg-blue-500 text-white hover:bg-blue-200 px-2 py-1 text-sm lg:rounded-xl"
            >
                Download CSV
            </button>
        </div>
    );
}

export default DownloadButton;
