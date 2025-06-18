document.addEventListener("DOMContentLoaded", () => {
  const localKey = "cashpouch_accounts";
  // 통장 데이터를 {name, balance} 객체 배열로 관리
  let accounts = JSON.parse(localStorage.getItem(localKey)) || [{name: "현금", balance: 0}];

  const accountList = document.getElementById("account-list");
  // account-detail, selected-account-name, balance, increase, decrease 요소는 setup.html에 추가해 주세요
  const accountDetail = document.getElementById("account-detail");
  const selectedAccountName = document.getElementById("selected-account-name");
  const balanceSpan = document.getElementById("balance");
  const increaseBtn = document.getElementById("increase");
  const decreaseBtn = document.getElementById("decrease");

  function saveAccounts() {
    localStorage.setItem(localKey, JSON.stringify(accounts));
  }

  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function parseNumber(str) {
    return Number(str.replace(/,/g, '')) || 0;
  }

  function renderAccounts() {
    accountList.innerHTML = "";
    accounts.forEach(acc => {
      const div = document.createElement("div");
      div.className = "account-item";
      div.textContent = acc.name;
      div.style.cursor = "pointer";
      div.onclick = () => selectAccount(acc.name);
      accountList.appendChild(div);
    });
  }

  let selectedAccount = null;

  function selectAccount(name) {
    selectedAccount = accounts.find(acc => acc.name === name);
    if (!selectedAccount) {
      accountDetail.classList.add("hidden");
      return;
    }
    selectedAccountName.textContent = selectedAccount.name;
    balanceSpan.textContent = formatNumber(selectedAccount.balance);
    accountDetail.classList.remove("hidden");
  }

  function updateBalance(newBalance) {
    if (!selectedAccount) return;
    selectedAccount.balance = Math.max(newBalance, 0);
    balanceSpan.textContent = formatNumber(selectedAccount.balance);
    saveAccounts();
  }

  increaseBtn.addEventListener("click", () => {
    if (!selectedAccount) return;
    updateBalance(selectedAccount.balance + 10000);
  });

  decreaseBtn.addEventListener("click", () => {
    if (!selectedAccount) return;
    updateBalance(selectedAccount.balance - 10000);
  });

  balanceSpan.title = "클릭 시 직접 수정 가능합니다.";

  balanceSpan.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "text";
    input.value = balanceSpan.textContent;
    input.style.width = "120px";
    balanceSpan.replaceWith(input);
    input.focus();

    input.addEventListener("input", () => {
      let val = input.value.replace(/,/g, '');
      if (!/^\d*$/.test(val)) {
        val = val.replace(/[^\d]/g, '');
      }
      input.value = val.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    });

    function finishEditing() {
      let val = parseNumber(input.value);
      updateBalance(val);
      input.replaceWith(balanceSpan);
    }
    input.addEventListener("blur", finishEditing);
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") input.blur();
      if (e.key === "Escape") input.replaceWith(balanceSpan);
    });
  });

  // 통장 추가
  document.getElementById("add-account").addEventListener("click", () => {
    openModal("추가할 통장 이름을 입력하세요:", true, (name) => {
      if (!name) return;
      if (accounts.find(acc => acc.name === name)) {
        alert("이미 존재하는 통장입니다.");
        return;
      }
      accounts.push({name: name, balance: 0});
      saveAccounts();
      renderAccounts();
      selectAccount(name);
    });
  });

  // 통장 삭제
  document.getElementById("remove-account").addEventListener("click", () => {
    openModal("삭제할 통장 이름을 입력하세요:", true, (name) => {
      if (!name) return;
      if (name === "현금") {
        alert("기본 통장은 삭제할 수 없습니다.");
        return;
      }
      const idx = accounts.findIndex(acc => acc.name === name);
      if (idx === -1) {
        alert("존재하지 않는 통장입니다.");
        return;
      }
      const confirmed = confirm(`${name}을 정말 삭제할까요?\n복구는 불가능합니다.`);
      if (confirmed) {
        accounts.splice(idx, 1);
        saveAccounts();
        renderAccounts();
        if (accounts.length > 0) selectAccount(accounts[0].name);
        else accountDetail.classList.add("hidden");
      }
    });
  });

  // 모달 열기 함수 (기존 그대로)
  function openModal(message, showInput = false, callback) {
    const modal = document.getElementById("modal");
    const msg = document.getElementById("modal-message");
    const input = document.getElementById("modal-input");
    msg.textContent = message;
    input.classList.toggle("hidden", !showInput);
    input.value = "";

    modal.classList.remove("hidden");

    document.getElementById("modal-yes").onclick = () => {
      callback(showInput ? input.value.trim() : true);
      modal.classList.add("hidden");
    };
    document.getElementById("modal-no").onclick = () => {
      modal.classList.add("hidden");
    };
  }

  // 초기 렌더링 및 첫 선택
  renderAccounts();
  if (accounts.length > 0) selectAccount(accounts[0].name);
});

