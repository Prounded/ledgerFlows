const EXCHANGE_FIX_RATE = 500;
const BANK_BRAND_TARGET = {
    BCA: {
        mainBank: 'BCA',
        fee: 6500,
    }, 
    BNI: {
        mainBank: 'BNI',
        fee: 6500,
    },
    BRI: {
        mainBank: 'BRI',
        fee: 6500,
    },
    Mandiri: {
        mainBank: 'Mandiri',
        fee: 6500,
    },
    Niaga: {
        mainBank: 'Niaga',
        fee: 6500,
    },
    Permata: {
        mainBank: 'Permata',
        fee: 6500,
    },
    OCBC: {
        mainBank: 'OCBC',
        fee: 6500,
    },
    Seabank: {
        mainBank: 'Seabank',
        fee: 6500,
    },
    Jago: {
        mainBank: 'Jago',
        fee: 6500,
    },
    Sumsel: {
        mainBank: 'Sumsel',
        fee: 6500,
    },
    Jateng: {
        mainBank: 'Jateng',
        fee: 6500,
    },
}

const BANK_BRAND_ORIGINAL = {
	Niaga_BB: {
		mainBank: 'Niaga',
	},
	Niaga_FRT: {
		mainBank: 'Niaga',
	},
	Niaga_IYD: {
		mainBank: 'Niaga',
	},
	Niaga_JY: {
		mainBank: 'Niaga',
	},
	Niaga_SHR: {
		mainBank: 'Niaga',
	},
	BRI_BB: {
		mainBank: 'BRI',
	},
	BRI_FRT: {
		mainBank: 'BRI',
	},
	BRI_IYD: {
		mainBank: 'BRI',
	},
	BRI_JY: {
		mainBank: 'BRI',
	},
	BRI_SHR: {
		mainBank: 'BRI',
	},
	BRI_MARIA: {
		mainBank: 'BRI',
	},
	BCA: {
		mainBank: 'BCA',
	},
	Mandiri: {
		mainBank: 'Mandiri',
	},
	BNI: {
		mainBank: 'BNI',
	},
};

const API_KEY_EXCHANGE_RATE = 'd1f2eef2ceb8432b9dcad8b9d836115c';

const TRANSACTION_ID_START = 10000;
const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1UXMsfldDAF9SeBHXVZ5UgJtJ96gl7kRxHCknZ11j7Mc/edit?usp=sharing';
const GOOGLE_SHEET_EXE =
	'https://script.google.com/macros/s/AKfycbxKri8sdPqgIp5CZZ1cVCzHJCbFYHcyI8rmDnzHTQeSOaJfK1Yjbb8P6xLVy19znYRdqg/exec';

const POPUP_CHANGE_TRANSACTION = `        
<div class="transactionPopupDetail">
    <div class="transactionPopup">
        <div class="transactionHeader">Detail Transaksi</div>

        <div class="inputTransaction nameInput">
            <label for="usernameTransaction" class="inputLabel">Nama</label>
            <input id="usernameTransaction" class="transactionInput" type="text" placeholder="Masukkan nama">
        </div>
        
        <div class="inputTransaction balanceInput">
            <label for="moneyTransaction" class="inputLabel">Nominal Uang</label>
            <div class="balanceInputContainer">
                <select class="currencySelectDisplay">
                    <option class="currencySelect" value="Rp">Rp</option>
                    <option class="currencySelect" value="NT">NT$</option>
                </select>
                <input id="moneyTransaction" class="transactionInput" type="number" placeholder="Masukkan Nominal Uang">
            </div>
        </div>

        <div class="exchangeValueDisplay">NT$ 1 = Rp 520.25</div>

        <div class="inputTransaction accountInput">
            <label for="accountTransaction" class="inputLabel">No Rekening</label>
            <input id="accountTransaction" class="transactionInput" type="text" placeholder="Masukkan Nomor Rekening">
        </div>

        <div class="transactionTypeDiv">
            <div class="transactionTypeCurrent" data-type="income">Pendapatan</div>
            <div class="transactionTypeCurrent" data-type="expense">Pengeluaran</div>
        </div>

        <div class="bankBrandDisplay">
            <select class="bankBrand originBankBrand" data-bank="originalBank">
                <option class="optionBank" value="default">Pilih Bank</option>
            </select>
            
            <div class="arrowSign">&rarr;</div>

            <select class="bankBrand towardsBankBrand" data-bank="targetBank">
                <option class="optionBank" value="default">Pilih Bank</option>
            </select>
        </div>

        <div class="buttonAction">
            <button class="cancelTransaction">Kembali</button>
            <button class="saveTransaction">Simpan</button>
        </div>

    </div>
</div>
`;

const POPUP_CHANGE_INITIAL_BALANCE = `
<div class="changeInitialPopupDetail">
    <div class="changeInitialPopup">
        <div class="changeInitialTitle">Saldo Awal</div>

        <input id="balanceInput" class="transactionInput" type="number" placeholder="Masukkan saldo baru">

        <div class="buttonAction">
            <button class="cancelTransaction">Kembali</button>
            <button class="saveTransaction">Simpan</button>
        </div>

    </div>
</div>
`;

const TRANSACTION_HTML = `
<div class="mainTransactionDiv">
    <div class="transactionImageDiv">
        <img src="./image/transactionDefault.png" class="transactionImage">
    </div>

    <div class="transactionDetail">
        <div class="transactionUsername"></div>
        <div class="transactionNominal"></div>
        <div class="transactionAccount"></div>
        <div class="transactionDate"></div>
    </div>

</div>

<div class="changeTransactionAction">
    <div class="transactionTypeDetail">
        <div class="transactionBank"></div>
        <div class="transactionFee">Rp 5.000</div>
    </div>

    <button class="changeDetail">Ubah</button>

    <div class="deleteTransaction">
        <img src="./image/deleteTransactionIcon.png" class="deleteTransactionImage">
    </div>
    

</div>

`;

const TRANSACTION_HTML_MOBILE = `
<div class="mainTransactionDiv">
    <div class="transactionImageDiv">
        <img src="./image/transactionDefault.png" class="transactionImage">
    </div>

    <div class="transactionDetail">
        <div class="transactionUsername"></div>
        <div class="transactionNominal"></div>
        <div class="transactionAccount"></div>
        <div class="transactionDate"></div>
    </div>

    </div>

    <div class="changeTransactionAction">
    <div class="transactionTypeDetail">
        <div class="transactionBank"></div>
        <div class="transactionFee"></div>
    </div>
    <button class="editTransactionAction" title="Ubah Transaksi">
        <img src="./image/editButtonImage.png" class="editTransactionActionImage">
    </button>
</div>
`;

const POPUP_EDIT_MOBILE = `
<div class="actionPopup">
    <button class="deleteTransactionButton" title="Hapus Transaksi">Hapus</button>
    <button class="editTransactionButton" title="Ubah Transaksi">Ubah</button>
</div>
`;

const LOADING_SPINNER = `
<div class="uploadLoadingContainer">
    <div class="loadingRing"><div></div><div></div><div></div><div></div></div>
    <div class="uploadLoadingText">Mengupload data</div>
</div>
`;