// Finality, execution and consensus are separate pieces of evidence.
export function assessReceipt(receipt){
 const status=receipt?.statusName||receipt?.status;
 const finalized=status==='FINALIZED'||status===7||status==='7';
 const rounds=receipt?.consensus_history?.consensus_results||[];
 const round=rounds.at(-1)||{};
 const asArray=x=>Array.isArray(x)?x:x?[x]:[];
 const results=[...asArray(round.leader_result),...asArray(round.validator_results),
  ...asArray(receipt?.consensus_data?.leader_receipt),...asArray(receipt?.consensus_data?.validators)];
 const states=[receipt?.txExecutionResultName,receipt?.execution_result,...results.map(r=>r.execution_result)].filter(Boolean).map(String);
 const success=new Set(['SUCCESS','FINISHED_WITH_RETURN']);
 const failed=states.some(s=>/ERROR|REVERT|FAIL|TIMEOUT|OUT_OF_/i.test(s));
 const consensus=receipt?.result_name||receipt?.resultName||receipt?.consensusResultName||'';
 let detail='';
 if(failed){const raw=results.find(r=>r.execution_result&&!success.has(r.execution_result))?.result;
  if(typeof raw==='string')try{detail=new TextDecoder().decode(Uint8Array.from(atob(raw),c=>c.charCodeAt(0))).replace(/^[\x00-\x1f]+/,'').slice(0,240);}catch{}
 }
 const outcome=!finalized?'pending':failed?'failed':states.length&&states.every(s=>success.has(s))&&consensus==='MAJORITY_AGREE'?'success':'unverified';
 return {status,finalized,outcome,consensus,detail};
}
