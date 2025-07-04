// ==================================================
// 📘 Udemy AI Bookmarklet Tool — ARRANGED VERSION
// ==================================================
// This version restructures the UI so that:
// • Analysis appears in its own scrollable block.
// • “Ask Anything” textarea + Ask button are pinned at the panel’s bottom.
// • A separate Modules block lists all course sections with “Suggest Projects”
//   and “Quiz Me” buttons.
// • “Daily Question” lives at the very top of the panel from the start.
// • A floating circular Meme button (🎭) is fixed inside the bottom bar.
//   It unlocks when the user has ≥ 1 token.
// ==================================================
// 👉 Bookmarklet snippet (unchanged):
// javascript:(function(){var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/gh/Shantnu-Talokar/Mama-Developer/My1_arranged.js?t='+Date.now();document.body.appendChild(s);})();

(function () {
    if (document.getElementById('udemyAnalyzerBtn')) return;
    if (!location.hostname.includes('udemy.com')) {
        alert('⚠️ Open this on a Udemy course page.');
        return;
    }

    /*************************************************
     *  🪙 TOKEN MANAGER (unchanged)
     *************************************************/
    const TOKEN_KEY = 'udemyTokens';
    let tokenPoints = Number(localStorage.getItem(TOKEN_KEY) || 0);
    function saveTokens() { localStorage.setItem(TOKEN_KEY, tokenPoints); }
    function addTokens(delta) { tokenPoints += delta; saveTokens(); updateTokenUI(); }

    /*************************************************
     *  🔘 PRIMARY FLOATING BUTTON (📘)
     *************************************************/
    const mainBtn = document.createElement('button');
    mainBtn.id = 'udemyAnalyzerBtn';
    mainBtn.textContent = '📘';
    mainBtn.style.cssText = [
        'position:fixed','bottom:20px','right:20px',
        'background:#4CAF50','color:white','border:none',
        'border-radius:50%','width:60px','height:60px',
        'font-size:28px','font-weight:bold','cursor:move',
        'z-index:9999','box-shadow:0 4px 10px rgba(0,0,0,.3)'
    ].join(';');

    /*************************************************
     *  📑 ANALYSIS PANEL (flex‑layout)
     *************************************************/
    const panel = document.createElement('div');
    panel.id = 'udemyAnalysisPanel';
    panel.style.cssText = [
        'display:none','position:fixed','bottom:90px','right:20px',
        'width:420px','height:620px','background:#fff','color:#000',
        'border:1px solid #ccc','border-radius:12px',
        'box-shadow:0 4px 14px rgba(0,0,0,.3)',
        'font-family:sans-serif','font-size:14px','line-height:1.45',
        'z-index:9999','display:flex','flex-direction:column','overflow:hidden'
    ].join(';');

    // ▸ close (absolute so it stays top‑right)
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✖';
    closeBtn.style.cssText = 'position:absolute;top:6px;right:8px;background:none;border:none;font-size:18px;cursor:pointer;';
    closeBtn.onclick = () => (panel.style.display = 'none');
    panel.appendChild(closeBtn);

    // ▸ HEADER BAR (Daily Question lives here)
    const headerBar = document.createElement('div');
    headerBar.style.cssText = 'padding:10px 14px 6px 14px;border-bottom:1px solid #eee;flex:0 0 auto;display:flex;align-items:center;gap:10px;';
    panel.appendChild(headerBar);

    // 🗓️ Daily Question button (present from the start)
    const dqBtn = document.createElement('button');
    dqBtn.textContent = '🗓️ Daily Question';
    dqBtn.style.cssText = 'padding:6px 14px;background:#3f51b5;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:13px;';
    headerBar.appendChild(dqBtn);

    // ▸ BODY WRAPPER (scrolls) — contains analysis + modules
    const bodyWrap = document.createElement('div');
    bodyWrap.style.cssText = 'flex:1 1 auto;overflow:auto;padding:14px;';
    panel.appendChild(bodyWrap);

    // ▸ Analysis block
    const analysisBox = document.createElement('div');
    analysisBox.id = 'analysisBox';
    bodyWrap.appendChild(analysisBox);

    // ▸ Divider
    const divider = document.createElement('hr');
    divider.style.cssText = 'margin:18px 0;border:none;border-top:1px dashed #ccc;';
    bodyWrap.appendChild(divider);

    // ▸ Modules block (populated later)
    const modulesBox = document.createElement('div');
    modulesBox.id = 'modulesBox';
    bodyWrap.appendChild(modulesBox);

    // ▸ BOTTOM BAR (Ask + Meme) fixed inside panel
    const bottomBar = document.createElement('div');
    bottomBar.style.cssText = 'flex:0 0 auto;padding:10px 14px;border-top:1px solid #eee;display:flex;align-items:center;gap:8px;';

    const askInput = document.createElement('textarea');
    askInput.placeholder = 'Ask anything…';
    askInput.style.cssText = 'flex:1;min-height:60px;max-height:120px;padding:6px;border:1px solid #ccc;border-radius:6px;resize:vertical;';

    const askBtn = document.createElement('button');
    askBtn.textContent = 'Ask';
    askBtn.style.cssText = 'padding:8px 16px;background:#007BFF;color:#fff;border:none;border-radius:6px;cursor:pointer;';

    // 🎭 Meme button (circular, disabled if no tokens)
    const memeBtn = document.createElement('button');
    memeBtn.id = 'udemyMemeBtn';
    memeBtn.textContent = '🎭';
    memeBtn.title = 'Generate Meme';
    memeBtn.style.cssText = [
        'width:46px','height:46px','border-radius:50%',
        'background:#ff5722','color:#fff','border:none',
        'font-size:20px','cursor:pointer'
    ].join(';');

    bottomBar.append(askInput, askBtn, memeBtn);
    panel.appendChild(bottomBar);

    document.body.appendChild(panel);

    //  ↳ token badge (attached to mainBtn) & token UI
    function updateTokenUI() {
        if (!window.tokenBadge) {
            window.tokenBadge = document.createElement('span');
            window.tokenBadge.style.cssText = 'display:inline-block;margin-left:6px;padding:0 8px;background:#ffd54f;color:#000;border-radius:14px;font-size:12px;font-weight:bold;vertical-align:middle;';
            mainBtn.appendChild(window.tokenBadge);
        }
        window.tokenBadge.textContent = `💰 ${tokenPoints}`;
        memeBtn.disabled = tokenPoints <= 0;
        memeBtn.style.opacity = memeBtn.disabled ? 0.5 : 1;
    }
    updateTokenUI();
    setTimeout(updateTokenUI, 0);

    /*************************************************
     *  📦  DRAG‑MOVE behaviour for 📘 button & panel
     *************************************************/
    let moved = false;
    mainBtn.onmousedown = e => {
        moved = false;
        e.preventDefault();
        const sx = e.clientX - mainBtn.getBoundingClientRect().left;
        const sy = e.clientY - mainBtn.getBoundingClientRect().top;
        const moveHandler = e => {
            moved = true;
            mainBtn.style.left = e.pageX - sx + 'px';
            mainBtn.style.top = e.pageY - sy + 'px';
            mainBtn.style.bottom = 'auto';
            mainBtn.style.right = 'auto';
            panel.style.left = parseInt(mainBtn.style.left) + 'px';
            panel.style.top = parseInt(mainBtn.style.top) - 650 + 'px';
        };
        document.addEventListener('mousemove', moveHandler);
        mainBtn.onmouseup = () => {
            document.removeEventListener('mousemove', moveHandler);
            mainBtn.onmouseup = null;
        };
    };
    mainBtn.ondragstart = () => false;

    /*************************************************
     *  🛠️ COHERE HELPER
     *************************************************/
    const apiKey = 'zXH8KUSA3ncfZcxvIAZx5boAlGlTirN6LJmp706Q';
    const endpoint = 'https://api.cohere.ai/v1/generate';
    const cohereQuery = async (prompt, max = 400, temp = 0.7) => {
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: 'command-r-plus', prompt, max_tokens: max, temperature: temp })
        });
        const data = await res.json();
        return data.generations?.[0]?.text || '⚠️ No response';
    };

    /*************************************************
     *  🔄 MAIN BUTTON CLICK HANDLER
     *************************************************/
    mainBtn.onclick = async () => {
        if (moved) return (moved = false);

        // show panel loader
        panel.style.display = 'flex';
        analysisBox.innerHTML = '<b>⏳ Analyzing course…</b>';
        modulesBox.innerHTML = '';

        // gather course info
        const url = location.href;
        const title = document.querySelector('h1')?.innerText || 'Untitled Course';

        try {
            /***** 1️⃣ Course Analysis *****/
            const analysisPrompt = `You are an educational analyst. Analyze this Udemy course:\nTitle:${title}\nURL:${url}\n\nProvide:\n1. Modules Covered\n2. Disadvantages\n3. Detailed Learning Outcomes`;
            const analysis = await cohereQuery(analysisPrompt, 500);
            analysisBox.innerHTML = '<b>📘 Course Analysis:</b><br><br>' + analysis.replace(/\n/g, '<br>');

            /***** 2️⃣ Modules List *****/
            const mods = [...document.querySelectorAll('div[data-purpose="curriculum-section-container"] h3')];
            if (!mods.length) {
                modulesBox.innerHTML = '<b>📂 Modules</b><br><br>❌ Could not detect modules.';
            } else {
                modulesBox.innerHTML = '<b>📂 Modules</b><br><br>';

                // checklist for each module
                mods.forEach((m, i) => {
                    const key = 'udemyMod-' + i;
                    const wrap = document.createElement('label');
                    wrap.style.cssText = 'display:block;margin:4px 0;cursor:pointer;';
                    const chk = document.createElement('input');
                    chk.type = 'checkbox';
                    chk.checked = localStorage.getItem(key) === '1';
                    chk.onchange = () => localStorage.setItem(key, chk.checked ? '1' : '0');
                    wrap.append(chk, ' ', m.innerText.trim());
                    modulesBox.appendChild(wrap);
                });

                // action buttons
                const btnRow = document.createElement('div');
                btnRow.style.cssText = 'margin-top:10px;display:flex;gap:10px;flex-wrap:wrap;';
                modulesBox.appendChild(btnRow);

                const projBtn = document.createElement('button');
                projBtn.textContent = '🎯 Suggest Projects';
                projBtn.style.cssText = 'padding:6px 12px;background:#28a745;color:#fff;border:none;border-radius:6px;cursor:pointer;';
                btnRow.appendChild(projBtn);

                const quizBtn = document.createElement('button');
                quizBtn.textContent = '📝 Quiz Me';
                quizBtn.style.cssText = 'padding:6px 12px;background:#ffc107;color:#000;border:none;border-radius:6px;cursor:pointer;';
                btnRow.appendChild(quizBtn);

                /* --- Project Suggestions --- */
                const ideasDiv = document.createElement('div');
                ideasDiv.style.cssText = 'margin-top:12px;white-space:pre-wrap;';
                modulesBox.appendChild(ideasDiv);

                projBtn.onclick = async () => {
                    const selected = mods.filter((_, i) => localStorage.getItem('udemyMod-'+i) === '1').map(m=>m.innerText.trim());
                    if (!selected.length) return alert('Select modules first.');
                    ideasDiv.innerHTML = '<b>⏳ Fetching ideas…</b>';
                    const txt = await cohereQuery(`I completed these modules:\n\n${selected.join('\n')}\n\nSuggest three hands‑on project ideas.`, 350);
                    ideasDiv.innerHTML = '<b>🚀 Project Ideas:</b><br>' + txt.replace(/\n/g,'<br>');
                };

                /* --- Quiz Me --- */
                const overlay = (()=>{
                    let o = document.getElementById('udemyQuizOverlay');
                    if (!o) {
                        o = document.createElement('div');
                        o.id = 'udemyQuizOverlay';
                        o.style.cssText = 'display:none;position:fixed;top:10%;left:10%;width:80%;height:80%;background:#fffbd6;border:6px solid #ff9800;border-radius:20px;z-index:10000;padding:25px;overflow:auto;box-shadow:0 8px 25px rgba(0,0,0,.4);font-family:sans-serif;';
                        document.body.appendChild(o);
                    }
                    return o;
                })();

                quizBtn.onclick = async ()=>{
                    const chosen = mods.filter((_,i)=>localStorage.getItem('udemyMod-'+i)==='1').map(m=>m.innerText.trim());
                    if (!chosen.length) return alert('Select modules first.');
                    overlay.style.display='block';
                    overlay.innerHTML='<h2>📝 Generating quiz…</h2>';

                    const qPrompt = `You are an advanced technical course quiz generator.\nGenerate EXACTLY 5 high-quality multiple‑choice questions (MCQs) based strictly on the technical content from these modules:\n${chosen.join('\n')}\n\nGuidelines:\n1. 2 easy, 2 medium, 1 hard.\n2. Only include content present in modules.\n3. Four options (A–D); exactly one correct, wrapped in <span class="answer"></span>.\n4. Format: Q1. <question> ... as previously.`;
                    try {
                        const txt = await cohereQuery(qPrompt, 650);
                        overlay.style.display = 'block';
                        overlay.innerHTML =
                            '<button id="closeQuiz" style="position:absolute;top:15px;right:20px;font-size:20px;' +
                            'background:#f44336;color:white;border:none;border-radius:4px;padding:4px 12px;cursor:pointer;">✖</button>' +
                            '<h2 style="text-align:center;margin:10px 0 20px">📝 Module Quiz</h2>' +
                            '<form id="quizForm" style="font-size:16px;line-height:1.6"></form>' +
                            '<button id="submitQuiz" style="margin-top:25px;display:block;background:#4caf50;color:white;' +
                            'border:none;padding:10px 20px;border-radius:6px;cursor:pointer;margin-left:auto;margin-right:auto;">Show Answers</button>' +
                            '<div id="scoreBox" style="text-align:center;font-size:18px;margin-top:15px;font-weight:bold;"></div>';

                        document.getElementById('closeQuiz').onclick = () => (overlay.style.display = 'none');
                        const form = overlay.querySelector('#quizForm');
                        const blocks = txt.match(/(?:Q?\d+[.)])[\s\S]*?(?=(?:Q?\d+[.)])|$)/g) || [];

                        const correctMap = [];
                        blocks.forEach((blk, qi) => {
                            const lines = blk.trim().split('\n').filter(Boolean);
                            const qLine = lines.shift();
                            const qDiv = document.createElement('div');
                            qDiv.style.marginBottom = '20px';
                            qDiv.innerHTML = `<b>${qLine.replace(/^Q?\d+[.)]\s*/, '')}</b><br><br>`;
                            const options = lines.slice(0, 4).map((line, oi) => {
                                const isCorrect = /class=["']answer["']/.test(line);
                                const text = line.replace(/<span class=["']answer["']>/, '').replace('</span>', '').replace(/^[A-Da-d][).]\s*/, '').trim();
                                return { text, isCorrect };
                            });
                            for (let i = options.length - 1; i > 0; i--) {
                                const j = Math.floor(Math.random() * (i + 1));
                                [options[i], options[j]] = [options[j], options[i]];
                            }
                            options.forEach((opt, oi) => {
                                const id = `q${qi}o${oi}`;
                                const radio = document.createElement('input');
                                radio.type = 'radio';
                                radio.name = `q${qi}`;
                                radio.id = id;
                                radio.setAttribute('data-correct', opt.isCorrect);
                                const label = document.createElement('label');
                                label.htmlFor = id;
                                label.style.cssText = 'display:block;margin:6px 0;padding:6px 10px;border-radius:5px;cursor:pointer;border:1px solid #ccc;';
                                label.appendChild(radio);
                                label.appendChild(document.createTextNode(' ' + opt.text));
                                qDiv.appendChild(label);
                                if (opt.isCorrect) correctMap[qi] = label;
                            });
                            form.appendChild(qDiv);
                        });

                        overlay.querySelector('#submitQuiz').onclick = () => {
                            let right = 0;
                            correctMap.forEach((correctLabel, qi) => {
                                const chosen = form.querySelector(`input[name="q${qi}"]:checked`);
                                if (chosen) {
                                    const chosenLabel = form.querySelector(`label[for="${chosen.id}"]`);
                                    if (chosen.getAttribute('data-correct') === 'true') {
                                        chosenLabel.style.background = '#c8e6c9';
                                        right++;
                                    } else {
                                        chosenLabel.style.background = '#ffcdd2';
                                        correctLabel.style.background = '#e0f2f1';
                                    }
                                } else {
                                    correctLabel.style.background = '#e0f2f1';
                                }
                            });
                            const pct = Math.round((right / correctMap.length) * 100);
                            addTokens(right);
                            overlay.querySelector('#scoreBox').textContent = `🎯 You scored ${right}/${correctMap.length} (${pct}%)`;
                        };
                    } catch(err){
                        overlay.innerHTML = '<p style="color:red;text-align:center">❌ Failed to generate quiz.</p>';
                    }
                };
            }
        } catch (err) {
            analysisBox.innerHTML = '<span style="color:red">❌ Error – see console.</span>';
            console.error(err);
        }
    };

    /*************************************************
     *  💬 ASK ANYTHING
     *************************************************/
    askBtn.onclick = async () => {
        const q = askInput.value.trim();
        if (!q) return;
        askBtn.disabled = true;
        analysisBox.insertAdjacentHTML('beforeend','<br><b>🔸 You:</b> '+q.replace(/\n/g,'<br>'));
        analysisBox.insertAdjacentHTML('beforeend','<br><i>⏳ …thinking</i>');
        bodyWrap.scrollTop = bodyWrap.scrollHeight;
        try {
            const ans = await cohereQuery(q);
            analysisBox.insertAdjacentHTML('beforeend','<br><b>🤖 GPT:</b> '+ans.replace(/\n/g,'<br>'));
        } finally {
            askBtn.disabled = false;
            askInput.value='';
            bodyWrap.scrollTop = bodyWrap.scrollHeight;
        }
    };

    /*************************************************
     *  🎭 MEME GENERATOR BUTTON (uses Imgflip)
     *************************************************/
    const templates = ["181913649","112126428","87743020","124822590","129242436","438680","217743513","131087935","61579","4087833","93895088","102156234","97984","1035805","188390779","91538330","101470","247375501","131940431","89370399"];
    const randomTemplate = () => templates[Math.floor(Math.random()*templates.length)];

    memeBtn.onclick = async () => {
        if (tokenPoints <= 0) return alert('❌ Not enough meme tokens!');
        memeBtn.disabled = true;
        memeBtn.textContent = '…';
        try {
            const topic = document.querySelector('h1')?.innerText.trim() || 'coding';
            const prompt = `You are a meme caption writer. Make a funny meme about: "${topic}".\nFormat:\nTop: <text>\nBottom: <text>`;
            const {generations:[{text}]} = await (await fetch(endpoint,{method:'POST',headers:{'Authorization':`Bearer ${apiKey}`,'Content-Type':'application/json'},body:JSON.stringify({model:'command',prompt,max_tokens:50,temperature:0.9})})).json();
            const lines = text.split('\n');
            const top = lines.find(l=>l.startsWith('Top:'))?.replace('Top:','').trim() || 'Debugging for hours';
            const bottom = lines.find(l=>l.startsWith('Bottom:'))?.replace('Bottom:','').trim() || 'Then it was a semicolon 😭';

            const form = new URLSearchParams({template_id:randomTemplate(),username:'SHANTNUTALOKAR',password:'Sahil@9043',text0:top,text1:bottom});
            const imgRes = await (await fetch('https://api.imgflip.com/caption_image',{method:'POST',body:form})).json();
            if(!imgRes.success) return alert('❌ Imgflip error: '+imgRes.error_message);

            const pop = document.createElement('div');
            pop.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:10002;background:#fff;border:2px solid #000;border-radius:10px;padding:12px;box-shadow:2px 2px 10px rgba(0,0,0,.35);max-width:280px;text-align:center;font-family:sans-serif;';
            pop.innerHTML = `<strong>🎉 Meme Unlocked!</strong><br><img src="${imgRes.data.url}" style="max-width:100%;border-radius:6px;margin-top:10px"/><br><button style="margin-top:8px;padding:4px 10px;border:none;background:#f44336;color:#fff;border-radius:4px;cursor:pointer;">Close</button>`;
            pop.querySelector('button').onclick = ()=>pop.remove();
            document.body.appendChild(pop);
            addTokens(-1);
        } catch(err){
            alert('❌ Meme error – see console.');
            console.error(err);
        } finally {
            memeBtn.textContent = '🎭';
            memeBtn.disabled = false;
        }
    };

    /*************************************************
     *  🗓️ DAILY QUESTION HANDLER (logic reused)
     *************************************************/
    dqBtn.onclick = async () => {
                const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
                const qKey = 'dailyQ-data';
                const dKey = 'dailyQ-date';
                const aKey = 'dailyQ-done';

                // ✅ Disable btn if already done
                if (localStorage.getItem(aKey) === today) {
                    dqBtn.disabled = true;
                    dqBtn.style.background = '#ccc';
                    dqBtn.textContent = '✅ Attempted';
                    return;
                }

                // helper to render the stored or freshly fetched question
                const renderQuestion = (qBlock) => {
                    // build overlay (1-per-session)
                    let dqOver = document.getElementById('dailyQOverlay');
                    if (!dqOver) {
                        dqOver = document.createElement('div');
                        dqOver.id = 'dailyQOverlay';
                        dqOver.style.cssText =
                            'display:flex;flex-direction:column;align-items:center;position:fixed;top:10%;left:50%;' +
                            'transform:translateX(-50%);width:500px;max-width:90%;padding:22px;background:#fff;' +
                            'border:5px solid #3f51b5;border-radius:14px;z-index:10000;box-shadow:0 10px 25px rgba(0,0,0,.35);' +
                            'font-family:sans-serif;';
                        dqOver.innerHTML = `
                <button style="position:absolute;top:8px;right:12px;font-size:16px;border:none;background:#f44336;
                        color:white;padding:4px 10px;border-radius:4px;cursor:pointer;"
                        onclick="this.parentElement.remove()">✖</button>
                <h3 style="margin-bottom:12px">🗓️ Daily Aptitude Question</h3>
                <div id="dqTimer" style="font-size:15px;font-weight:bold;margin-bottom:10px;"></div>
                <form id="dqForm" style="width:100%;font-size:15px;line-height:1.6;"></form>
                <button id="dqSubmit" style="margin-top:15px;padding:8px 16px;background:#4caf50;color:white;
                        border:none;border-radius:5px;cursor:pointer;">Submit</button>
                <div id="dqResult" style="margin-top:14px;font-weight:bold;text-align:center;"></div>
            `;
                        document.body.appendChild(dqOver);
                    }

                    // fill form
                    const form = dqOver.querySelector('#dqForm');
                    form.innerHTML = '';
                    const { question, options } = qBlock;
                    const correctIdx = options.findIndex(o => o.isCorrect);

                    const qEl = document.createElement('div');
                    qEl.style.fontWeight = 'bold';
                    qEl.textContent = question;
                    form.appendChild(qEl);

                    options.forEach((opt, i) => {
                        const id = `dqo${i}`;
                        const wrap = document.createElement('label');
                        wrap.style.cssText =
                            'display:block;margin:6px 0;padding:6px 9px;border-radius:5px;border:1px solid #ccc;cursor:pointer;';
                        wrap.innerHTML = `<input type="radio" name="dq" id="${id}" value="${i}" style="margin-right:6px;"> ${opt.text}`;
                        form.appendChild(wrap);
                    });

                    let timeLeft = 120;
                    const timerBox = dqOver.querySelector('#dqTimer');
                    timerBox.textContent = `⏳ Time left: 2:00`;
                    const tick = setInterval(() => {
                        --timeLeft;
                        const min = Math.floor(timeLeft / 60).toString();
                        const sec = (timeLeft % 60).toString().padStart(2, '0');
                        timerBox.textContent = `⏳ Time left: ${min}:${sec}`;
                        if (timeLeft <= 0) {
                            clearInterval(tick);
                            dqOver.querySelector('#dqSubmit').click();
                        }
                    }, 1000);

                    dqOver.querySelector('#dqSubmit').onclick = () => {
                        clearInterval(tick);
                        const chosen = form.querySelector('input[name="dq"]:checked');
                        const resBox = dqOver.querySelector('#dqResult');
                        if (!chosen) {
                            resBox.textContent = '❗ No option selected!';
                            return;
                        }
                        const idx = Number(chosen.value);
                        if (idx === correctIdx) {
                            resBox.textContent = '✅ Correct!';
                            resBox.style.color = '#2e7d32';
                            addTokens(10); // ✅ reward tokens
                        } else {
                            resBox.textContent = `❌ Wrong. Correct answer: ${options[correctIdx].text}`;
                            resBox.style.color = '#c62828';
                        }
                        dqOver.querySelectorAll('input').forEach(inp => inp.disabled = true);
                        dqOver.querySelector('#dqSubmit').disabled = true;

                        // ✅ Mark as attempted
                        localStorage.setItem(aKey, today);
                        dqBtn.disabled = true;
                        dqBtn.style.background = '#ccc';
                        dqBtn.textContent = '✅ Attempted';
                    };
                };

                if (localStorage.getItem(dKey) === today) {
                    const stored = JSON.parse(localStorage.getItem(qKey) || '{}');
                    return renderQuestion(stored);
                }

                try {
                    dqBtn.textContent = '⏳ Creating…';
                    dqBtn.disabled = true;

                    const prompt = `
Generate EXACTLY one aptitude multiple-choice question in the domain of logical reasoning or quantitative aptitude.

• Return in this format (no extra commentary):
Q) <question text>
A) <option1>
B) <option2>
C) <option3>
D) <option4>
Answer: <capital letter of correct option>

Use real aptitude style, medium difficulty.
        `.trim();

                    const raw = await cohereQuery(prompt, 180);
                    dqBtn.textContent = '🗓️ Daily Question';
                    dqBtn.disabled = false;

                    const qMatch = raw.match(/^Q\)?\s*(.*)$/im);
                    const oMatch = raw.match(/^[A-D]\).*/gim);
                    const aMatch = raw.match(/Answer:\s*([A-D])/i);
                    if (!qMatch || !oMatch || oMatch.length !== 4 || !aMatch) {
                        return alert('⚠️ Could not parse question from Cohere.');
                    }

                    const qBlock = {
                        question: qMatch[1].trim(),
                        options: oMatch.map((l, i) => ({
                            text: l.replace(/^[A-D]\)\s*/, '').trim(),
                            isCorrect: 'ABCD'[i] === aMatch[1].toUpperCase()
                        }))
                    };

                    localStorage.setItem(qKey, JSON.stringify(qBlock));
                    localStorage.setItem(dKey, today);

                    renderQuestion(qBlock);
                } catch (err) {
                    dqBtn.textContent = '🗓️ Daily Question';
                    dqBtn.disabled = false;
                    console.error(err);
                    alert('❌ Error generating daily question – see console.');
                }
            };

    /*************************************************
     *  Attach primary button to page
     *************************************************/
    document.body.appendChild(mainBtn);

})();
