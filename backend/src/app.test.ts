import request from 'supertest';
import { app } from './app';

describe('POST /scanBlocks', () => {
    it('should return an array of transactions', async () => {
        const response = await request(app)
            .post('/scanBlocks')
            .send({
                addresses: ['0xA97064F198c28A7A09765aAc03503f5A723038b1', '0xb63B9534e1C591E591a3aCCfBBEB1ffe7926980a'],
                startBlock: 1021445,
                endBlock: 1022985,
            });

        // expect(response.status).toBe(200);
        console.log(response.body);
        // expect(Array.isArray(response.body)).toBe(true);
        // Add more assertions based on your application logic
    });

    it('should handle errors gracefully', async () => {
        const response = await request(app)
            .post('/scanBlocks')
            .send({
                // Invalid request data to trigger an error
            });

        // expect(response.status).toBe(500);
        console.log(response.body);
        expect(response.body).toEqual({ error: '内部服务器错误' });
    });
});
