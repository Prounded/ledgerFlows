const BANK_BRAND = {
    'BCA': 6500,
    'BNI': 6500,
    'BRI': 6500,
    'Mandiri': 6500,
    'CIMB': 6500,
    'Permata': 6500,
    'OCBC': 6500,
    'Seabank': 6500,
    'Jago': 6500,
    'Sumsel': 6500,
    'Jateng': 6500,
};

const TRANSACTION_ID_START = 10000;
const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1UXMsfldDAF9SeBHXVZ5UgJtJ96gl7kRxHCknZ11j7Mc/edit?usp=sharing';
const GOOGLE_SHEET_EXE =
	'https://script.google.com/macros/s/AKfycbxxrWQXdXR-xBvXwHH_lBgoghmnVqP0SOPMqulnRHcT5Oyx9HzljochDD7ywy4UOM9WTw/exec';

const POPUP_CHANGE_TRANSACTION = `        
<div class="transactionPopupDetail">
    <div class="transactionPopup">
        <div class="transactionHeader">Detail Transaksi</div>

        <div class="inputTransaction">
            <label for="usernameTransaction" class="inputLabel">Nama</label>
            <input id="usernameTransaction" class="transactionInput" type="text" placeholder="Masukkan nama">
        </div>
        
        <div class="inputTransaction">
            <label for="moneyTransaction" class="inputLabel">Nominal Uang</label>
            <input id="moneyTransaction" class="transactionInput" type="number" placeholder="Masukkan Nominal Uang">
        </div>

        <div class="inputTransaction">
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
