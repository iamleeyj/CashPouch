document.addEventListener("DOMContentLoaded", () => {
  const localKey = "cashpouch_accounts";
  let accounts = JSON.parse(localStorage.getItem(localKey)) || ["현금"];
  const accountList = document.getElementById("account-list");

  function saveAccounts() {
    localStorage.setItem(localKey, JSON.stringify(accounts));
  }

  function renderAccounts() {
    accountList.innerHTML = "";
    accounts.forEach(acc => {
      const div = document.createElement("div");
      div.className = "account-item";
      div.textContent = acc;
      accountList.appendChild(div);
    });
  }

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

document.getElementById("add-account").addEventListener("click", () => {
  openModal("추가할 통장 이름을 입력하세요:", true, (name) => {
    if (!name) return;
    if (accounts.includes(name)) {
      alert("이미 존재하는 통장입니다.");
      return;
    }
    // 바로 추가
    accounts.push(name);
    saveAccounts();
    renderAccounts();
  });
});


document.getElementById("remove-account").addEventListener("click", () => {
  openModal("삭제할 통장 이름을 입력하세요:", true, (name) => {
    if (!name) return;
    if (name === "현금") {
      alert("기본 통장은 삭제할 수 없습니다.");
      return;
    }
    if (!accounts.includes(name)) {
      alert("존재하지 않는 통장입니다.");
      return;
    }
    // 정말 삭제할까요? 확인 후 삭제
    const confirmed = confirm(`${name}을 정말 삭제할까요?\n복구는 불가능합니다.`);
    if (confirmed) {
      accounts = accounts.filter(acc => acc !== name);
      saveAccounts();
      renderAccounts();
    }
  });
});

});
