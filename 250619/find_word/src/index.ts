import fs from 'fs';
import path from 'path';
import { performance } from 'perf_hooks';

const data = fs.readFileSync(path.join(__dirname, '../input/1m.csv'));
const words = data
	.toString()
	.split('\n')
	.map((line) => line.trim());


const queryFile = fs.readFileSync(path.join(__dirname, '../input/queries.csv'));
const queries = queryFile
	.toString()
	.split('\n')
	.map((line) => line.trim());

// ----------------------------------------
// findWord 함수를 호출하여 결과를 출력함.
// queries.csv 와 연결할 필요 있음.
// console.log(findWord('WORDHERE'));
// ----------------------------------------

words.shift()
queries.shift();

const wordMap = new Map<string , number>();

// 단어 사전에서 같은 단어끼리 묶는다 
words.forEach((word) => {
	if(!wordMap.has(word)){
		wordMap.set(word,0);
	}
	const count = wordMap.get(word)!
	wordMap.set(word, count + 1);
});

// 사전순, 빈도 수 , 오름차순
const sortedArray = Array.from(wordMap.entries()).sort((a,b) => {
	if(a[0].localeCompare(b[0]) === 0){
		return a[1] - b[1]
	}
	return a[0].localeCompare(b[0])
})

function findWord(prefix: string): {
	duration: number;
	result: string[];
} {
	const startTime = performance.now();
	const result: string[] = [];

	let flag = false;
	 let lowerIndex = lowerbound(prefix);

	for(let i = lowerIndex ; i < sortedArray.length; i++){
		const word = sortedArray[i][0];
		if(word.startsWith(prefix) && result.length <= 10){
			result.push(word);
			if(result.length === 10){
				break;
			}
		}
		else if(flag && !word.startsWith(prefix) ){
			break;
		}
	}

	const duration = performance.now() - startTime;

	return {
		duration,
		result,
	};
}

function lowerbound(prefix : string){
	let lo = 0;
	let hi = sortedArray.length;
	let mid ;

	while(lo < hi){
		mid = Math.floor((lo +hi) /2);	

		if(sortedArray[mid][0].localeCompare(prefix) === -1){
			lo = mid + 1
		}

		else{
			hi = mid
		}
	}

	return lo;
}



queries.map((query) => {
	console.log(findWord(query))
})