// Finality, execution and consensus are separate pieces of evidence.
export function assessReceipt(receipt){
 const status=receipt?.statusName||receipt?.status;
 const finalized=status==='FINALIZED'||status===7||status==='7';
 const rounds=receipt?.consensus_history?.consensus_results||[];
 const round=rounds.at(-1)||{};
 const asArray=x=>Array.isArray(x)?x:x?[x]:[];
 const results=[...asArray(round.leader_result),...asArray(round.validator_results),
  ...asArray(receipt?.consensus_data?.leader_receipt),...asArray(receipt?.consensus_data?.validators)];
 const success=new Set(['SUCCESS','FINISHED_WITH_RETURN']);
 const consensus=receipt?.result_name||receipt?.resultName||receipt?.consensusResultName||'';
 const rootStates=[receipt?.txExecutionResultName,receipt?.execution_result].filter(Boolean).map(String);
 const leaders=results.filter(r=>r.mode==='leader'||(!r.mode&&r.vote==null));
 const primaryStates=[...rootStates,...leaders.map(r=>r.execution_result).filter(Boolean).map(String)];
 const primarySucceeded=primaryStates.length>0&&primaryStates.every(s=>success.has(s));
 // Studio may cancel unused validators after quorum. This precise, nonfatal
 // validator outcome is not a transaction execution failure. Never ignore a
 // leader error, a different cancellation, or an idle without majority agreement.
 const quorumIdle=r=>primarySucceeded&&consensus==='MAJORITY_AGREE'&&r.mode==='validator'&&
  String(r.vote).toLowerCase()==='idle'&&r.execution_result==='ERROR'&&
  r.genvm_result?.error_code==='CONSENSUS_VALIDATOR_QUORUM_REACHED'&&
  r.genvm_result?.raw_error?.fatal===false;
 const contributing=results.filter(r=>!quorumIdle(r));
 const states=[...rootStates,...contributing.map(r=>r.execution_result).filter(Boolean).map(String)];
 const failed=primaryStates.some(s=>/ERROR|REVERT|FAIL|TIMEOUT|OUT_OF_/i.test(s));
 let detail='';
 if(failed){const raw=leaders.find(r=>r.execution_result&&!success.has(r.execution_result))?.result;
  if(typeof raw==='string')try{detail=new TextDecoder().decode(Uint8Array.from(atob(raw),c=>c.charCodeAt(0))).replace(/^[\x00-\x1f]+/,'').slice(0,240);}catch{}
 }
 const outcome=!finalized?'pending':failed?'failed':primarySucceeded&&states.every(s=>success.has(s))&&consensus==='MAJORITY_AGREE'?'success':'unverified';
 return {status,finalized,outcome,consensus,detail};
}
