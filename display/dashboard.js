function load() {
    const changeDetail = document.querySelectorAll('.changeDetail');
    document.querySelector('.addTransaction').addEventListener('click', addPopup);
    document.querySelector('.editPreviousBalance').addEventListener('click', addPopupBalance);
    document.querySelector('.exportButton').addEventListener('click', exportData);
    document.querySelector('.openLinkButton').addEventListener('click', openLink);

    if (window.innerWidth <= 900) {
        document.querySelector('.allDisplay').setAttribute('design', 'mobileUI');
    }
    else {
        document.querySelector('.allDisplay').setAttribute('design', 'desktopUI');
    }

    window.addEventListener('resize', () => {
        console.log('resized');
        if (window.innerWidth > 900 && document.querySelector('.allDisplay').getAttribute('design') === 'mobileUI') { 
            window.location.reload();
        }
        else if(window.innerWidth <= 900 && document.querySelector('.allDisplay').getAttribute('design') === 'desktopUI') {
            window.location.reload();
        }
    })
    for (let i = 0; i < changeDetail.length; i++){
        changeDetail[i].addEventListener('click', addPopup);
    }

    let transactionData = JSON.parse(localStorage.getItem('transactionData'));
	if (!transactionData) {
		localStorage.setItem('transactionData', JSON.stringify({}));
		transactionData = JSON.parse(localStorage.getItem('transactionData'));
	}

    const now = new Date
    const todayDay = now.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });

    const newTransactionData = JSON.parse(localStorage.getItem('transactionData'));
    for (let i = 0; i < Object.keys(transactionData).length; i++) {
		const currentData = Object.values(transactionData)[i];

		if (currentData.date !== todayDay) {
			delete newTransactionData[currentData.ID];
			localStorage.setItem('transactionData', JSON.stringify(newTransactionData));
        }
        else {
            createNewTransactionDisplay(currentData);
        }
	}

    const inputSaved = JSON.parse(localStorage.getItem('savedInput'));
    if (!inputSaved) {
        localStorage.setItem('savedInput', JSON.stringify({}));
    }

    document.querySelector('.balanceDate').textContent = `(${todayDay})`;
    
    const initialBalance = localStorage.getItem('initialBalance');
    if (!initialBalance) {
        addPopupBalance();
        document.querySelector('.changeInitialPopupDetail').removeEventListener('click', cancelEvent);

        document.querySelector('.buttonAction').removeChild(document.querySelector('.cancelTransaction'));
    }
    else {
        document.querySelector('.balanceValue').textContent = Number(initialBalance).toLocaleString('id-ID');
    }

    calculateAll();
}

function exportData() { 
    Swal.fire({
		title: 'Unggah Transaksi?',
		text: 'Aksi ini akan menghilangkan data yang ada di Google Sheets sebelumnya di hari yang sama',
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#1f8437',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Ya, Unggah!',
		reverseButtons: true,
		scrollbarPadding: false,
		heightAuto: false,
	}).then(async (result) => {
		const dataSaved = JSON.parse(localStorage.getItem('transactionData'));

        console.log(dataSaved);
		const fetching = await fetch(GOOGLE_SHEET_EXE, {
			method: 'POST',
			mode: 'no-cors',
			cache: 'no-cache',
			headers: {
				'Content-Type': 'application/json',
			},
            body: JSON.stringify(
                dataSaved,
			),
		});

        console.log(fetching);
		if (fetching) {
			Swal.fire({
				position: 'center',
				icon: 'success',
				title: 'Upload Berhasil!',
				text: 'Cek Google Sheets untuk melihat laporan penjualan terbaru.',
				showConfirmButton: false,
				timer: 2000,
				scrollbarPadding: false,
				heightAuto: false,
			});
		} else {
			Swal.fire({
				position: 'center',
				icon: 'error',
				title: 'Upload Gagal!',
				text: 'Terjadi kesalahan saat mengunggah laporan penjualan. Coba lagi nanti.',
				showConfirmButton: false,
				timer: 2000,
				scrollbarPadding: false,
				heightAuto: false,
			});
			return;
		}
	});
}

function openLink() { 
    window.open(GOOGLE_SHEET_URL, '_blank');
}

function saveInputUser() {
    const inputType = event.target.id;
    const inputSaved = JSON.parse(localStorage.getItem('savedInput'));

    if (inputType === 'usernameTransaction') {
        inputSaved.username = event.target.value;
    }
    else if (inputType === 'moneyTransaction') {
        inputSaved.balance = event.target.value;
    }
    else if (inputType === 'accountTransaction') {
        inputSaved.account = event.target.value;
    }

    if (document.querySelector('.selectedType')) {
        inputSaved.type = document.querySelector('.selectedType').getAttribute('data-type');
    }

    const bankBrand = document.querySelectorAll('.bankBrand');
    for (let i = 0; i < bankBrand.length; i++){
        if (bankBrand[i].value !== 'default') {
            inputSaved[bankBrand[i].getAttribute('data-bank')] = bankBrand[i].value;
        }
    }

    localStorage.setItem('savedInput', JSON.stringify(inputSaved));
}

function cancelEvent() {
	if (event.target.classList.contains('changeInitialPopupDetail')) {
		closePopup();
	}
}

function addPopupBalance() {
    const beforeInitialBalance = localStorage.getItem('initialBalance');
    
    document.querySelector('.allDisplay').insertAdjacentHTML('beforeend', POPUP_CHANGE_INITIAL_BALANCE);

    if (beforeInitialBalance) {
        document.querySelector('.transactionInput').value = beforeInitialBalance;
    }

    document.querySelector('.cancelTransaction').addEventListener('click', closePopup);

    document.querySelector('.saveTransaction').addEventListener('click', () => {
        saveDataPopup('addInitial');
    });

	document.querySelector('.changeInitialPopupDetail').addEventListener('click', cancelEvent);
}

function addPopup() {
    document.querySelector('.allDisplay').insertAdjacentHTML('beforeend', POPUP_CHANGE_TRANSACTION);

    const transactionTypeCurrent = document.querySelectorAll('.transactionTypeCurrent');
	for (let i = 0; i < transactionTypeCurrent.length; i++) {
        transactionTypeCurrent[i].addEventListener('click', () => {
            changeTransactionType();
            saveInputUser()
        });
    }
    
    document.querySelector('.cancelTransaction').addEventListener('click', closePopup);
    document.querySelector('.saveTransaction').addEventListener('click', () => {
        saveDataPopup('addTransaction')
    });

    document.querySelector('.transactionPopupDetail').addEventListener('click', () => {
        if (event.target.classList.contains('transactionPopupDetail')) {
            closePopup()
        }
    });
    
    const transactionInput = document.querySelectorAll('.transactionInput');

    const transactionAction = document.querySelectorAll('.transactionAction');

    createBankBrand();

    let newID = Number(TRANSACTION_ID_START);
    if (event.target.classList.contains('changeDetail')) {
        const transactionAction = event.target.closest('.transactionAction');
        newID = Number(transactionAction.getAttribute('data-id'));
        let dataPrevious = {};
        dataPrevious.username = transactionAction.querySelector('.transactionUsername').textContent;

        const transactionNominal = transactionAction.querySelector('.transactionNominal').textContent;
        dataPrevious.balance = Number(transactionNominal.replaceAll('Rp ', '').replaceAll('.', '').replaceAll('-', ''));
        
        const transactionAccount = transactionAction.querySelector('.transactionAccount').textContent;
        if (transactionAccount !== '-') {
            dataPrevious.account = transactionAccount;
        }

        if (transactionNominal.includes('-')) {
            dataPrevious.type = 'expense';
        }
        else {
            dataPrevious.type = 'income';
        }

        const transactionBank = transactionAction.querySelector('.transactionBank').textContent.split('→');

        dataPrevious.originalBank = transactionBank[0].trim();
        dataPrevious.targetBank = transactionBank[1].trim();

        preInputData(dataPrevious);
    }
    else if (transactionAction.length > 0) {
        for (let i = 0; i < transactionInput.length; i++) {
			transactionInput[i].addEventListener('input', saveInputUser);
		}
        newID = Number(transactionAction[transactionAction.length - 1].getAttribute('data-id')) + 1;
        preInputData(JSON.parse(localStorage.getItem('savedInput')));
    }
    else {
        preInputData(JSON.parse(localStorage.getItem('savedInput')));
    }

    document.querySelector('.transactionPopupDetail').setAttribute('data-ID', newID);
}

function preInputData(savedData) {
    document.querySelector('#usernameTransaction').value = savedData.username ?? '';
    document.querySelector('#moneyTransaction').value = savedData.balance ?? '';
    document.querySelector('#accountTransaction').value = savedData.account ?? '';
    
    if (savedData.type) {        
        const transactionTypeCurrent = document.querySelectorAll('.transactionTypeCurrent');
        for (let i = 0; i < transactionTypeCurrent.length; i++){
            if (transactionTypeCurrent[i].getAttribute('data-type') === savedData.type) {
                transactionTypeCurrent[i].classList.add('selectedType');
            }
        }
    }

    document.querySelector('.originBankBrand').value = savedData.originalBank ?? 'default';
    document.querySelector('.towardsBankBrand').value = savedData.targetBank ?? 'default';
}

function closePopup() {
    if (document.querySelector('.transactionPopupDetail')) {
		document.querySelector('.allDisplay').removeChild(document.querySelector('.transactionPopupDetail'));
	} else if (document.querySelector('.changeInitialPopupDetail')) {
		document.querySelector('.allDisplay').removeChild(document.querySelector('.changeInitialPopupDetail'));
	}
}

function saveDataPopup(action) {
    if (action === 'addTransaction') {
        if (!document.querySelector('.selectedType')) {
            Swal.fire({
				icon: 'error',
				title: 'ERROR',
				text: 'Kolom jenis transaksi harus dipilih',
			});
            return;
        }

        const usernameInput = document.querySelector('#usernameTransaction').value;
        const moneyInput = document.querySelector('#moneyTransaction').value.replaceAll('.', '');
        const accountInput = document.querySelector('#accountTransaction').value;
        const transactionType = document.querySelector('.selectedType').getAttribute('data-type');
        const originBank = document.querySelector('.originBankBrand').value;
        const targetBank = document.querySelector('.towardsBankBrand').value;

        if (usernameInput && moneyInput) {
            let createNewData = {};
            createNewData.username = usernameInput;

            try {
                createNewData.nominal = Number(moneyInput);
                if (createNewData.nominal === 0) {
                    throw new Error
                }
            }
            catch (error) {
                Swal.fire({
					icon: 'error',
					title: 'ERROR',
					text: 'Pastikan kolom nominal berupa angka',
                });
                return;
            }
            
            if (!accountInput.length) {
                createNewData.account = '-';
            }
            else {
                createNewData.account = Number(accountInput);
                if (Number.isNaN(createNewData.account) || !Number.isInteger(createNewData.account)) {
                    Swal.fire({
						icon: 'error',
						title: 'ERROR',
						text: 'Pastikan kolom nomor rekening berupa angka',
                    });
                    return;
                }
            }

            createNewData.type = transactionType;
            if (originBank === 'default' || targetBank === 'default') {
                Swal.fire({
					icon: 'error',
					title: 'ERROR',
					text: 'Pastikan kolom bank sudah terisi dengan baik!',
				});
                return;
            }
            createNewData.originalBank = originBank;
            createNewData.targetBank = targetBank;

            createNewData.fee = 0;
            if(createNewData.originalBank !== createNewData.targetBank) {
                createNewData.fee = BANK_BRAND[createNewData.originalBank];
            }
            
            const currentDate = new Date();
            createNewData.date = currentDate.toLocaleDateString('id-ID', {
				day: '2-digit',
				month: 'long',
				year: 'numeric',
			});
            
            createNewData.time = currentDate.toLocaleTimeString('id-ID', {
				hour: '2-digit',
				minute: '2-digit',
			});
            
            let transactionData = JSON.parse(localStorage.getItem('transactionData'));
            const transactionAction = document.querySelectorAll('.transactionAction');

            let newID = document.querySelector('.transactionPopupDetail').getAttribute('data-ID');

            createNewData.ID = newID;
            transactionData[newID] = createNewData;

            localStorage.setItem('transactionData', JSON.stringify(transactionData));
            console.log(transactionData);
            
            for (let i = 0; i < transactionAction.length; i++) { 
                if (transactionAction[i].getAttribute('data-id') === String(newID)) {
                    const editedTransaction = transactionAction[i];
                    editedTransaction.querySelector('.transactionUsername').textContent = createNewData.username
						.split(' ')
						.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
						.join(' ');
					if (createNewData.type === 'expense') {
						editedTransaction.querySelector('.transactionNominal').textContent =
							`-Rp ${Number(createNewData.nominal).toLocaleString('id-ID')}`;
					} else if (createNewData.type === 'income') {
						editedTransaction.querySelector('.transactionNominal').textContent =
							`Rp ${Number(createNewData.nominal).toLocaleString('id-ID')}`;
					}
					editedTransaction.querySelector('.transactionAccount').textContent = createNewData.account;

					editedTransaction.querySelector('.transactionBank').textContent =
                        `${createNewData.originalBank} → ${createNewData.targetBank}`;
                    
                    editedTransaction.querySelector('.transactionFee').textContent = `Rp ${Number(createNewData.fee).toLocaleString('id-ID')}`;
                    Swal.fire({
						title: 'Berhasil!',
						text: 'Transaksi berhasil diperbarui.',
						icon: 'success',
					});
                    closePopup();
                    calculateAll();
                    return;
                }
            }
            
            Swal.fire({
				title: 'Berhasil!',
				text: 'Transaksi baru ditambahkan.',
				icon: 'success',
            });
            
            calculateAll();
            createNewTransactionDisplay(createNewData);
            localStorage.setItem('savedInput', JSON.stringify({}));
        }
        else {
            Swal.fire({
				icon: 'error',
				title: 'ERROR',
                text:'Pastikan kolom nama dan nominal terisi dengan tepat!', 
			});
            return;
        }
    }
    else if (action === 'addInitial') {
        try {
            const balanceInput = Number(document.querySelector('.transactionInput').value.replaceAll('.', ''));
            
            if (balanceInput === 0) {
                throw new Error
            }

            localStorage.setItem('initialBalance', balanceInput);
            document.querySelector('.balanceValue').textContent = Number(localStorage.getItem('initialBalance')).toLocaleString('id-ID');
            Swal.fire({
				title: 'Berhasil!',
				text: 'Saldo awal telah berhasil diperbarui.',
				icon: 'success',
			});
        }
        catch (error) {
            Swal.fire({
				icon: 'error',
				title: 'ERROR',
				text: 'Input saldo awal kurang tepat!',
			});

			return;
        }
    }
    calculateAll();
    closePopup();
}

function createBankBrand() {
    const bankBrand = document.querySelectorAll('.bankBrand');
    const bankOptions = Object.keys(BANK_BRAND);
    for (let i = 0; i < bankOptions.length; i++) {
		for (let j = 0; j < bankBrand.length; j++) {
			const optionBank = document.createElement('option');
			optionBank.classList.add('optionBank');
			optionBank.value = bankOptions[i];
			optionBank.textContent = bankOptions[i];
			bankBrand[j].appendChild(optionBank);
		}
	}
    
    for (let i = 0; i < bankBrand.length; i++){
        bankBrand[i].addEventListener('change', saveInputUser);
    }
}

function changeTransactionType() {
    const transactionTypeCurrent = document.querySelectorAll('.transactionTypeCurrent');
    const selectedType = document.querySelector('.selectedType');

    if (event.target !== selectedType) {
        if (selectedType) {
            selectedType.classList.remove('selectedType')
        }
        event.target.classList.add('selectedType')
    }
}

function addEditMobilePopup(event) { 
    const changeTransactionAction = event.target.closest('.changeTransactionAction');
    const transactionID = changeTransactionAction.getAttribute('data-ID');

    const editPopupDetail = document.createElement('div');
    editPopupDetail.classList.add('editPopupDetail');
    editPopupDetail.addEventListener('click', (event) => {
        if (event.target.classList.contains('editPopupDetail')) {
            document.querySelector('.allDisplay').removeChild(document.querySelector('.editPopupDetail'));
            changeTransactionAction.removeChild(document.querySelector('.actionPopup'));
        }
    });

    changeTransactionAction.insertAdjacentHTML('beforeend', POPUP_EDIT_MOBILE);
    document.querySelector('.allDisplay').appendChild(editPopupDetail);

    changeTransactionAction.querySelector('.deleteTransactionButton').addEventListener('click', () => {
        document.querySelector('.allDisplay').removeChild(document.querySelector('.editPopupDetail'));
		changeTransactionAction.removeChild(document.querySelector('.actionPopup'));
        deleteTransaction(transactionID);
    });

    changeTransactionAction.querySelector('.editTransactionButton').addEventListener('click', (event) => {
        document.querySelector('.allDisplay').removeChild(document.querySelector('.editPopupDetail'));
		changeTransactionAction.removeChild(document.querySelector('.actionPopup'));
        addPopup(event);
    });
}

function createNewTransactionDisplay(data) {
    const transactionAction = document.createElement('div');
    transactionAction.setAttribute('data-ID', data.ID)
    transactionAction.classList.add('transactionAction');
    
    if (window.innerWidth > 900) {
        transactionAction.innerHTML = TRANSACTION_HTML;
		transactionAction.querySelector('.changeDetail').addEventListener('click', addPopup);
		transactionAction.querySelector('.deleteTransactionImage').addEventListener('click', () => {
            deleteTransaction(data.ID);
		});
	} else {
        transactionAction.innerHTML = TRANSACTION_HTML_MOBILE;
        transactionAction.querySelector('.editTransactionAction').addEventListener('click', (event) => {
            addEditMobilePopup(event);
        });
	}
    transactionAction.querySelector('.transactionUsername').textContent = data.username.split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    if (data.type === 'expense') {
        transactionAction.querySelector('.transactionNominal').textContent = `-Rp ${Number(data.nominal).toLocaleString('id-ID')}`;
    }
    else if(data.type === 'income') {
        transactionAction.querySelector('.transactionNominal').textContent = `Rp ${Number(data.nominal).toLocaleString('id-ID')}`;
    }
    transactionAction.querySelector('.transactionAccount').textContent = data.account;
    transactionAction.querySelector('.transactionDate').textContent = `${data.date} • ${data.time}`;

    transactionAction.querySelector('.transactionBank').textContent = `${data.originalBank} → ${data.targetBank}`;
    transactionAction.querySelector('.transactionFee').textContent = `Rp ${Number(data.fee).toLocaleString('id-ID')}`;
    
    document.querySelector('.transactionDisplay').appendChild(transactionAction);
}

function deleteTransaction(transactionID) {
    Swal.fire({
		title: 'Hapus Transaksi?',
		text: "Aksi ini tidak dapat dikembalikan!",
		icon: 'warning',
		showCancelButton: true,
		cancelButtonColor: '#d33',
		confirmButtonColor: '#1f8437',
		reverseButtons: true,
		scrollbarPadding: false,
		heightAuto: false,
		confirmButtonText: 'Ya Hapus',
	}).then((result) => {
		if (result.isConfirmed) {
			const transactionAction = document.querySelectorAll('.transactionAction');
			for (let i = 0; i < transactionAction.length; i++) {
				if (transactionAction[i].getAttribute('data-ID') === String(transactionID)) {
					document.querySelector('.transactionDisplay').removeChild(transactionAction[i]);
					const allData = JSON.parse(localStorage.getItem('transactionData'));
					delete allData[transactionID];

					localStorage.setItem('transactionData', JSON.stringify(allData));
				}
			}

			calculateAll();

			Swal.fire({
				title: 'Dihapus!',
				text: 'Transaksi yang anda pilih telah dihapus.',
				icon: 'success',
			});
		}
	});
}

function calculateAll() {
    const transactionData = JSON.parse(localStorage.getItem('transactionData')) ?? {};
    let totalIncome = 0;
    let totalExpense = 0;
    let totalFee = 0;

    for (let i = 0; i < Object.keys(transactionData).length; i++){
        const currentTransactionData = Object.values(transactionData)[i];
        const currentType = currentTransactionData.type;
        const currentFee = currentTransactionData.fee ?? 0;
        totalFee += currentFee;
        
        if (currentType === 'income') {
            totalIncome += currentTransactionData.nominal - currentFee;
        }
        else if (currentType === 'expense') {
            totalExpense += currentTransactionData.nominal + currentFee;
        }
    }

    localStorage.setItem('totalIncome', totalIncome);
    localStorage.setItem('totalExpense', totalExpense);

    document.querySelector('.balanceProfit').textContent = totalIncome.toLocaleString('id-ID');
    document.querySelector('.balanceExpense').textContent = totalExpense.toLocaleString('id-ID');



    const initialBalance = Number(localStorage.getItem('initialBalance'));
    const changeBalance = totalIncome - totalExpense;
    const currentBalance = initialBalance + changeBalance;

    if (changeBalance < 0) {
        document.querySelector('.balanceChange').style.color = 'rgba(223, 14, 14, 0.817)';
        document.querySelector('.balanceChange').textContent = `(Rp ${changeBalance.toLocaleString('id-ID')})`;
    }
    else if(changeBalance > 0){
        document.querySelector('.balanceChange').style.color = 'rgb(102, 169, 102)';
        document.querySelector('.balanceChange').textContent = `(Rp +${changeBalance.toLocaleString('id-ID')})`;
    }
    else {
        document.querySelector('.balanceChange').textContent = ``;
    }

    document.querySelector('.balance').textContent = currentBalance.toLocaleString('id-ID');
}

load()