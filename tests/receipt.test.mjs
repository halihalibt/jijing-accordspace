import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {assessReceipt} from '../src/receipt.js';
const actual=JSON.parse(fs.readFileSync('evidence/deployment-failure-20261016.json','utf8')).receipt;
const created=JSON.parse(fs.readFileSync('evidence/create-session-quorum-20261016.json','utf8')).receipt;
test('actual create-session quorum cancellations do not overturn a successful leader and majority',()=>{
 const result=assessReceipt(created);assert.equal(result.outcome,'success');assert.equal(result.detail,'');
 const pending=structuredClone(created);pending.statusName='ACCEPTED';pending.status=5;
 assert.equal(assessReceipt(pending).outcome,'pending');
});
test('idle exclusion is restricted to nonfatal validator quorum cancellation',()=>{
 for(const change of [v=>v.mode='leader',v=>v.vote='agree',v=>v.genvm_result.error_code='TIMEOUT',v=>v.genvm_result.raw_error.fatal=true]){
  const r=structuredClone(created);change(r.consensus_history.consensus_results[0].validator_results[0]);
  assert.notEqual(assessReceipt(r).outcome,'success');
 }
 const missingLeader=structuredClone(created);missingLeader.consensus_history.consensus_results[0].leader_result=[];
 assert.notEqual(assessReceipt(missingLeader).outcome,'success');
 const disagree=structuredClone(created);disagree.result_name='MAJORITY_DISAGREE';
 assert.notEqual(assessReceipt(disagree).outcome,'success');
});
test('a leader execution error remains failed even when other validators stopped at quorum',()=>{
 const r=structuredClone(created),leader=r.consensus_history.consensus_results[0].leader_result[0];
 leader.execution_result='ERROR';leader.result='AmludmFsaWRfY29udHJhY3Q=';
 assert.equal(assessReceipt(r).outcome,'failed');assert.equal(assessReceipt(r).detail,'invalid_contract');
});
test('actual finalized unanimous deployment failure is not a successful deployment',()=>{
 const result=assessReceipt(actual);
 assert.equal(result.finalized,true);assert.equal(result.consensus,'MAJORITY_AGREE');
 assert.equal(result.outcome,'failed');assert.equal(result.detail,'invalid_contract');
});
test('finality or agreement without successful execution remains unverified',()=>{
 for(const receipt of [{statusName:'FINALIZED'},{statusName:'FINALIZED',result_name:'MAJORITY_AGREE'},
  {statusName:'FINALIZED',execution_result:'SUCCESS',result_name:'MAJORITY_DISAGREE'}]){
  assert.equal(assessReceipt(receipt).outcome,'unverified');
 }
 assert.equal(assessReceipt({statusName:'PENDING'}).outcome,'pending');
});
test('successful execution plus finality and consensus passes evidence classification',()=>{
 assert.equal(assessReceipt({statusName:'FINALIZED',result_name:'MAJORITY_AGREE',consensus_history:{consensus_results:[{leader_result:[{execution_result:'SUCCESS'}],validator_results:[{execution_result:'SUCCESS'}]}]}}).outcome,'success');
 assert.equal(assessReceipt({status:7,result_name:'MAJORITY_AGREE',txExecutionResultName:'FINISHED_WITH_RETURN'}).outcome,'success');
});
