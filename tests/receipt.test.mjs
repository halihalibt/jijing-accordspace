import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {assessReceipt} from '../src/receipt.js';
const actual=JSON.parse(fs.readFileSync('evidence/deployment-failure-20261016.json','utf8')).receipt;
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
