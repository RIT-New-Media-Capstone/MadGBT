(()=>{let e,l={},t={};const n=()=>{window.scrollTo(0,0)},s=(e,l)=>{const t=l||(e=>e),n={};for(let l=0;l<e.length;l++){const s=e[l];n[s]=document.querySelector(`#${t(s)}`)}return n},a=e=>{l[e]&&(Object.keys(l).forEach((t=>{l[t].classList.toggle("activeScreen",t===e)})),n())},o=e=>{t.fillInBlanksFormBlanks.innerHTML=e.map(((e,l)=>`<div><label for="${l}">${e}:</label><input type="text" name="${l}"></div>`)).join(""),a("fillInBlanks")},r=l=>{console.log("working"),l.preventDefault();const s=[];let a=!0;t.fillInBlanksFormBlanks.querySelectorAll("input").forEach((e=>{const l=e.value;s.push(l),l.length>0?e.classList.remove("formMissedRequirement"):(e.classList.add("formMissedRequirement"),a=!1)})),a?e(s):n()};window.onload=()=>{l=s(["start","waiting","fillInBlanks","results"],(e=>`${e}Screen`)),t=s(["startGameButton","errorMessage","waitingMessage","fillInBlanksForm","fillInBlanksFormBlanks","finishedStory","playAgainButton"]),t.fillInBlanksForm.addEventListener("submit",r),t.startGameButton.onclick=()=>o(["Verb","Place","Thing","Test1","Test2"]),t.playAgainButton.onclick=()=>o(["Verb","Place","Thing"]),e=e=>{const l=e.map((e=>`<span class="filledInWord">${e}</span>`));var n;n=`Let's all ${l[0]} to the ${l[1]}, let's all ${l[0]} to the ${l[1]}. Let's all ${l[0]} to the ${l[1]}, to get ourselves a ${l[2]}.`,t.finishedStory.innerHTML=n,a("results")}}})();