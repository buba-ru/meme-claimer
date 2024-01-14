import proxy from './userData/proxy.js';
import fs from 'fs';
import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import * as web3 from 'web3-eth-accounts';
import ua from 'random-useragent';

const fileToArr = (path) => {
    let lines = fs.readFileSync(path).toString('UTF8').split('\n');
    lines = lines.map(pk => pk.trim());
    return lines.filter(pk => pk != '');
}

const changeIP = async () => {
    const changeIpResp = await axios.get(proxy.change_ip_url, {
        validateStatus: function (status) {
            return status < 500;
        }
    });
    
    if (changeIpResp.data?.error_message == undefined) {
        console.log(`Change ip successfull`);
    } else {
        console.log(`Change ip error: ${changeIpResp.data.error_message}`);
    }
}

const privateKeys = fileToArr('userData/private.keys');
console.log(`Loaded ${privateKeys.length} private keys`);

(async () => {
    const result = [];
    let n = 1;
    for (const pk of privateKeys) {
        const client = axios.create({
            httpsAgent: new HttpsProxyAgent(proxy.server),
            headers: {
                'accept': 'application/json',
                'accept-language': 'ru,en;q=0.9',
                'content-type': 'application/json',
                'origin': 'https://www.memecoin.org',
                'user-agent': ua.getRandom(),
            }
        });
    
        const externalIP = (await client.get('https://api.ipify.org/?format=json')).data.ip;
        console.log(`ip: ${externalIP}`);
    
        // auth 
        const account = web3.privateKeyToAccount(pk);
        const shortAddr = `${account.address.substring(0, 5)}...${account.address.substring(account.address.length - 4)}` //'0xADF...8f3e';
        const signMessage = `The wallet will be used for MEME allocation. If you referred friends, family, lovers or strangers, ensure this wallet has the NFT you referred.\n\nBut also...\n\nNever gonna give you up\nNever gonna let you down\nNever gonna run around and desert you\nNever gonna make you cry\nNever gonna say goodbye\nNever gonna tell a lie and hurt you\n\nWallet: ${shortAddr}`;
        
        const authResp = await client.post('https://memefarm-api.memecoin.org/user/wallet-auth', {
            address: account.address,
            delegate: account.address,
            message: signMessage,
            signature: account.sign(signMessage).signature,
        });
    
        if (authResp.data?.error != undefined) {
            console.log(`[${n}] ${account.address}: ${authResp.data.error}`);
            result.push(`${account.address};${authResp.data.error}`);
            await changeIP();
            continue;
        }
    
        // request points
        client.defaults.headers.Authorization = `Bearer ${authResp.data.accessToken}`;
        delete  client.defaults.headers['content-type'];
        
        const pointsResp = await client.get('https://memefarm-api.memecoin.org/user/tasks');
        console.log(`[${n}] ${account.address}: ${pointsResp.data.points.current}; ref_points: ${pointsResp.data.points.referral}`);
        result.push(`${account.address};${pointsResp.data.points.current};${pointsResp.data.points.referral}`);

        await changeIP();
        n++;
        console.log();
        await new Promise(res => setTimeout(res, 30 * 1000));
    }

    fs.writeFile('result.txt', result.join('\n'), function(err) {
        if (err) {
            console.log(err);
        }
    });
})();