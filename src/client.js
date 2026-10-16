import {createClient} from 'genlayer-js';
import {studionet} from 'genlayer-js/chains';
import {TransactionHashVariant} from 'genlayer-js/types';
import {parseExactJson} from './engine.js';
export const SOURCE_HASH='84eec53fc6d9ed0c1fc3fd30b50983dfacd1a6308ff016303840c055660e7d72';
export const RPC='https://studio.genlayer.com/api';
export const CHAIN_ID=61999;
if(studionet.id!==CHAIN_ID||studionet.rpcUrls.default.http[0]!==RPC)throw Error('SDK network mismatch');
export const readClient=createClient({chain:studionet,endpoint:RPC});
export async function sourceHash(code){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(code)))].map(v=>v.toString(16).padStart(2,'0')).join('');}
export function validAddress(a){return /^0x[0-9a-fA-F]{40}$/.test(a)&&!/^0x0{40}$/i.test(a);}
export async function verifyDeployment(address){if(!validAddress(address))throw Error('请输入有效合约地址');const code=await readClient.getContractCode(address);if(await sourceHash(code)!==SOURCE_HASH)throw Error('链上源码与冻结合约不一致，写入保持锁定');const protocol=JSON.parse(await readClient.readContract({address,functionName:'get_protocol',args:[],transactionHashVariant:TransactionHashVariant.LATEST_FINAL}));if(protocol.protocol!=='ACCORD-SPACE-V1'||protocol.chain_id!==CHAIN_ID)throw Error('协议版本不匹配');return protocol;}
export async function readSession(address,id){const raw=await readClient.readContract({address,functionName:'get_session',args:[id],transactionHashVariant:TransactionHashVariant.LATEST_FINAL});if(typeof raw!=='string')throw Error('Unexpected contract result');return parseExactJson(raw);}
export async function readHash(address,id){return readClient.readContract({address,functionName:'get_state_hash',args:[id],transactionHashVariant:TransactionHashVariant.LATEST_FINAL});}
export function makeWallet(provider,onChange=()=>{},deps={}){
  if(!provider?.request)throw Error('请在本地 Chrome 打开并安装 OKX Wallet');
  const create=deps.createClient||createClient,verify=deps.verifyDeployment||verifyDeployment;
  let account=null,remaining=0,busy=false;
  const invalidate=()=>{account=null;remaining=0;onChange();};
  provider.on?.('accountsChanged',invalidate);provider.on?.('chainChanged',invalidate);
  async function check(){
    if(Number(await provider.request({method:'eth_chainId'}))!==CHAIN_ID)throw Error('钱包必须连接 Stable Studionet 61999');
    const accounts=await provider.request({method:'eth_accounts'});
    if(!account||accounts[0]?.toLowerCase()!==account.toLowerCase()){invalidate();throw Error('签名账户已变化，请重新连接并设置范围');}
  }
  return {
    get account(){return account;},get remaining(){return remaining;},
    disarm(){remaining=0;},
    async connect(){
      remaining=0;
      const addresses=await provider.request({method:'eth_requestAccounts'});
      if(!validAddress(addresses[0]))throw Error('无可用账户');
      if(Number(await provider.request({method:'eth_chainId'}))!==CHAIN_ID)throw Error('请在钱包中切换至 Stable Studionet：61999；RPC '+RPC);
      account=addresses[0];return account;
    },
    arm(count){if(!account||!Number.isInteger(count)||count<1||count>12)throw Error('请先连接，并设置 1–12 笔范围');remaining=count;},
    async send({address,method,args=[],code}){
      if(busy)throw Error('已有钱包请求进行中');
      busy=true;
      try{
        await check();if(remaining<1)throw Error('未设置或已用完交易范围');
        if(code){if(await sourceHash(code)!==SOURCE_HASH)throw Error('合约源码哈希不匹配');}
        else await verify(address);
        await check();
        let requests=0;
        // SDK 1.1.8 can fall back to another ABI after an error. A guarded
        // provider permits exactly ONE send request, even through that path.
        const guarded={request:async payload=>{
          if(['eth_sendTransaction','eth_signTransaction','eth_sendRawTransaction'].includes(payload.method)){
            if(payload.method!=='eth_sendTransaction'||requests++!==0)throw Error('禁止自动重发或替代签名');
            await check();if(remaining<1)throw Error('交易范围已用完');remaining--;
          }
          return provider.request(payload);
        }};
        const client=create({chain:studionet,endpoint:RPC,account,provider:guarded});
        return code?await client.deployContract({code,args:[],leaderOnly:false,consensusMaxRotations:0})
          :await client.writeContract({address,functionName:method,args,value:0n,leaderOnly:false,consensusMaxRotations:0});
      }catch(e){remaining=0;throw e;}finally{busy=false;}
    }
  };
}
export async function readReceipt(hash){if(!/^0x[0-9a-fA-F]{64}$/.test(hash))throw Error('无效交易哈希');return readClient.getTransaction({hash});}
