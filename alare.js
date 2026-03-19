
    let currentPopupTitle = null
    let currentPopupId = null
    let longPressTimer = null
    let currentBtnIndex = null
    const libraryNav = document.getElementById("libraryNav")
    const addBtn = document.querySelector("#asideTop .neoBtn")

    let folders = JSON.parse(localStorage.getItem("outlineFolders") || "[]")

    
    // 기존 문자열 데이터 대응
        if (folders.length && typeof folders[0] === "string") {
            folders = folders.map(name => ({
                name,
                buttons: []
            }))
        }

    /* ---------- 저장 ---------- */
    function save() {
        localStorage.setItem("outlineFolders", JSON.stringify(folders))
    }

    /* ---------- 화면 렌더 ---------- */
    function render() {

        libraryNav.innerHTML = ""

        folders.forEach((folder, index) => {

            const wrap = document.createElement("div")
            wrap.className = "folderItem"

            wrap.innerHTML = `
            <button class="folderMini up">▲</button>
            <button class="folderMain">${folder.name}</button>
            <button class="folderMini edit">✎</button>
            <button class="folderMini down">▼</button>
        `

            /* ▲ */
            wrap.querySelector(".up").onclick = () => {
                if (index === 0) return
                    ;[folders[index - 1], folders[index]] = [folders[index], folders[index - 1]]
                save()
                render()
            }

            /* ▼ */
            wrap.querySelector(".down").onclick = () => {
                if (index === folders.length - 1) return
                    ;[folders[index + 1], folders[index]] = [folders[index], folders[index + 1]]
                save()
                render()
            }

            /* ✎ */
            wrap.querySelector(".edit").onclick = () => {

                const newName = prompt("폴더명 수정", folders[index].name)
                if (!newName) return

                folders[index].name = newName
                save()
                render()
            }

            libraryNav.appendChild(wrap)


            const mainBtn = wrap.querySelector(".folderMain")

            mainBtn.onclick = () => {

                /* 이미 열린 팝업이면 → 전부 닫고 종료 */
                if (currentPopupId === index) {
                    document.querySelectorAll("#mainArea .popup").forEach(p => {
                        p.classList.remove("show")
                    })
                    currentPopupId = null
                    document.getElementById("asideBottom").style.display = "none"
                    return
                }

                /* 모든 팝업 닫기 */
                document.querySelectorAll("#mainArea .popup").forEach(p => {
                    p.classList.remove("show")
                })

                /* 팝업 찾기 */
                let pop = document.querySelector(`#mainArea .popup[data-id="${index}"]`)

                if (!pop) {
                    pop = document.createElement("div")
                    pop.className = "popup"
                    pop.dataset.id = index
                    document.getElementById("mainArea").appendChild(pop)
                }

                pop.classList.add("show")

                currentPopupId = index

                renderButtons(index)

                /* asideBottom 표시 */
                document.getElementById("asideBottom").style.display = "flex"
                document.getElementById("currentPopupName").textContent = folders[index].name
                document.getElementById("bottomBtns").classList.remove("hide")
            }
        })

    }

    /* ---------- + 생성 ---------- */
    addBtn.onclick = () => {
        folders.push({
            name: "새폴더",
            buttons: []
        })
        save()
        render()
    }

    /* ---------- 최초 실행 ---------- */
    render()
    const saveBtn = document.querySelectorAll("#asideTop .neoBtn")[1]
    const settingBtn = document.querySelectorAll("#asideTop .neoBtn")[2]

    saveBtn.onclick = () => {

            if (currentPopupId === "save") {
                document.querySelectorAll("#mainArea .popup").forEach(p => {
                    p.classList.remove("show")
                })
                currentPopupId = null
                document.getElementById("asideBottom").style.display = "none"
                document.getElementById("bottomBtns").classList.remove("hide")
                return
            }

            document.querySelectorAll("#mainArea .popup").forEach(p => {
                p.classList.remove("show")
            })

            let pop = document.querySelector(`#mainArea .popup[data-id="save"]`)

            if (!pop) {
                pop = document.createElement("div")
                pop.className = "popup"
                pop.dataset.id = "save"
                pop.style.background = `
linear-gradient(
135deg,
rgba(95,70,15,0.95) 0%,
rgba(140,105,25,0.75) 20%,
rgba(206, 172, 59, 0.98) 50%,
rgba(150,115,30,0.95) 65%,
rgba(216,160,17,0.8) 100%
)`
                pop.style.backdropFilter = "blur(10px)"
                pop.innerHTML = `
        <div class="settingWrap">

<button class="settingBtn" id="exportBtn">
    저장하기
</button>

<button class="settingBtn" id="importBtn">
    불러오기
</button>

        </div>
        `

                document.getElementById("mainArea").appendChild(pop)

                pop.querySelector("#exportBtn").onclick = exportData
                pop.querySelector("#importBtn").onclick = openImport

            }

            pop.classList.add("show")

            currentPopupId = "save"

            document.getElementById("asideBottom").style.display = "flex"
            document.getElementById("currentPopupName").textContent = "저장"
            document.getElementById("bottomBtns").classList.add("hide")
        }
        
    settingBtn.onclick = () => {

        if (currentPopupId === "setting") {
            document.querySelectorAll("#mainArea .popup").forEach(p => {
                p.classList.remove("show")
            })
            currentPopupId = null
            document.getElementById("asideBottom").style.display = "none"
            document.getElementById("bottomBtns").classList.remove("hide")
            return
        }

        document.querySelectorAll("#mainArea .popup").forEach(p => {
            p.classList.remove("show")
        })

        let pop = document.querySelector(`#mainArea .popup[data-id="setting"]`)

        if (!pop) {
            pop = document.createElement("div")
            pop.className = "popup"
            pop.dataset.id = "setting"
            pop.style.background = `
linear-gradient(
135deg,
rgba(15,15,15,1) 0%,
rgba(40,40,40,1) 30%,
rgba(70,70,70,1) 48%,
rgba(20,20,20,1) 52%,
rgba(90,90,90,1) 70%,
rgba(10,10,10,1) 100%
)`
            pop.style.backdropFilter = "blur(10px)"
            pop.innerHTML = `
        <div class="settingWrap">

            <button class="settingBtn" id="resetAllBtn">
                전체 초기화
            </button>

            <button class="settingBtn" id="storageInfoBtn">
                로컬스토리지<br>잔량 확인
            </button>

            <button class="settingBtn" id="uiSettingBtn">
                폰트 변경
            </button>

            <button class="settingBtn" id="uiResettingBtn">
                폰트 초기화
            </button>
        </div>
    `

            document.getElementById("mainArea").appendChild(pop)
        }

        pop.classList.add("show")

        currentPopupId = "setting"

        document.getElementById("asideBottom").style.display = "flex"
        document.getElementById("currentPopupName").textContent = "설정"
        document.getElementById("bottomBtns").classList.add("hide")
    }
    const delBtn = document.getElementById("deleteFolderBtn")
        const modal = document.getElementById("deleteModal")
        const confirmBtn = document.getElementById("confirmDelete")
        const cancelBtn = document.getElementById("cancelDelete")
        const input = document.getElementById("deleteInput")

        delBtn.onclick = () => {

            if (currentPopupId === null) return

            if (currentPopupId === "setting") return

            modal.style.display = "flex"
            history.pushState({ delmodal: true }, "");
            input.value = ""
            input.focus()

        }

        cancelBtn.onclick = () => {
            modal.style.display = "none"
        }

        confirmBtn.onclick = () => {

            if (input.value !== "삭제") return

            if (currentPopupId === "setting") {
                modal.style.display = "none"
                return
            }

            folders.splice(currentPopupId, 1)

            save()
            render()

            document.querySelectorAll("#mainArea .popup").forEach(p => {
                p.remove()
            })

            currentPopupId = null
            document.getElementById("asideBottom").style.display = "none"

            modal.style.display = "none"

        }
        /* ---------- 전체 초기화 ---------- */
            document.addEventListener("click", e => {
                if (e.target.id === "resetAllBtn") {

                    const ok = confirm(
                        "모든 데이터가 삭제됩니다.\n백업은 하셨습니까?\n정말 진행하시겠습니까?"
                    )

                    if (!ok) return

                    localStorage.clear()
                    location.reload()

                }
            })


            /* ---------- 로컬스토리지 잔량 ---------- */
            document.addEventListener("click", e => {
                if (e.target.id === "storageInfoBtn") {

                    let used = 0

                    for (let k in localStorage) {
                        if (!localStorage.hasOwnProperty(k)) continue
                        used += ((localStorage[k].length + k.length) * 2)
                    }

                    const max = 5 * 1024 * 1024   // 약 5MB 브라우저 기준
                    const percent = ((max - used) / max * 100).toFixed(1)

                    const msg =
                        `${(used / 1024).toFixed(1)}KB / ${(max / 1024 / 1024).toFixed(1)}MB\n${percent}% 남았습니다`

                    const toast = document.getElementById("toastMsg")
                    toast.innerText = msg
                    toast.classList.add("show")

                    setTimeout(() => {
                        toast.classList.remove("show")
                    }, 3000)

                }
            })


    /* =========================
       사용자 폰트 시스템 (IndexedDB 버전)
       ========================= */

        /* ---------- IndexedDB 설정 ---------- */
        const FONT_DB_NAME = "FontDB"
        const FONT_STORE = "fonts"
        const FONT_KEY = "userFont"

        /* ---------- DB 열기 ---------- */
        function openFontDB() {
            return new Promise((resolve, reject) => {
                const req = indexedDB.open(FONT_DB_NAME, 1)

                req.onupgradeneeded = () => {
                    if (!req.result.objectStoreNames.contains(FONT_STORE)) {
                        req.result.createObjectStore(FONT_STORE)
                    }
                }

                req.onsuccess = () => resolve(req.result)
                req.onerror = () => reject(req.error)
            })
        }

        /* ---------- DB 저장 ---------- */
        async function saveFontToDB(buffer, type) {
            const db = await openFontDB()

            return new Promise((resolve, reject) => {
                const tx = db.transaction(FONT_STORE, "readwrite")
                tx.objectStore(FONT_STORE).put({ buffer, type }, FONT_KEY)

                tx.oncomplete = () => resolve()
                tx.onerror = () => reject(tx.error)
            })
        }

        /* ---------- DB 불러오기 ---------- */
        async function loadFontFromDB() {
            try {
                const db = await openFontDB()

                return new Promise((resolve) => {
                    const tx = db.transaction(FONT_STORE, "readonly")
                    const req = tx.objectStore(FONT_STORE).get(FONT_KEY)

                    req.onsuccess = () => resolve(req.result || null)
                    req.onerror = () => resolve(null)
                })

            } catch {
                return null
            }
        }

        /* ---------- DB 삭제 ---------- */
        function deleteFontDB() {
            const req = indexedDB.open(FONT_DB_NAME, 1)

            req.onsuccess = e => {
                const db = e.target.result
                const tx = db.transaction(FONT_STORE, "readwrite")
                tx.objectStore(FONT_STORE).delete(FONT_KEY)
            }
        }

        /* ---------- 폰트 적용 ---------- */
        function applyUserFont(buffer, type) {

            const old = document.getElementById("userFontStyle")
            if (old) old.remove()

            const blob = new Blob([buffer], { type })
            const url = URL.createObjectURL(blob)

            const style = document.createElement("style")
            style.id = "userFontStyle"

            style.innerHTML = `
    @font-face{
        font-family:"userFont";
        src:url(${url});
    }

    body, button, input, select, textarea, div, span{
        font-family:"userFont", sans-serif !important;
    }
    `

            document.head.appendChild(style)
        }

        /* ---------- 폰트 선택 ---------- */
        document.addEventListener("click", e => {

            if (e.target.id === "uiSettingBtn") {

                const input = document.createElement("input")
                input.type = "file"
                input.accept = ".ttf,.otf"

                input.onchange = async () => {

                    const file = input.files[0]
                    if (!file) return

                    const buffer = await file.arrayBuffer()

                    // 즉시 적용
                    applyUserFont(buffer, file.type)

                    try {
                        await saveFontToDB(buffer, file.type)
                        localStorage.setItem("outlineUserFontEnabled", "1")

                        showToast("사용자 폰트 적용됨")

                    } catch (e) {
                        console.error("폰트 저장 실패", e)
                        showToast("폰트 저장 실패")
                    }
                }

                input.click()
            }

        })

        /* ---------- 폰트 초기화 ---------- */
        document.addEventListener("click", e => {

            if (e.target.id === "uiResettingBtn") {

                const ok = confirm("폰트를 초기화하시겠습니까?")
                if (!ok) return

                localStorage.removeItem("outlineUserFontEnabled")
                deleteFontDB()

                const style = document.getElementById("userFontStyle")
                if (style) style.remove()

                showToast("폰트 초기화 완료")
            }

        })

        /* ---------- 시작 시 복원 ---------- */
        window.addEventListener("load", async () => {

            if (localStorage.getItem("outlineUserFontEnabled") !== "1") return

            const saved = await loadFontFromDB()
            if (!saved) return

            applyUserFont(saved.buffer, saved.type)

        })

        /* ---------- 토스트 ---------- */
        function showToast(msg) {
            const toast = document.getElementById("toastMsg")
            toast.innerText = msg
            toast.classList.add("show")

            setTimeout(() => {
                toast.classList.remove("show")
            }, 3000)
        }

    const addNoteBtn = document.getElementById("addNoteBtn")

    addNoteBtn.onclick = () => {

        if (currentPopupId === null) return
        if (typeof currentPopupId !== "number") return

        const folder = folders[currentPopupId]

        folder.buttons.push({
            text: "새 버튼"
            
        })

        save()
        renderButtons(currentPopupId)
    }

    function renderButtons(index) {

        const folder = folders[index]
        if (!folder.buttons) folder.buttons = []

        const pop = document.querySelector(`.popup[data-id="${index}"]`)
        if (!pop) return

        pop.innerHTML = `<div class="noteWrap"></div>`
        const wrap = pop.querySelector(".noteWrap")

        folder.buttons.forEach((btnData, i) => {

            const btn = document.createElement("button")
            btn.className = "settingBtn"
            btn.textContent = btnData.text

           let startY = 0
            let startX = 0
            let isMove = false
            let isLongPress = false
            let timer = null

            const MOVE_LIMIT = 12   // ← 스크롤 판정 거리 (px)

            const startPress = (e) => {

                isMove = false
                isLongPress = false

                const t = e.touches ? e.touches[0] : e
                startY = t.clientY
                startX = t.clientX

                timer = setTimeout(() => {
                    if (isMove) return
                    isLongPress = true
                    currentBtnIndex = i
                    openBtnModal()
                    history.pushState({ btnmodal: true }, "")
                }, 400)
            }

            const movePress = (e) => {

                const t = e.touches ? e.touches[0] : e

                const dy = Math.abs(t.clientY - startY)
                const dx = Math.abs(t.clientX - startX)

                if (dy > MOVE_LIMIT || dx > MOVE_LIMIT) {
                    isMove = true
                    clearTimeout(timer)
                }
            }

            const endPress = () => {

                clearTimeout(timer)

                if (isMove) return       // ⭐ 스크롤이면 아무것도 안함
                if (isLongPress) return  // ⭐ 롱프레스면 숏클릭 금지

                openScreen(btnData, i)
            }

            /* 이벤트 */
            btn.addEventListener("touchstart", startPress)
            btn.addEventListener("touchmove", movePress)
            btn.addEventListener("touchend", endPress)
            btn.addEventListener("touchcancel", () => {
                clearTimeout(timer)
                isMove = true
            })
            btn.addEventListener("mousedown", startPress)
            btn.addEventListener("mousemove", movePress)
            btn.addEventListener("mouseup", endPress)

            wrap.appendChild(btn)
        })
    }
        
    function openBtnModal() {
            document.getElementById("modalOverlay").style.display = "block"

        document.getElementById("btnEditModal").style.display = "flex"
    }

            const btnUp = document.getElementById("btnUp")
                const btnDown = document.getElementById("btnDown")
                const btnRename = document.getElementById("btnRename")
                const btnDelete = document.getElementById("btnDelete")
                const btnEditModal  = document.getElementById("btnEditModal")

    function closeModal() {
        document.getElementById("btnEditModal").style.display = "none"
        document.getElementById("modalOverlay").style.display = "none"
    }

    // document.getElementById("modalOverlay").onclick = () => {
    //         closeModal()
    //     }
                btnUp.onclick = () => {

                        const folder = folders[currentPopupId]

                        if (currentBtnIndex === 0) return

                            ;[folder.buttons[currentBtnIndex - 1], folder.buttons[currentBtnIndex]] =
                                [folder.buttons[currentBtnIndex], folder.buttons[currentBtnIndex - 1]]

                        currentBtnIndex--

                        save()
                        renderButtons(currentPopupId)
                    }

                    btnDown.onclick = () => {

                            const folder = folders[currentPopupId]

                            if (currentBtnIndex === folder.buttons.length - 1) return

                                ;[folder.buttons[currentBtnIndex + 1], folder.buttons[currentBtnIndex]] =
                                    [folder.buttons[currentBtnIndex], folder.buttons[currentBtnIndex + 1]]

                            currentBtnIndex++

                            save()
                            renderButtons(currentPopupId)
                        }

                        btnRename.onclick = () => {

                                const folder = folders[currentPopupId]

                                const newName = prompt("이름 변경", folder.buttons[currentBtnIndex].text)
                                if (!newName) return

                                folder.buttons[currentBtnIndex].text = newName

                                save()
                                renderButtons(currentPopupId)
                            }


    btnDelete.onclick = () => {

        const folder = folders[currentPopupId]

        folder.buttons.splice(currentBtnIndex, 1)

        save()
        renderButtons(currentPopupId)

        closeModal()
    }

    const btnClose = document.getElementById("btnClose")

    btnClose.onclick = () => {
        closeModal()
    }

function openScreen(btnData, index) {

    currentBtnIndex = index

    const screen = document.getElementById("noteScreen")
    const title = document.getElementById("screenTitle")

    title.textContent = btnData.text

    // ⭐ 여기 핵심
    if (!btnData.lines) btnData.lines = []
    lines = btnData.lines

    renderLines()
    updateFilterBtnUI() 

    screen.style.display = "block"
    history.pushState({ screen: true }, "")
}

    document.getElementById("closeScreen").onclick = () => {
        document.getElementById("noteScreen").style.display = "none"
    }

    (function () {

        let backTimer = 0;

        function push() {
            history.pushState({ app: true }, "");
        }

        // 최초 1회
        history.replaceState({ root: true }, "");
        push();

        window.addEventListener("popstate", function () {

            // 1️⃣ 노트 전체화면
            const screen = document.getElementById("noteScreen");
            if (screen.style.display === "block") {
                screen.style.display = "none";
                push();
                return;
            }

            // 2️⃣ 버튼 편집 모달
            const btnModal = document.getElementById("btnEditModal");
            if (btnModal.style.display === "flex") {
                closeModal();
                push();
                return;
            }

            // 3️⃣ 삭제 모달
            const del = document.getElementById("deleteModal");
            if (del.style.display === "flex") {
                del.style.display = "none";
                push();
                return;
            }

            // 4️⃣ popup 화면
            const openPopup = document.querySelector("#mainArea .popup.show");
            if (openPopup) {
                openPopup.classList.remove("show");
                currentPopupId = null;
                document.getElementById("asideBottom").style.display = "none";
                push();
                return;
            }

            // ⭐⭐⭐ 마지막 루트 상태 ⭐⭐⭐
            let now = Date.now();

            if (now - backTimer < 2000) {
                // 👉 여기서는 아무것도 안함
                // → 브라우저 종료됨
                return;
            }

            backTimer = now;

            showToast("뒤로가기를 한 번 더 누르면 종료됩니다");

            // 👉 토스트 1회 때만 스택 복구
            push();

        });

    })();



let lines = []
let viewFilter = {
    h1: true,
    h2: true,
    h3: true,
    h4: true
}

const filterModes = [
    { h1: true, h2: true, h3: true, h4: true },
    { h1: true, h2: false, h3: false, h4: false },
    { h1: true, h2: true, h3: false, h4: false },
    { h1: true, h2: true, h3: true, h4: false }
]

let filterIndex = 0

const savedFilter = localStorage.getItem("viewFilter")
if (savedFilter) {
    viewFilter = JSON.parse(savedFilter)

    filterIndex = filterModes.findIndex(f =>
        JSON.stringify(f) === JSON.stringify(viewFilter)
    )

    if (filterIndex === -1) filterIndex = 0
}
document.getElementById("addLineBtn").onclick = () => {
    lines.push({ text: "", level: 0, collapsed: false })
    save()
    renderLines()
}

function renderLines() {

    let needSave = false

    lines.forEach(line => {
        if (line.collapsed === undefined) {
            line.collapsed = false
            needSave = true
        }
    })

    if (needSave) save()

    const body = document.getElementById("screenBody")
    body.innerHTML = ""

    lines.forEach((line, index) => {

        const wrap = document.createElement("div")

wrap.innerHTML = `
<div class="lineControls" style="display:flex; gap:6px; margin-bottom:6px;">
    <button class="miniBtn toggle">▾</button>
    <button class="miniBtn left">←</button>
    <button class="miniBtn right">→</button>
    <button class="miniBtn del">X</button>
</div>

<div class="lineInput" contenteditable="true"
style="padding-left:${line.level * 20}px"></div>
`

        const el = wrap.querySelector(".lineInput")

        el.innerText = line.text

        if (el.innerText.trim() !== "") {
            el.classList.add("hasText")
        }

        el.oninput = () => {
            line.text = el.innerText

            if (el.innerText.trim() !== "") {
                el.classList.add("hasText")
            } else {
                el.classList.remove("hasText")
            }

            save()
        }

        el.classList.remove("h1", "h2", "h3", "h4")

        if (line.level === 0) el.classList.add("h1")
        if (line.level === 1) el.classList.add("h2")
        if (line.level === 2) el.classList.add("h3")
        if (line.level >= 3) el.classList.add("h4")

        const toggleBtn = wrap.querySelector(".toggle")

        toggleBtn.innerText = line.collapsed ? "▸" : "▾"

        toggleBtn.onclick = () => {
            line.collapsed = !line.collapsed
            save()
            renderLines()
        }

        /* → */
        wrap.querySelector(".right").onclick = () => {
            line.level++
            el.style.paddingLeft = (line.level * 20) + "px"

            el.classList.remove("h1", "h2", "h3", "h4")
            if (line.level === 0) el.classList.add("h1")
            if (line.level === 1) el.classList.add("h2")
            if (line.level === 2) el.classList.add("h3")
            if (line.level >= 3) el.classList.add("h4")

            save()
        }

        /* ← */
        wrap.querySelector(".left").onclick = () => {
            line.level = Math.max(0, line.level - 1)
            el.style.paddingLeft = (line.level * 20) + "px"

            el.classList.remove("h1", "h2", "h3", "h4")
            if (line.level === 0) el.classList.add("h1")
            if (line.level === 1) el.classList.add("h2")
            if (line.level === 2) el.classList.add("h3")
            if (line.level >= 3) el.classList.add("h4")

            save()
        }

        /* 삭제 */
        wrap.querySelector(".del").onclick = () => {
            lines.splice(index, 1)
            save()
            renderLines()
        }

        body.appendChild(wrap)

        const saved = localStorage.getItem("showLineControls")

        if (saved === "0") {
            document.querySelectorAll(".lineControls").forEach(el => {
                el.style.display = "none"
            })
            showLineControls = false
        }
    })
    applyFilter()
}
function applyFilter() {
    document.querySelectorAll("#screenBody > div").forEach((wrap, i) => {

        const line = lines[i]
        if (!line) return

        const levelClass = "h" + Math.min(line.level + 1, 4)
        const visibleByFilter = viewFilter[levelClass]

        const input = wrap.querySelector(".lineInput")
        const toggleBtn = wrap.querySelector(".toggle")
        const leftBtn = wrap.querySelector(".left")
        const rightBtn = wrap.querySelector(".right")
        const delBtn = wrap.querySelector(".del")
        const controls = wrap.querySelector(".lineControls")

        /* 1️⃣ 필터로 전체 숨김 */
        if (!visibleByFilter) {
            wrap.style.display = "none"
            return
        }

        /* 2️⃣ 기본 표시 */
        wrap.style.display = "block"

        /* 3️⃣ 접힘 상태 */
        if (line.collapsed) {

            const indent = line.level * 20

            // 데이터 숨김
            if (input) input.style.display = "none"

            // 버튼 숨김
            if (leftBtn) leftBtn.style.display = "none"
            if (rightBtn) rightBtn.style.display = "none"
            if (delBtn) delBtn.style.display = "none"

            // ⭐ 토글 버튼 들여쓰기 적용
            if (toggleBtn) {
                toggleBtn.style.display = "inline-block"
                toggleBtn.style.marginLeft = indent + "px"
            }

            if (controls) controls.style.justifyContent = "flex-start"

        } else {

            // 데이터 표시
            if (input) input.style.display = "block"

            // 버튼 표시
            if (leftBtn) leftBtn.style.display = "inline-block"
            if (rightBtn) rightBtn.style.display = "inline-block"
            if (delBtn) delBtn.style.display = "inline-block"

            // ⭐ 토글 버튼 원상복구
            if (toggleBtn) {
                toggleBtn.style.display = "inline-block"
                toggleBtn.style.marginLeft = "0px"
            }

            if (controls) controls.style.justifyContent = "flex-start"
        }
    })
}
function updateFilterBtnUI() {
    const btn = document.getElementById("filterBtn")

    if (!viewFilter.h2 && !viewFilter.h3 && !viewFilter.h4) {
        btn.innerText = "1"
    } else if (!viewFilter.h3 && !viewFilter.h4) {
        btn.innerText = "1-2"
    } else if (!viewFilter.h4) {
        btn.innerText = "1-3"
    } else {
        btn.innerText = "📊"
    }
}

let showLineControls = true

document.getElementById("eyeBtn").onclick = () => {

    showLineControls = !showLineControls

    const controls = document.querySelectorAll(".lineControls")

    controls.forEach(el => {
        el.style.display = showLineControls ? "flex" : "none"
    })

    localStorage.setItem("showLineControls", showLineControls ? "1" : "0")
}


document.getElementById("filterBtn").onclick = () => {

    filterIndex = (filterIndex + 1) % filterModes.length
    viewFilter = filterModes[filterIndex]

    localStorage.setItem("viewFilter", JSON.stringify(viewFilter))

    applyFilter()
    updateFilterBtnUI()
}

document.getElementById("mapBtn").onclick = () => {

    // 🔥 1. 필터 초기화
    viewFilter = { h1: true, h2: true, h3: true, h4: true }
    localStorage.removeItem("viewFilter")
    filterIndex = 0

    // 🔥 2. 전부 펼치기 (핵심)
    lines.forEach(line => {
        line.collapsed = false
    })

    save()

    // 🔥 3. 렌더
    renderLines()
    updateFilterBtnUI()

    document.getElementById("noteScreen").scrollTop = 0
}

function exportData() {

    const password = prompt("백업 비밀번호 입력")
    if (!password) return

    const data = {
        folders: folders,
        viewFilter: viewFilter
    }

    const json = JSON.stringify(data)

    // ⭐ 암호화
    const encrypted = CryptoJS.AES.encrypt(json, password).toString()

    const blob = new Blob([encrypted], { type: "text/plain" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    const date = new Date().toISOString().slice(0, 10)

    a.href = url
    a.download = `outline-secure-${date}.txt`
    a.click()

    URL.revokeObjectURL(url)
}

function importData(file) {

    const password = prompt("비밀번호 입력")
    if (!password) return

    const reader = new FileReader()

    reader.onload = () => {

        try {

            // ⭐ 복호화
            const decrypted = CryptoJS.AES.decrypt(reader.result, password)
            const json = decrypted.toString(CryptoJS.enc.Utf8)

            if (!json) {
                alert("❌ 비밀번호 틀림")
                return
            }

            let data = JSON.parse(json)

            data = normalizeData(data)

            if (!data) {
                alert("잘못된 파일")
                return
            }

            folders = data.folders

            if (data.viewFilter) {
                viewFilter = data.viewFilter
                localStorage.setItem("viewFilter", JSON.stringify(viewFilter))
            }

            save()
            render()

            alert("복원 완료")

        } catch (e) {
            alert("파일 오류 또는 비밀번호 틀림")
        }
    }

    reader.readAsText(file)
}

function openImport() {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".txt"

    input.onchange = () => {
        const file = input.files[0]
        if (file) importData(file)
    }

    input.click()
}

function normalizeData(data) {

    if (!data.folders || !Array.isArray(data.folders)) {
        return null
    }

    data.folders.forEach(folder => {

        // buttons 보정
        if (!folder.buttons || !Array.isArray(folder.buttons)) {
            folder.buttons = []
        }

        folder.buttons.forEach(btn => {

            // lines 보정
            if (!btn.lines || !Array.isArray(btn.lines)) {
                btn.lines = []
            }

            btn.lines.forEach(line => {

                // text
                if (typeof line.text !== "string") {
                    line.text = ""
                }

                // level 보정 (0~3 제한)
                if (typeof line.level !== "number") {
                    line.level = 0
                }
                line.level = Math.max(0, Math.min(line.level, 3))

                // collapsed 보정
                if (line.collapsed === undefined) {
                    line.collapsed = false
                }

            })
        })
    })

    return data
}